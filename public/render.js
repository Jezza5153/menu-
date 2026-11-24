// Draws the menu pages from the menu data. Used by both the editor preview and the PDF page.
// Every position below (in pt) was measured from the original PDFs so the look stays the same.
(function () {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pos = (x, y, w, h) => `left:${x}pt;top:${y}pt;` + (w != null ? `width:${w}pt;` : '') + (h != null ? `height:${h}pt;` : '');
  const box = (x, y, w, h, cls, inner, style) => `<div class="abs ${cls || ''}" style="${pos(x, y, w, h)}${style || ''}">${inner || ''}</div>`;
  const t = (x, y, size, cls, text, o) => {
    o = o || {};
    return `<div class="t ${cls || ''}" ${o.p ? `data-p="${o.p}"` : ''} ${o.outline ? `data-t="${esc(text)}"` : ''} style="${pos(x, y)}font-size:${size}pt;${o.style || ''}">${o.html || esc(text)}</div>`;
  };
  const DOTS = ['veg', 'gf', 'lf', 'gfb'];

  function items(menu, id, sec) {
    return sec.groups.map((g, gi) => {
      const rows = g.items.map((it, ii) => {
        if (it.hidden) return '';
        const dots = (it.dots || []).filter((d) => DOTS.includes(d)).map((d) => `<i class="dot ${d}"></i>`).join('');
        const tx = `<div class="nm">${esc(it.name)}${dots ? `<span class="dots">${dots}</span>` : ''}</div>` + (it.desc ? `<div class="ds">${esc(it.desc)}</div>` : '');
        return `<div class="it" data-p="${menu}.${id}.${gi}.${ii}"><div class="tx">${menu === 'drinks' ? `<div class="sq">${tx}</div>` : tx}</div><div class="pr">${esc(it.price)}</div></div>`;
      }).join('');
      if (menu === 'drinks') return `<div class="grp">${g.title ? `<div class="gt bern" data-p="${menu}.${id}.${gi}"><div class="sq">${esc(g.title)}</div></div>` : ''}${rows}</div>`;
      return rows;
    }).join('');
  }

  // one list block (a "card" with the burgundy background, or a plain column)
  function sec(menu, m, id, o) {
    const s = m.sections[id];
    const vars = `--pw:${o.pw}pt;` + (o.gap != null ? `--gap:${o.gap}pt;` : '') + (o.pt != null ? `--pt:${o.pt}pt;` : '') + (o.pl != null ? `--pl:${o.pl}pt;` : '') +
      (o.tr != null ? `--tr:${o.tr}pt;` : '') + (o.st != null ? `--st:${o.st}pt;` : '') + (o.sb != null ? `--sb:${o.sb}pt;` : '');
    return `<div class="sec ${o.cls || ''}" data-sec="${id}" data-limit="${o.limit}" data-gap="${o.gap != null ? o.gap : (menu === 'drinks' ? 18 : 12)}" ` +
      `style="${pos(o.x, o.y, o.w)}min-height:${o.minH || 0}pt;${vars}">${o.before || ''}<div class="list">${items(menu, id, s)}</div></div>`;
  }

  // ─────────────────────────── DINNER ───────────────────────────
  function dinerPages(m) {
    const T = m.texts, S = m.sections, M = 'diner';
    const frame = box(26, 26, 384, 560, 'frame');
    const label = (x, key, size) => t(x, 26, size || 10.9, 'bevan label', T[key], { p: `diner.texts.${key}` });
    const divider = (panel) => panel + frame + t(121, 253, 23.1, 'bevan', 'DE', { style: 'color:var(--wine)' }) +
      box(161, 253, 176, 64, 'wine') + t(169, 253, 23.1, 'bevan outline', 'TAFELAAR', { outline: 1 });

    const p1 = box(15, 17.25, 406.5, 578.25, '', `<img src="assets/diner-cover.png" style="width:100%;height:100%;display:block">`);

    const p2 = box(0, 0, 158, 612, 'panel') + frame + label(186, 'topLabel') +
      t(124, 42, 23.1, 'bevan', 'HET', { style: 'color:var(--wine)' }) + box(185, 44, 135, 54, 'wine') + t(193, 44, 23.1, 'bevan outline', 'CONCEPT', { outline: 1 }) +
      box(58, 125, 320, 199, 'frame') +
      `<div class="para" data-p="diner.texts.concept" style="${pos(67, 152, 302.5)}">${esc(T.concept)}</div>` +
      box(89, 376, 234, 34, 'wine') + t(96, 377, 18.6, 'bevan', S.arrangementen.title, { p: 'diner.arrangementen', style: 'color:#fff' }) +
      box(184, 393, 144, 2, '', '', 'background:#fff') +
      sec(M, m, 'arrangementen', { x: 89, y: 424, w: 256, pw: 46, minH: 152, pl: 7, gap: 20, cls: 'card', limit: 580 });

    const legendRow = (y, cls, html) => `<div class="row" style="top:${y}pt"><i class="dot ${cls}"></i>${html}</div>`;
    const p3 = box(0, 15, 437.1, 211, 'panel') + frame + label(160, 'dayLabel', 10.6) +
      box(26, 36, 158, 46, 'wine') + t(28, 33, 25.7, 'bevan', S.kazen.title, { p: 'diner.kazen', style: 'color:#fff' }) +
      t(203, 37, 25, 'bevan', S.charcuterie.title, { p: 'diner.charcuterie', style: 'color:#110f0e' }) +
      sec(M, m, 'kazen', { x: 26, y: 86, w: 189, pw: 35, minH: 280, gap: 21, cls: 'card', limit: 398 }) +
      sec(M, m, 'charcuterie', { x: 215, y: 86, w: 191, pw: 34, pl: 0, tr: 12, limit: 398 }) +
      sec(M, m, 'borrel', {
        x: 163, y: 404, w: 247, pw: 38, minH: 166, pt: 20, pl: 44, cls: 'card', limit: 580,
        before: `<div class="t bevan outline" data-p="diner.borrel" data-t="${esc(S.borrel.title)}" style="left:3pt;top:14pt;height:138pt;font-size:26.8pt;writing-mode:vertical-rl;transform:rotate(180deg);transform-origin:50% 50%;text-align:center;z-index:2">${esc(S.borrel.title)}</div>`
      }) +
      `<div class="legend" data-p="diner.texts.legendNote" style="${pos(26, 481, 108, 106)}">` +
      legendRow(9, 'veg', 'Vegetarisch') + legendRow(25, 'gf', 'Glutenvrij') + legendRow(43, 'lf', 'Lactosevrij') +
      legendRow(59, 'gfb', `Glutenvrij<br><span style="padding-left:16pt">brood</span><small>${esc(T.legendNote)}</small>`) + `</div>`;

    const p5 = box(279, 0, 158.1, 612, 'panel') + frame + label(178, 'topLabel') +
      t(34, 29, 25.7, 'bevan', S.koud.title, { p: 'diner.koud', style: 'color:var(--wine)' }) +
      box(281, 34, 122, 38, 'wine') + t(304, 34, 20.5, 'bevan outline', S.warm.title, { p: 'diner.warm', outline: 1 }) +
      sec(M, m, 'koud', { x: 26, y: 75, w: 196, pw: 50, minH: 199, pt: 11, gap: 14, cls: 'card', limit: 300 }) +
      t(25, 307, 15.6, 'bevan', S.klassiekers.title, { p: 'diner.klassiekers', style: 'color:var(--wine)' }) +
      sec(M, m, 'klassiekers', { x: 26, y: 333, w: 199, pw: 50, minH: 240, cls: 'card', limit: 580 }) +
      sec(M, m, 'warm', { x: 228, y: 101, w: 181, pw: 30, pl: 0, gap: 28, cls: 'right', limit: 580 });

    const p7 = box(176, 0, 261.1, 612, 'panel') + frame + label(164, 'topLabel') +
      box(26, 69, 280, 40, 'wine') + t(29, 68, 28.2, 'bevan outline', S.desserts.title, { p: 'diner.desserts', outline: 1 }) +
      box(28, 112, 88, 2, '', '', 'background:#fff') +
      sec(M, m, 'desserts', { x: 26, y: 117, w: 221, pw: 52, minH: 242, cls: 'card', limit: 580 }) +
      box(248, 269, 163, 55, 'frame') + box(248, 323, 163, 226, 'frame') +
      `<div class="t bevan" data-p="diner.texts.wistTitle" style="${pos(248, 274, 163)}text-align:center;font-size:23.1pt;color:var(--wine);transform-origin:50% 0">${esc(T.wistTitle)}</div>` +
      `<div class="para" data-p="diner.texts.wist" style="${pos(256.5, 338, 146)}">${esc(T.wist)}</div>` +
      box(267, 509, 124, 9, '', '', 'background:#fff');

    return [
      { name: 'Cover', html: p1 },
      { name: 'Concept & arrangementen', html: p2 },
      { name: 'Kazen, charcuterie & borrel', html: p3 },
      { name: 'Divider', html: divider(box(0, 0, 302, 478, 'panel')) },
      { name: 'Koud, klassiekers & warm', html: p5 },
      { name: 'Divider', html: divider(box(0, 0, 437.1, 612, 'panel') + box(184, 152, 253, 460, '', '', 'background:var(--tan)')) },
      { name: 'Desserts', html: p7 },
      { name: 'Divider', html: divider(box(0, 0, 239, 612, 'panel')) }
    ];
  }

  // ─────────────────────────── DRINKS ───────────────────────────
  function drinksPages(m) {
    const T = m.texts, S = m.sections, M = 'drinks';
    const frame = box(18, 22, 560, 793, 'frame');
    const foot = `<div class="foot bern" data-p="drinks.texts.footer"><span class="fs">${esc(T.footer)}</span></div>`;
    const img = (src, x, y, w, h) => `<img class="abs" src="assets/${src}" style="${pos(x, y, w, h)}object-fit:cover">`;
    const note = (key, x, y, w, h, style) => `<div class="note bern" data-p="drinks.texts.${key}" style="${pos(x, y, w)}min-height:${h}pt;${style}"><div class="sq">${esc(T[key])}</div></div>`;

    const p1 = frame + img('logo.png', 494.7, 31.5, 73.8, 57.7) + img('wineglass.png', 130, 204, 86, 93) +
      t(91, 307, 61, 'bern', 'DE', { style: 'color:var(--wine);letter-spacing:2.2pt' }) + box(164, 296, 343, 90, 'wine') +
      t(170, 307, 61, 'bern hollow', 'DRANKKAART', { style: '-webkit-text-stroke-width:1pt;letter-spacing:2.2pt' }) +
      `<div class="blurb" data-p="drinks.texts.intro" style="${pos(70, 520, 455)}text-align:center;line-height:18.2pt;--sx:.867"><div class="sq">${esc(T.intro)}</div></div>` + foot;

    const p2 = box(343, 0, 253, 842, 'panel') + box(70, 568, 361, 274, 'panel') + frame +
      t(23, 30, 30, 'bern', S.koud.title, { p: 'drinks.koud', style: 'color:#040505' }) +
      `<div class="rule" style="${pos(217, 39, 361)}"></div><div class="rule" style="${pos(217, 46, 361)}"></div>` +
      sec(M, m, 'koud', { x: 18, y: 71, w: 190, pw: 31, minH: 627, pl: 5, tr: 16, cls: 'card', limit: 775 }) +
      box(218, 96, 172, 64, '', '', 'background:var(--brown)') + img('coffeecup.png', 343, 36, 67, 61) +
      t(251, 101, 48, 'bern', '', { html: '<span class="hollow">WARME</span> DRANKEN', style: 'color:var(--wine)' }) +
      `<div class="blurb bern" data-p="drinks.texts.warmBlurb" style="${pos(218, 167, 352)}"><div class="sq">${esc(T.warmBlurb)}</div></div>` +
      sec(M, m, 'koffie', { x: 217, y: 230, w: 161, pw: 31, minH: 388, st: -1, limit: 668 }) +
      sec(M, m, 'specialeKoffie', { x: 395, y: 230, w: 171, pw: 35, minH: 388, st: -1, limit: 668 }) +
      note('juiceNote', 252, 678, 154, 87, 'background:var(--brown);padding:4pt 4pt 4pt 5pt;') +
      note('syrupNote', 414, 678, 154, 87, 'background:var(--brown);padding:4pt 4pt 4pt 7pt;') + foot;

    const p3 = box(179, 0, 417, 275, 'panel') + frame +
      sec(M, m, 'wijnLinks', { x: 28, y: 132, w: 280, pw: 35, minH: 620, st: 7, tr: 8, limit: 775 }) +
      sec(M, m, 'wijnRechts', { x: 328, y: 32, w: 251, pw: 39, minH: 294, st: -10, limit: 405 }) +
      box(113, 93, 195, 48, 'wine') + img('wineglass2.png', 68, 14, 98, 80) +
      t(113, 88, 45.6, 'bern', 'WIJNEN', { style: 'color:#fff;left:159pt;transform:scaleX(.948);transform-origin:0 0' }) +
      note('wineNote1', 312, 414, 259, 58, 'background:var(--wine);border-radius:24pt;padding:8pt 14pt;text-align:center;font-size:13.2pt;line-height:19pt;') +
      note('wineNote2', 312, 506, 259, 79, 'background:var(--wine);border-radius:24pt;padding:11pt 5pt 11pt 9pt;font-size:13.2pt;line-height:19pt;') + foot;

    const p4 = box(15, 542, 315, 167, 'panel') + frame +
      t(18, 45, 48, 'bern', S.bieren.title, { p: 'drinks.bieren', style: 'color:#040505' }) +
      sec(M, m, 'bieren', { x: 16, y: 96, w: 259, pw: 32, minH: 407, pl: 9, pt: 1, cls: 'card', limit: 535 }) +
      `<div class="blurb bern" data-p="drinks.texts.beerBlurb" style="${pos(23, 545, 297)}font-size:13.4pt;line-height:19.8pt"><div class="sq">${esc(T.beerBlurb)}</div></div>` +
      t(342, 87, 36, 'bern', S.sterk.title, { p: 'drinks.sterk', style: 'color:#040505' }) +
      sec(M, m, 'sterk', { x: 342, y: 126, w: 234, pw: 31, minH: 584, pl: 11, pt: 4, cls: 'card', limit: 775 }) + foot;

    const p5 = box(211, 0, 385, 666, 'panel') + frame +
      box(16, 87, 323, 71, '', '', 'background:var(--dark)') + img('cocktailglass.png', 296, 30, 88, 58) +
      t(23, 98, 36.2, 'bern hollow', 'COCKTAILS&MOCKTAILS', { style: 'transform:scaleX(.973);transform-origin:0 0' }) +
      sec(M, m, 'cocktails', { x: 21, y: 177, w: 271, pw: 40, st: 19, sb: -6, limit: 775 }) +
      sec(M, m, 'mocktails', { x: 308, y: 177, w: 268, pw: 40, st: 19, sb: -6, limit: 370 }) +
      note('cocktailNote', 329, 378, 203, 135, 'background:var(--dark);padding:4pt 6pt 6pt 7pt;font-size:13.8pt;line-height:20.1pt;') + foot;

    return [
      { name: 'Cover', html: p1 },
      { name: 'Koude & warme dranken', html: p2 },
      { name: 'Wijnen', html: p3 },
      { name: 'Bieren & sterke dranken', html: p4 },
      { name: 'Cocktails & mocktails', html: p5 }
    ];
  }

  const MENUS = {
    diner: { label: 'Dinner menu', file: 'Diner menu', w: 437.04, h: 612, paper: 'A5', pages: dinerPages },
    drinks: { label: 'Drinks menu', file: 'Drankkaart', w: 595.28, h: 841.89, paper: 'A4', pages: drinksPages }
  };
  const PAPER = { A4: [210, 297], A5: [148, 210] };   // mm
  const MARGIN = 5;                                   // mm of white on every side

  // Put every page on a sheet of paper with an exact white margin on all four sides.
  // The design is scaled to the printable width; the height is then stretched the last
  // 1–3 % so top and bottom margins are exactly the same as the sides.
  function sheets(container, menuKey, paper) {
    const def = MENUS[menuKey], mm = 72 / 25.4, P = PAPER[paper] || PAPER[def.paper];
    const sx = (P[0] - 2 * MARGIN) * mm / def.w, sy = (P[1] - 2 * MARGIN) * mm / def.h;
    container.querySelectorAll('.page').forEach((page) => {
      const sheet = document.createElement('div'), hold = document.createElement('div');
      sheet.className = 'sheet';
      sheet.style.cssText = `width:${P[0]}mm;height:${P[1]}mm;`;
      hold.style.cssText = `position:absolute;left:${MARGIN}mm;top:${MARGIN}mm;width:${P[0] - 2 * MARGIN}mm;height:${P[1] - 2 * MARGIN}mm;overflow:hidden;`;
      page.parentNode.insertBefore(sheet, page);
      sheet.appendChild(hold); hold.appendChild(page);
      page.style.zoom = sx;
      page.style.transformOrigin = '0 0';
      const h = hold.getBoundingClientRect(), r = page.getBoundingClientRect();   // stretch the last bit so it fills the printable area exactly
      page.style.transform = r.width && r.height ? `scale(${h.width / r.width}, ${h.height / r.height})` : `scaleY(${sy / sx})`;
    });
    return { paper: P, sx, sy };
  }

  function render(menuKey, data, container, opts) {
    const def = MENUS[menuKey];
    const pages = def.pages(data[menuKey]);
    container.innerHTML = pages.map((p, i) =>
      `<div class="page ${menuKey} ${opts && opts.editing ? 'editing' : ''}" data-page="${i + 1}" data-name="${esc(p.name)}">${p.html}</div>`).join('');
    return pages;
  }

  // If a list has grown past the space it has, tighten its spacing step by step.
  // Whatever still doesn't fit is reported so the editor can warn about it.
  function fit(container, menuKey) {
    const H = MENUS[menuKey].h, problems = [];
    container.querySelectorAll('.page').forEach((page) => {
      const pr = page.getBoundingClientRect();
      if (!pr.height) return;
      const bottom = (el) => ((el.getBoundingClientRect().bottom - pr.top) / pr.height) * H;
      page.classList.remove('too-full');
      page.querySelectorAll('.sec[data-limit]').forEach((s) => {
        const limit = +s.dataset.limit;
        let gap = +s.dataset.gap, lh = 19.2;
        const minGap = menuKey === 'drinks' ? 5 : 4;
        while (bottom(s) > limit && gap > minGap) { gap -= 1; s.style.setProperty('--gap', gap + 'pt'); }
        if (menuKey === 'drinks') while (bottom(s) > limit && lh > 16) { lh -= 0.4; s.style.setProperty('--lh', lh + 'pt'); }
        if (bottom(s) > limit + 0.5) { page.classList.add('too-full'); problems.push({ page: +page.dataset.page, sec: s.dataset.sec }); }
      });
    });
    return problems;
  }

  window.MenuRender = { MENUS, PAPER, MARGIN, render, fit, sheets, esc };
})();
