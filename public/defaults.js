// The menus exactly as they were in the original PDFs (diner-v6 and Drankkaart versie 5).
// "Reset to original" in the editor goes back to this.
(function () {
  const I = (name, desc, price, dots) => ({ name, desc: desc || '', price: price || '', dots: dots || [] });
  const G = (title, items) => ({ title, items });

  window.MENU_DEFAULTS = {
    version: 1,
    diner: {
      texts: {
        topLabel: 'Diner vanaf 17:00',
        dayLabel: 'Beschikbaar hele dag',
        concept:
          'Bij De Tafelaar draait alles om aandacht. Aandacht voor smaak, voor het product, voor duurzaamheid en natuurlijk voor onze gasten.\n' +
          'We houden van samen genieten. Uit eten met vrienden, een avond uitgebreid tafelen of juist spontaan aanschuiven aan onze gezamenlijke tafel. Alles kan, niets hoeft.\n' +
          'Ons concept is simpel: bestel 2 à 3 gerechtjes per persoon, dit is genoeg voor een avondmaaltijd. Een beetje à la tapas, dus: lekker delen en gewoon kiezen waar je zin in hebt. Dan zetten wij het met plezier voor je op tafel.',
        wistTitle: 'Wist je dat?',
        wist:
          'Wist je dat we bij De Tafelaar ook catering verzorgen voor alle soorten evenementen? Van (kantoor)lunch tot borrel of diner, we denken graag mee. En als je een fijne plek zoekt: onze locatie is ook te boeken voor leuke partijen!\n' +
          'Nieuwsgierig naar de opties (catering of zaal)? Laat het even weten.',
        legendNote: '1,50 extra'
      },
      sections: {
        arrangementen: { title: 'ARRANGEMENTEN', groups: [G('', [
          I('Lekker Borrelen', 'Een leuk charcuterie- en kaasplankje\nMinimaal 2 personen (P.P.)', '12,50'),
          I("Chef's choice", 'Uitgebreid genieten', '48'),
          I('Bijpassend wijnarrangement', '', '28')
        ])] },
        kazen: { title: 'KAZEN', groups: [G('', [
          I('Geitenbrie', 'Vijgenchutney - Sfoglie', '7', ['veg']),
          I('Brokkel Kaas', 'Biermosterd - Dadelbrood', '7,50', ['veg']),
          I('Oudwijker Fiore', 'Vijgenchutney - Sfoglie', '8,50', ['veg']),
          I('Jan zijn kaasje', 'wisselende kaas met bijpassende garnituren', '8', ['veg']),
          I('Chefs Blauwtje', 'wisselende kaas met bijpassende garnituren', '8,50', ['veg'])
        ])] },
        charcuterie: { title: 'CHARCUTERIE', groups: [G('', [
          I('Venkelworstje', 'Biologisch rundvlees - Kesbeke Zuur', '7', ['gf', 'lf']),
          I('Serrano Ham', 'Geconfijte Knoflook - Croutons', '8', ['lf', 'gfb']),
          I('Peper Fuet', 'Varkens vlees - Kesbeke Zuur', '7', ['gf', 'lf']),
          I('Truffel Fuet', 'Kesbeke Zuur', '8,50', ['gf', 'lf']),
          I('Chefs favorietje', 'Vraag de bediening voor meer informatie', 'M.P')
        ])] },
        borrel: { title: 'BORREL', groups: [G('', [
          I('Peppadews', 'Gevulde Pepertjes met Roomkaas', '6,50', ['veg', 'gf']),
          I('Olijven', 'In De Tafelaars Kruidenmix', '4,50', ['veg', 'gf', 'lf']),
          I('Gerookte Notenmix', '', '3,50', ['veg', 'lf'])
        ])] },
        koud: { title: 'KOUD', groups: [G('', [
          I('Miso Zalm', 'Kokos dressing - krokantje - Nori', '15,50', ['lf', 'gf']),
          I('Bieten Carpaccio', 'Geitenkaas - Walnoot - Honing', '10,50', ['veg', 'gf']),
          I('Broodplankje', 'Met verschillende dips', '7,50', ['veg', 'gfb']),
          I('Watermeloen', 'Munt - Citroen - Feta', '13', ['veg', 'gf'])
        ])] },
        klassiekers: { title: 'KLASSIEKERS', groups: [G('', [
          I('Gevulde Eitjes', 'Mayonaise - Bieslook -\n3 stuks', '7,50', ['veg', 'gf', 'lf']),
          I('Carpaccio', 'Biologisch Rundvlees - Structuren van eigeel - Truffel', '12,50', ['gf', 'lf']),
          I('Vitello Tonnato', 'Biologisch Kalfsvlees - Tonijnmayonaise - Kappertjes', '12,50', ['lf', 'gf']),
          I('Bruschetta', 'Knoflook - Olijfolie - Tomaat -\n3 stuks (1 extra €3) met serrano is €1.50 per stuk', '9', ['veg', 'lf', 'gfb'])
        ])] },
        warm: { title: 'WARM', groups: [G('', [
          I('Spare Ribs', 'Van het bot vallend - Sweet & Spicy', '13,50', ['lf', 'gf']),
          I('Runderballetjes', 'Biologisch Rund - Gremolata - Tomatensaus', '11'),
          I('Miso Groententuin', 'Munt - Doperwten - Miso - Mediteraanse groenten', '11,50', ['veg', 'lf']),
          I('Ossobuco', 'Polenta - Gremolata - Demi Glace', '13,50'),
          I('Bao Bun Inari', 'Sriracha Mayonaise - bosui', '12,50', ['veg', 'lf']),
          I('Bao Bun Pulled pork', 'Sriracha Mayonaise - bosui', '12,50', ['lf']),
          I('Japanse Curry', 'Seizoensgroente - Udon noodles', '11,50')
        ])] },
        desserts: { title: 'DESSERTS', groups: [G('', [
          I('Parfait', 'Smaak van de week', '8,50', ['veg', 'gf']),
          I('Dame Blanche', 'Warme Chocolade - Vanille ijs - Slagroom', '8,50', ['veg', 'gf']),
          I('Snicker', 'Snicker, maar dan vegan.', '8,50', ['veg', 'gf', 'lf']),
          I('Local Dessert', 'Vraag de bediening voor meer informatie.', '9', ['veg']),
          I('Kaasplankje', 'Selectie van 3 verschillende kazen.', '15', ['veg'])
        ])] }
      }
    },

    drinks: {
      texts: {
        intro:
          'Bij De Tafelaar draait een drankje om verbinding, net zoals een goed gesprek.\n' +
          'Daarom vind je op onze drankkaart geen standaardlijstje, maar een zorgvuldig samengesteld aanbod vol karakter en verhalen. Van lokale bieren en biologische wijnen tot creatieve cocktails, en van ambachtelijk gebrande koffie tot kruidenrijke thee: elk drankje krijgt de aandacht die het verdient.\n' +
          'Waar mogelijk gebruiken we biologische of lokaal geteelde ingrëdienten en garneringen, omdat we geloven in eerlijke producten met respect voor mens, dier en natuur.',
        warmBlurb:
          'Onze koffie van Boot Koffie en thee van Clipper en Wilder Land zijn met zorg geselecteerd, biologisch, eerlijk en vol karakter. En al onze koffievarianten zijn ook verkrijgbaar als decafé en/of met havermelk.',
        juiceNote: 'Biologisch en/of lokaal geoogst. Onze sappen komen rechtstreeks van de boomgaard en smaken zoals fruit bedoeld is!',
        syrupNote: 'Lokaal, puur en net dat beetje extra: onze Roze Bunker siropen maken elk drankje bijzonder.',
        wineNote1: 'Naast deze wijnen hebben we nog een leuke selectie wijnen op de wijnkaart per fles of halve fles.',
        wineNote2: 'Biologisch en vol karakter: onze wijnen laten je genieten van pure smaken, van frisse witte tot diepe rode wijnen, met aandacht voor mens en natuur!',
        beerBlurb:
          'Onze bieren zijn met zorg geselecteerd en vol karakter. Van onze eigen Tafelaar Pils en Weizen tot bijzondere creaties van lokale brouwerijen: elk glas vertelt een verhaal van vakmanschap en passie. Geniet van vertrouwde smaken of ontdek een nieuwe favoriet, allemaal met aandacht gebrouwen en rechtstreeks van dichtbij.\n\n' +
          'Vraag een van onze collega’s naar onze wissel/seizoenstap. Naast onze selectie bieren zijn er ook leuke flessen van 750 ml te bestellen.',
        cocktailNote:
          'Onze cocktails zijn met zorg gemixt en rijk aan karakter, met pure ingrediënten, verrassende smaken en een vleugje creativiteit. Liever zonder alcohol? Onze mocktails zijn net zo doordacht en sprankelend.',
        footer: 'De Tafelaar'
      },
      sections: {
        koud: { title: 'KOUDE DRANKEN', groups: [
          G('Frisdranken', [
            I('Cola (Biologisch)', '', '3,20'), I('Cola zero', '', '3,20'), I('Sinas (Biologisch)', '', '3,20'),
            I('Tonic (Biologisch)', '', '3,20'), I('Ijsthee peach (Biologisch)', '', '3,20'), I('Coca Cola', '', '3,20'),
            I('Coca Cola zero', '', '3,20'), I('Spa blauw/rood', '', '3'), I('Spa blauw/rood (75 cl)', '', '6,75'),
            I('Fuze tea green', '', '3,20'), I('Fanta Cassis', '', '3,20'), I('Royal Bliss Bitter lemon', '', '3,20'),
            I('Royal Bliss Ginger ale', '', '3,20'), I('Zuivelrijck Chocomelk', '', '3,20'), I('Fever Tree Gingerbeer', '', '4,50'),
            I('Fever Tree Indian Tonic', '', '4,50'), I('Fever Tree Tonic Clementine & Cinnamon', '', '4,50')
          ]),
          G('Vruchtensappen', [
            I('Appelsap (Biologisch)', '', '3,50'), I('Appelschorle (Biologisch, Appelsap & Bruiswater)', '', '3,50'), I('Jus d’Orange', '', '4')
          ]),
          G('Roze Bunker siropen', [
            I('Citrus Movement plat/bruisend', '', '3,50'), I('Gekke Bessen plat/bruisend', '', '3,50'),
            I('Madame Gember plat/bruisend', '', '3,50'), I('Bitter Bloed plat/bruisend', '', '3,50')
          ])
        ] },
        koffie: { title: '', groups: [
          G('Koffie', [
            I('Koffie', '', '3,20'), I('Espresso (enkel)', '', '3,20'), I('Espresso (dubbel)', '', '4,20'), I('Cappuccino', '', '3,70'),
            I('Latte Macchiato', '', '4,20'), I('Flat White', '', '4,70'), I('Koffie verkeerd', '', '3,70'), I('Chai Latte', '', '4,70'),
            I('Warme Chocomelk', '', '3,50'), I('+   slagroom', '', '0,50')
          ]),
          G('Thee', [
            I('Thee (diverse smaken)', '', '3'), I('Verse Munt', '', '4'), I('Verse Gember', '', '4'), I('Verse Munt & Gember', '', '4,50'),
            I('Regenboogthee', '', '4,50'), I('Gember & Sinaasappel met Kaneel', '', '4,50')
          ])
        ] },
        specialeKoffie: { title: '', groups: [
          G('Speciale Koffie', [
            I('Ijskoffie', '', '4,70'), I('Italian Coffee', '', '8,75'), I('French Coffee', '', '8,75'),
            I('Spanish Coffee', '', '8,75'), I('Irish Coffee', '', '8,75'), I('Baileys Coffee', '', '8,75')
          ])
        ] },
        wijnLinks: { title: '', groups: [
          G('Witte wijn', [
            I('Viognier (Languedoc, Frankrijk)', 'Fris, bloemig, perzik, abrikoos, tropisch fruit, droog\nGlas 5,75 - Fles 29', '5,75'),
            I('Pinot Grigio ‘Berico’ (Veneto Italië)', 'Fris, aperitief, kruisbesje, peertje, perzik, zuurtjes\nGlas 6,50 - Fles 32,50', '6,50'),
            I('Rioja Blanco (Domeco de Jarauta, Rioja, Spanje)', 'Garnacha/Viura, houttoets, elegant, rijk, zacht\nGlas 7 - Fles 35', '7')
          ]),
          G('Rode wijn', [
            I('Merlot (Languedoc, Frankrijk)', 'Soepel, fruitig, bessen, bramen, rond, zacht, elegant\nGlas 5,75 - Fles 29', '5,75'),
            I('Montepulciano d‘Abruzzo (El Origini, Abruzzo, Italië)', 'Krachtig, rond, zachte tannines, bosaardbei, blauwe bes, smaakvol\nGlas 6,50 - Fles 32,50', '6,50'),
            I('Rioja ‘Vendimia Seleccionada’ (Domeca de Jarauta, Rioja, Spanje)', 'Rijk, hout, vanille, rood fruit, viooltjes, mineraal, gebalanceerd\nGlas 7,50 - Fles 37,50', '7,50')
          ]),
          G('Rosé', [
            I('Grenache (Languedoc, Frankrijk)', 'Licht, fruitig, aardbei, framboos, bessen, kruidig, zacht, halfdroog\nGlas 5,75 - Fles 29', '5,75'),
            I('Mon Minet (Bordeaux, Frankrijk)', 'Bloemen, anijs, sappig, kruisbes, framboos, souplesse\nGlas 6,50 - Fles 32,50', '6,50')
          ])
        ] },
        wijnRechts: { title: '', groups: [
          G('Bubbels', [
            I('Prosecco Spumante (wit) -Villa Braida, Veneto', 'Glas 6,50 - Fles 39,50', '6,50'),
            I('Prosecco Spumante (rosé) - Villa Braida, Veneto', 'Fles 39,50', '39,50')
          ]),
          G('Dessertwijnen', [
            I('Bonjardim fortified 2012', 'Glas 7 - Fles 48', '7'),
            I('Kopke Ruby Port (Douro, Portugal)', 'Glas 6 - Fles 52', '6'),
            I('Tawny Port (Douro, Portugal)', 'Glas 6,50 - Fles 55', '6,50'),
            I('LBV 2018 Port (Douro, Portugal)', 'Glas 7,50 - Fles 64', '7,50')
          ])
        ] },
        bieren: { title: 'BIEREN', groups: [
          G('Van de tap', [
            I('Tafelaar Pils (25cl)', '', '3,50'), I('Tafelaar Pils (50cl)', '', '6,75'), I('Tafelaar Weizen (33cl)', '', '6'),
            I('Tafelaar Weizen (50cl)', '', '9,50'), I('Amersfoortse Wisseltap (33cl) Zie bord voor prijs', '', ''),
            I('Seizoenswissel Tap (33cl) Zie bord voor prijs', '', '')
          ]),
          G('Bieren op fles of blik', [
            I('‘t Mirakel Lieve Vrouw (blond, 6.4%)', '', '6,50'), I('Eem Tierig (IPA, 6.7%)', '', '7'),
            I('Rockcity Double Date (DIPA, 7.5%)', '', '8'), I('Drie ringen Dubbel (dubbel, 6.5%)', '', '7'),
            I('Drie ringen Silver (dunkelweizen, 5%)', '', '7'), I('’t Mirakel de Vondst (triple, 8.4%)', '', '6,50'),
            I('Eem Potig (stout, 7.5%)', '', '7')
          ]),
          G('Alcoholvrije bieren', [
            I('Hertog Jan 0.0%', '', '4'), I('Amstel Radler 0.0%', '', '4'), I('vandeStreek Playground IPA 0.0%', '', '6,50')
          ])
        ] },
        sterk: { title: 'STERKE DRANKEN', groups: [
          G('Jenever', [I('Jajem Organic, jonge jenever', '', '4,50'), I('The Stillery’s Ouwe Spelt Jenever', '', '7')]),
          G('Whisky’s', [
            I('The Famous Grouse', '', '5'), I('Jameson', '', '5,50'), I('Talisker Skye', '', '6,50'),
            I('Millstone Rye 92', '', '7,50'), I('Millstone Rye 100', '', '11')
          ]),
          G('Gedistilleerd', [
            I('Tafelaartje', '', '5'), I('Erisoff Vodka', '', '4,50'), I('Bacardi Carte Blanca', '', '4,50'),
            I('Bacardi Carte Negra', '', '5,50'), I('Sierra Silver Tequilla', '', '4,50')
          ]),
          G('Likeuren', [
            I('AMICI Limoncello', '', '6'), I('Dik en Schil Passievrucht', '', '7'), I('Dik en Schil Orangecello', '', '7'),
            I('Amaretto Disaronno', '', '5'), I('Malibu', '', '4,50'), I('Licor 43', '', '5'), I('Tia Maria', '', '5'),
            I('Kahlúa', '', '5'), I('Cointreau', '', '6'), I('Jägermeister', '', '4,50'), I('Salmari', '', '4,50')
          ])
        ] },
        cocktails: { title: '', groups: [
          G('Cocktails', [
            I('Aperol Spritz', 'Aperol, Cava, Bruiswater & Sinaasappel', '9,50'),
            I('Limoncello Spritz', 'Limoncello, Cava, Bruiswater, Limoen & Citroen', '9,50'),
            I('Passie Spritz', 'Passiecello, Cava, Bruiswater & Passievrucht', '9,50'),
            I('Moscow Mule', 'Vodka, Gingerbeer & Limoen', '10,50'),
            I('Dark ‘n Stormy', 'Donkere rum, Gingerbeer & Limoen', '10,50'),
            I('Mojito', 'Witte rum, Limoensap, Bruiswater, Rietsuiker & Munt', '11'),
            I('Pornstar Martini', 'Vodka, Passievruchtsap, Limoensap & Vanillesuiker', '12,50'),
            I('Espresso Martini', 'Vodka, Kahlúa, Espresso & Caramelsiroop', '12,50')
          ]),
          G('Gin & Tonic’s', [
            I('Gin & Tonic', 'Gin, Tonic & Komkommer', '9,50'),
            I('Gin & Tonic Citrus', 'Lemon Gin, Tonic, Limoen & Citroen', '10,50'),
            I('Gin & Tonic Herfstig', 'Gin, Clementine & Cinnamon Tonic, Sinaasappel & Kaneel', '10,50')
          ])
        ] },
        mocktails: { title: '', groups: [
          G('Mocktails', [
            I('Gin & Tonic 0.0%', 'Gin 0.0%, Tonic & Komkommer', '9'),
            I('Ginger Mule', 'Gingerbeer, Limoensap & Limoen', '8,50'),
            I('Virgin Mojito', 'Limoensap, Ginger ale, Bruiswater, Rietsuiker & Munt', '9')
          ])
        ] }
      }
    }
  };
})();
