---
title: "Icons"
description: "Die 200.000+ Iconify-Icons nutzen oder eigene SVGs mitliefern."
category: "Inhalte"
weight: 27
---

Liftoff hat ein einziges Icon-Partial, das drei Quellen auflöst: den
Iconify-Katalog, das Material-Design-Icons-Set als Shortcut und
lokale SVGs aus deinem Projekt. Überall dort, wo ein Shortcode oder
Partial einen `icon`-Parameter nimmt, läuft der Wert durch diesen
Resolver.

## Iconify-Icons

Iconify stellt 200.000+ Icons aus 150+ Sets unter einem einheitlichen
Schema bereit: `set:name`. Liftoff holt das SVG einmalig zur Build-
Zeit und cached es.

```markdown
{{</* pill icon="mdi:flash" */>}}Schnell{{</* /pill */>}}
{{</* feature-card title="Doku" icon="mdi:book-open-page-variant" */>}}...{{</* /feature-card */>}}
{{</* button href="/docs" icon="simple-icons:codeberg" */>}}Source{{</* /button */>}}
```

Katalog durchsuchen: [icon-sets.iconify.design](https://icon-sets.iconify.design/).
Auf ein Icon klicken zeigt den Identifier; den `set:name`-Teil
kopieren.

Häufig genutzte Sets:

| Set                 | Katalog                                                   |
|---------------------|-----------------------------------------------------------|
| `mdi`               | Material Design Icons. Große, gleichmäßige Strichstärke.   |
| `simple-icons`      | Brand-Logos (Codeberg, Mastodon, GitHub, Docker, ...).    |
| `lucide`            | Klare Line-Icons im Feather-Stil.                          |
| `tabler`            | Tabler-Set, ähnlich zu Lucide.                             |
| `heroicons`         | Tailwinds Icon-Set.                                        |

Namen ohne Präfix landen automatisch in `mdi:`. `icon="rocket"` ist
also dasselbe wie `icon="mdi:rocket"`. Den Präfix nur dort setzen, wo
du ein anderes Set willst.

## Lokale SVGs

Zwei Fälle brauchen ein lokales SVG: ein eigenes Logo oder ein Glyph,
den es in keinem Iconify-Set gibt.

1. SVG unter `assets/icons/<name>.svg` im Projekt ablegen.
2. Als `local:<name>` referenzieren.

```markdown
{{</* feature-card title="Eigenes" icon="local:my-logo" */>}}
Diese Karte nutzt assets/icons/my-logo.svg als Icon.
{{</* /feature-card */>}}
```

Die Datei muss ein einzelnes `<svg>`-Element sein. Inline-Styles und
`<defs>` funktionieren; externe Referenzen nicht. `width`/`height`
weglassen, damit CSS die Größe über `currentColor` und `font-size`
steuern kann.

Ein kompakter Startpunkt zum Kopieren nach `assets/icons/`:

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 2 2 22h20L12 2z"/>
</svg>
```

## Wo Icons gerendert werden

Shortcodes mit `icon`-Parameter:

- `button` (`icon`, `iconPosition`)
- `feature-card`
- `pill`
- `tab`

Eigene Partials und Layouts können den Resolver direkt aufrufen:

```go-html-template
{{ partial "icon.html" "mdi:rocket-launch" }}
{{ partial "icon.html" "local:my-logo" }}
```

Die Ausgabe ist Inline-SVG, Farben und Größen folgen CSS.

## Caching und Offline-Builds

Iconify-SVGs holt Hugo per `resources.GetRemote` und legt sie im
`getresource`-Cache ab. Der liegt per Default außerhalb des Projekts,
jeder CI-Lauf startet also leer und fragt jedes Icon neu an. Iconify
antwortet geteilten CI-IPs mit `429 Too Many Requests`.

Abhilfe schafft ein Cache im Projekt, der mit eingecheckt wird:

```toml
[caches.getresource]
  dir = ":resourceDir/iconify"
  maxAge = -1
```

Einmal lokal bauen, dann `resources/iconify/` committen. Die CI liest
daraus und holt nur Icons, die seitdem neu dazugekommen sind. Das
Verzeichnis gehört nicht unter `resources/_gen/`, das steht meist in
der `.gitignore`.

Die Cache-Dateien sind rohe HTTP-Responses mit CRLF-Zeilenenden. Als
binary markiert, lassen Git und Line-Ending-Hooks sie in Ruhe:

```text
# .gitattributes
resources/iconify/** binary
```

Lässt sich ein Icon nicht laden, bricht der Production-Build (`hugo`)
ab, damit keine Seite ohne Icons live geht. `hugo server` warnt nur.
