---
title: "Konfiguration"
description: "Site-Params, Menüs, Sprachen und Theme-Overrides."
category: "Setup"
weight: 20
---

Liftoff liest konventionelle Hugo-Konfiguration. Wenige Extras schalten
das Landing-Chrome scharf.

## Pflicht-Einstellungen für Markup

Die Shortcodes geben HTML aus, Goldmark muss es also durchlassen. Fehlt
das, erscheinen Feature-Cards und Hinweisboxen als escapter Text.

```toml
[markup.goldmark.renderer]
  unsafe = true
```

Das Syntax-Highlighting liegt in einem Stylesheet des Themes,
`assets/css/syntax.css`. Damit es greift, muss Chroma Klassennamen
ausgeben statt Inline-Styles. Letztere wirft eine
Content-Security-Policy ohne `'unsafe-inline'` als Erstes weg, und alle
Code-Blöcke stehen farblos da.

```toml
[markup.highlight]
  style      = "github-dark"
  noClasses  = false
  lineNos    = false
  codeFences = true
  tabWidth   = 2
```

Ein anderer Chroma-Style braucht sein eigenes Stylesheet. Es gehört als
`assets/css/syntax.css` in die eigene Site und sticht dort die Variante
des Themes:

```bash
hugo gen chromastyles --style=dracula > assets/css/syntax.css
```

## Site-Params

```toml
[params]
  description     = "Was deine Seite leistet, in einem Satz."
  tagline         = "Im Footer-Brand-Block sichtbar."
  ogImage         = "/images/og.png"
  accent          = "cyan"
  copyrightOwner  = "ACME"
  copyrightSuffix = "Alle Rechte vorbehalten."
```

| Param             | Wird genutzt für              | Standard     |
| ----------------- | ----------------------------- | ------------ |
| `description`     | Meta-Description, Open Graph  | keiner       |
| `tagline`         | Footer-Brand-Block            | keiner       |
| `ogImage`         | Bild für Open Graph und Twitter Card | keiner |
| `accent`          | Farbschema, siehe unten       | `cyan`       |
| `copyrightOwner`  | Copyright-Zeile im Footer     | `site.Title` |
| `copyrightSuffix` | Text hinter der Copyright-Zeile | keiner     |

### Farbschemata

`accent` tauscht die beiden Markenfarben aus. Flächen, Schrift und die
semantischen Farben bleiben unverändert, und jedes Schema bringt eine
passende Light-Mode-Variante mit. Der Umschalter funktioniert also in
beiden Fällen weiter.

| Wert     | Markenfarben       | Wirkung                            |
| -------- | ------------------ | ---------------------------------- |
| `cyan`   | Cyan und Violett   | Standard. Produkt und Developer-Tools |
| `ember`  | Orange und Pink    | Warm, energisch                    |
| `forest` | Smaragd und Cyan   | Ruhig, nach Infrastruktur          |
| `indigo` | Indigo und Magenta | Klassisches SaaS                   |
| `mono`   | Nur Grautöne       | Fast neutral, Inhalt zuerst        |

Die beiden Farben liegen jeweils weit genug auseinander, damit die
Verläufe in der Hero-Überschrift, im CTA-Band und im Brandmark als
Verlauf erkennbar bleiben. `mono` ist die bewusste Ausnahme: Dort ist
der Abstand minimal, und genau das ist die Absicht.

Der Wert landet auf `<html data-accent="...">`. Für eine eigene Palette
überschreibst du stattdessen direkt die Tokens, siehe
[Anpassung](/docs/customization).

Jeder dieser Werte lässt sich pro Sprache unter
`[languages.<code>.params]` überschreiben.

### Repository-Statistik

Zeigt die Sternezahl im Header. Unterstützt sind ausschließlich
`codeberg` und `github`. Der Wert wird im Browser geladen und eine
Stunde im `localStorage` zwischengespeichert, kostet also keine
Build-Zeit.

```toml
[params.repo]
  host  = "codeberg"
  owner = "head1328"
  name  = "liftoff"
```

