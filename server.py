#!/usr/bin/env python3
"""De Tafelaar menu maker — tiny local server.

Serves the editor, saves the menu to data/menu-data.json, and turns the menu
into a PDF with Chrome. Uses only what ships with Python; nothing to install.
"""
import datetime
import json
import os
import shutil
import subprocess
import sys
import tempfile
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(ROOT, "public")
DATA_DIR = os.path.join(ROOT, "data")
DATA = os.path.join(APP, "menu-data.json")   # this file is the published menu
HISTORY = os.path.join(DATA_DIR, "history")
OUT = os.path.join(ROOT, "PDF")
PORT = int(os.environ.get("MENU_PORT", "8321"))
NAMES = {"diner": "Diner menu", "drinks": "Drankkaart"}
BROWSERS = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
]


def find_browser():
    for b in BROWSERS:
        if os.path.exists(b):
            return b
    return None


def make_pdf(menu, size):
    browser = find_browser()
    if not browser:
        raise RuntimeError("Google Chrome was not found on this Mac.")
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(HISTORY, exist_ok=True)
    stamp = datetime.datetime.now().strftime("%Y-%m-%d %H.%M")
    out = os.path.join(OUT, "%s %s %s.pdf" % (NAMES[menu], size, stamp))
    profile = tempfile.mkdtemp(prefix="menu-pdf-")
    try:
        subprocess.run(
            [browser, "--headless=new", "--disable-gpu", "--no-first-run", "--no-pdf-header-footer",
             "--user-data-dir=" + profile, "--virtual-time-budget=15000",
             "--print-to-pdf=" + out, "http://127.0.0.1:%d/print.html?menu=%s&size=%s" % (PORT, menu, size)],
            check=True, timeout=90, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    finally:
        shutil.rmtree(profile, ignore_errors=True)
    if not os.path.exists(out):
        raise RuntimeError("Chrome did not produce a PDF.")
    if os.path.exists(DATA):  # keep a copy of the menu as it was when this PDF was made
        shutil.copy(DATA, os.path.join(HISTORY, "menu-data %s.json" % stamp))
    return out


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=APP, **kw)

    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def send_json(self, obj, code=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        u = urlparse(self.path)
        if u.path == "/api/ping":
            return self.send_json({"ok": True, "app": "tafelaar-menu"})
        if u.path == "/api/data":
            if not os.path.exists(DATA):
                return self.send_json({"error": "no data yet"}, 404)
            with open(DATA, "rb") as f:
                body = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()

    def do_PUT(self):
        if urlparse(self.path).path != "/api/data":
            return self.send_json({"error": "not found"}, 404)
        raw = self.rfile.read(int(self.headers.get("Content-Length", "0")))
        try:
            data = json.loads(raw)
            assert "diner" in data and "drinks" in data
        except Exception:
            return self.send_json({"error": "bad data"}, 400)
        tmp = DATA + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        os.replace(tmp, DATA)
        snapshot()
        self.send_json({"ok": True})

    def publish(self):
        try:
            changed = publish()
        except Exception as e:  # noqa
            return self.send_json({"error": str(e)}, 500)
        self.send_json({"ok": True, "changed": changed})

    def do_POST(self):
        u = urlparse(self.path)
        if u.path == "/api/publish":
            return self.publish()
        if u.path == "/api/site":
            try:
                body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", "0"))) or b"{}")
                return self.send_json(site_sync(body.get("action"), body.get("site") or "", body.get("password") or ""))
            except SiteError as e:
                return self.send_json({"error": str(e), "code": e.code}, 502)
            except Exception as e:  # noqa
                return self.send_json({"error": str(e)}, 500)
        if u.path != "/api/pdf":
            return self.send_json({"error": "not found"}, 404)
        q = parse_qs(u.query)
        menu = q.get("menu", ["diner"])[0]
        if menu not in NAMES:
            return self.send_json({"error": "unknown menu"}, 400)
        try:
            size = q.get("size", ["A4"])[0]
            if size not in ("A4", "A5"):
                return self.send_json({"error": "unknown paper size"}, 400)
            out = make_pdf(menu, size)
        except Exception as e:  # noqa
            return self.send_json({"error": str(e)}, 500)
        if q.get("open", ["1"])[0] == "1":
            subprocess.Popen(["open", out])
        self.send_json({"ok": True, "file": os.path.basename(out), "folder": OUT})


def snapshot():
    """Keep a copy of the menu at most every 10 minutes (last 100 copies) in data/history."""
    try:
        os.makedirs(HISTORY, exist_ok=True)
        old = sorted(f for f in os.listdir(HISTORY) if f.startswith("autosave "))
        now = datetime.datetime.now()
        if old and now.timestamp() - os.path.getmtime(os.path.join(HISTORY, old[-1])) < 600:
            return
        shutil.copy(DATA, os.path.join(HISTORY, "autosave %s.json" % now.strftime("%Y-%m-%d %H.%M")))
        for f in old[:-99]:
            os.remove(os.path.join(HISTORY, f))
    except OSError:
        pass


class SiteError(Exception):
    def __init__(self, msg, code=""):
        super().__init__(msg)
        self.code = code


def site_call(site, method="GET", payload=None, password=""):
    """Talk to the shared menu on the website (api/menu.js on Vercel)."""
    if not (site.startswith("https://") or site.startswith("http://127.0.0.1") or site.startswith("http://localhost")):
        raise SiteError("The website address must start with https://", "address")
    req = Request(site.rstrip("/") + "/api/menu", method=method,
                  data=json.dumps(payload).encode("utf-8") if payload is not None else None,
                  headers={"Content-Type": "application/json", "User-Agent": "tafelaar-menu-maker",
                           "x-menu-password": password.encode("utf-8").decode("latin-1", "ignore")})
    try:
        with urlopen(req, timeout=30) as r:
            raw = r.read()
    except HTTPError as e:
        if e.code == 401:
            raise SiteError("the password is not right", "password")
        if e.code == 404:
            raise SiteError("that address is not the menu website", "address")
        raise SiteError("the website answered with error %d" % e.code)
    except OSError as e:
        raise SiteError("could not reach the website (%s)" % getattr(e, "reason", e))
    try:
        j = json.loads(raw)
        assert isinstance(j, dict)
    except Exception:
        raise SiteError("that address is not the menu website (or it asks for a Vercel login)", "address")
    if not j.get("shared", True):
        raise SiteError("online saving is not switched on for the website yet", "notshared")
    return j


def site_sync(action, site, password):
    if action == "push":
        with open(DATA, encoding="utf-8") as f:
            data = json.load(f)
        site_call(site, "PUT", {"force": True, "data": data}, password)
        return {"ok": True}
    if action == "pull":
        j = site_call(site)
        data = j.get("data")
        if not (isinstance(data, dict) and "diner" in data and "drinks" in data):
            raise SiteError("the website has no saved menu yet")
        os.makedirs(HISTORY, exist_ok=True)
        if os.path.exists(DATA):  # keep what was on this Mac
            shutil.copy(DATA, os.path.join(HISTORY, "before website %s.json" % datetime.datetime.now().strftime("%Y-%m-%d %H.%M.%S")))
        tmp = DATA + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        os.replace(tmp, DATA)
        return {"ok": True, "data": data}
    raise SiteError("unknown action")


def git(*args):
    return subprocess.run(["git", "-C", ROOT] + list(args), capture_output=True, text=True, timeout=90)


def publish():
    """Send the saved menu to GitHub; the website (Vercel) updates itself from there."""
    if git("rev-parse", "--is-inside-work-tree").returncode != 0:
        raise RuntimeError("This folder is not connected to GitHub yet.")
    git("add", "public/menu-data.json")
    changed = git("diff", "--cached", "--quiet").returncode != 0
    if changed:
        stamp = datetime.datetime.now().strftime("%d-%m-%Y %H:%M")
        r = git("commit", "-m", "Menu update " + stamp, "--", "public/menu-data.json")
        if r.returncode != 0:
            raise RuntimeError((r.stderr or r.stdout).strip()[-300:])
    r = git("push")
    if r.returncode != 0:
        raise RuntimeError("Could not reach GitHub: " + (r.stderr or r.stdout).strip()[-300:])
    return changed


def main():
    url = "http://127.0.0.1:%d/" % PORT
    try:
        server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    except OSError:
        try:  # already running? then just show it
            if json.load(urlopen(url + "api/ping", timeout=2)).get("app") == "tafelaar-menu":
                webbrowser.open(url)
                return
        except Exception:
            pass
        sys.exit("Port %d is in use by another program." % PORT)
    print("\n  De Tafelaar menu maker is running:  %s\n  Leave this window open while you work. Close it to stop.\n" % url)
    if "--no-open" not in sys.argv:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