### Release-Version {#release-version}

Buttons und Hero-Aktionen können neben dem Label eine Version zeigen,
etwa `Download | v1.2.0`. Ein fester Wert wie `version="v1.2.0"`
erscheint genau so. `version="latest"` löst Hugo beim Build auf, der
erste Treffer zählt:

1. **Neuester Release** aus `params.repo`, abgefragt über die REST-API
   des Hosts.
2. **Neuester Tag** desselben Repos, für Projekte, die nur Tags und
   keine Releases veröffentlichen.
3. **`params.release.version`**, von Hand gepflegt.

Liefert keine der drei Quellen etwas, meldet der Build eine Warnung und
der Button erscheint ohne Version.

```toml
[params.release]
  lookup  = true      # false überspringt Schritt 1 und 2
  version = "v1.2.0"  # Fallback, mit lookup = false die einzige Quelle
```

Zur Abfrage:

- Als Host funktionieren nur `codeberg` und `github`, wie bei der
  Sternezahl. Bei allen anderen geht es direkt mit Schritt 3 weiter.
- Die API wird bei `hugo` und `hugo server` aufgerufen, nicht im
  Browser. Besucher kontaktieren den Host nie, eine Content Security
  Policy stört nicht.
- Das Ergebnis bleibt einen Tag im Cache. Ein neuer Release erscheint
  spätestens mit dem ersten Build am Folgetag.
- Netzwerkfehler, Rate-Limits oder unerwartete Antworten erzeugen nur
  eine Warnung, der Build läuft mit dem nächsten Schritt weiter.
- Läuft der Build offline, hinter einem Proxy oder macht die API
  Probleme, schaltet `lookup = false` die Abfrage ab. Die Version kommt
  dann nur noch aus `params.release.version`.
- Wer den `getresource`-Cache von Hugo committet, etwa um in der CI
  dem Rate-Limit von Iconify zu entgehen, bekommt dort durch die Abfrage
  einmal täglich neue Cache-Dateien. Abhilfe: die Abfrage in
  `hugo.toml` abschalten und nur in der CI einschalten, so wie es diese
  Demo-Site macht. Lokal erscheint dann `params.release.version`.

  ```yaml
  # Woodpecker-Step (GitHub Actions: env)
  environment:
    HUGO_PARAMS_RELEASE_LOOKUP: "true"
  ```

### Funding {#funding}

Zeigt Spendenmöglichkeiten an drei Stellen: als Sponsor-Button im
Header, optional als Banner über dem Header und über den
[`funding`-Shortcode](/docs/shortcodes/#funding). Die Schlüssel sind
dieselben wie in einer `FUNDING.yml` für GitHub oder Forgejo:

```toml
[params.funding]
  github    = ["max-mustermann", "acme"]
  liberapay = "max-mustermann"
  ko_fi     = "max-mustermann"
  custom    = ["https://example.com/donate"]
```

Unterstützt werden `github`, `liberapay`, `open_collective`, `ko_fi`,
`patreon`, `buy_me_a_coffee`, `polar`, `thanks_dev`, `tidelift`,
`issuehunt`, `community_bridge`, `lfx_crowdfunding` und `custom`.
Unbekannte Schlüssel erzeugen eine Warnung.

Liegt die Site im selben Repo wie eine `FUNDING.yml`, lässt sich die
Datei als `data/funding.yml` einbinden, statt die Links doppelt zu
pflegen. Sie hat dann Vorrang vor `params.funding`:

```toml
[[module.mounts]]
  source = ".forgejo/FUNDING.yml"   # oder .github/FUNDING.yml
  target = "data/funding.yml"
[[module.mounts]]
  source = "data"                   # eigene Mounts ersetzen den Default
  target = "data"
```

Wo die Links erscheinen:

```toml
[params.sponsor]
  header          = true    # Sponsor-Button im Header
  banner          = false   # wegklickbares Banner über dem Header
  message         = ""      # ersetzt den Standardtext in Popover und Banner
  attention       = "none"  # heartbeat oder pulse, siehe unten
  attentionRepeat = "once"  # oder eine Dauer wie "120s", siehe unten
```

Der Button im Header öffnet ein Popover mit allen Links und
funktioniert auch ohne JavaScript. Das Banner bleibt ausgeblendet,
sobald jemand es einmal weggeklickt hat; ohne JavaScript erscheint es
gar nicht. Ohne Funding-Links rendert das Theme nichts davon.

`attention` lenkt beim Betreten der Site den Blick auf den Button im
Header: Bei `heartbeat` schlägt das Herz und ein Ring läuft um den
Button, bei `pulse` erscheint nur der Ring. Jeder Durchlauf startet eine
Sekunde nach dem Laden und dauert drei Takte. Mit `attentionRepeat =
"once"` läuft die Animation einmal pro Browser-Tab. Eine Dauer wie
`"120s"`, `"2m"` oder eine Zahl in Sekunden wiederholt sie in diesem
Abstand, auch über Seitenwechsel hinweg. Ein Durchlauf dauert gut vier
Sekunden, kürzere Abstände schneiden ihn ab. Hat jemand das Popover
geöffnet, ist im selben Tab Schluss. Wer reduzierte Bewegung eingestellt
hat, sieht die Animation nie.

### Social-Links

Erscheinen im Footer. `icon` ist ein Iconify-Bezeichner. Interne Pfade
werden sprachbewusst aufgelöst, externe URLs bleiben unverändert.

```toml
[[params.social]]
  icon = "simple-icons:codeberg"
  name = "Codeberg"
  url  = "https://codeberg.org/head1328"
```

### Adresse im Footer

Wird als Markdown geparst, Links und Zeilenumbrüche funktionieren also.

```toml
[params.footer]
  address = """
ACME
Musterstadt
[hello@acme.example](mailto:hello@acme.example)
"""
```

## Seitenweise Ausgabe

Die Artikelliste und die Taxonomie-Seiten nutzen Hugos Paginator.

```toml
[pagination]
  pagerSize = 6
```

## Sprachen

```toml
defaultContentLanguage = "en"
defaultContentLanguageInSubdir = true

[languages.en]
  label  = "English"
  locale = "en"
  weight = 1
[languages.de]
  label  = "Deutsch"
  locale = "de"
  weight = 2
```

## Menüs

```toml
[[menus.main]]
  name    = "Docs"
  pageRef = "/docs"
  weight  = 10
```

Footer-Spalten sind Top-Level-Einträge mit Kindern:

```toml
[[menus.footer]]
  identifier = "product"
  name       = "Produkt"
[[menus.footer]]
  parent = "product"
  name   = "Loslegen"
  url    = "/get-started"
```

Nimm für interne Ziele `pageRef` statt `url`. Der Verweis läuft über
Hugos Seiten-Lookup, ein Fehler lässt damit den Build scheitern, statt
einen 404 auszuliefern. Footer-Einträge mit festem `url` werden nicht
geprüft.

## Front Matter

Felder, die das Theme zusätzlich zu Hugos Standards liest.

| Feld          | Bereich             | Bedeutung                            |
| ------------- | ------------------- | ------------------------------------ |
| `hero`        | Listen und Seiten   | Rendert den Hero, siehe [Landingpages](/docs/landing) |
| `description` | alle                | Kartentext und Meta-Description      |
| `image`       | alle                | Open-Graph-Bild der Seite, überschreibt `params.ogImage` |
| `author`      | Artikel             | Erscheint in der Meta-Zeile          |
| `weight`      | Doku                | Reihenfolge im Index und Vor/Zurück  |
| `tags`        | Artikel, Doku       | Taxonomie-Begriffe, verlinkt         |
| `categories`  | Artikel             | Taxonomie-Begriffe, verlinkt         |
| `mark`        | Blueprints          | Kürzel auf der Karte, sonst die ersten zwei Zeichen des Titels |
| `filters`     | Blueprints          | Filter-Buttons im Index, keine Taxonomie |
| `startFrom`   | Blueprints          | Optionaler Link zur passenden Referenzseite |
