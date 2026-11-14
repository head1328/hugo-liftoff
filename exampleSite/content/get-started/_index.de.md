---
title: "Loslegen"
description: "Liftoff installieren und in fünf Minuten die erste Seite ausliefern."
---

{{< hero title="In fünf Minuten" titleAccent="online." subtitle="Plattform aussuchen, Theme einklinken, Inhalte pflegen. Liftoff hält sich im Hintergrund." >}}

{{< code language="zsh" featured="true" >}}
hugo new site mysite && cd mysite
hugo mod init example.com/mysite
echo 'theme = "codeberg.org/head1328/hugo-liftoff"' >> hugo.toml
hugo mod get codeberg.org/head1328/hugo-liftoff
hugo server
{{< /code >}}

{{< buttons >}}
{{< button href="#start" variant="primary" size="lg" >}}Loslegen{{< /button >}}
{{< button href="/blueprints" variant="ghost" size="lg" >}}Blueprints ansehen{{< /button >}}
{{< /buttons >}}

{{< /hero >}}

{{< section >}}

## In vier Schritten startklar {#start}

{{< banner title="Das brauchst du" icon="mdi:information-outline" variant="info" button="Installation|/docs/installation" >}}
Hugo extended ab `0.156.0`, dazu Go und Git für Hugo-Module. Die Pakete
der Distributionen hinken oft hinterher, nimm deshalb die Befehle unten.
{{< /banner >}}

{{< steps >}}

{{< step number="1" title="Hugo, Go und Git installieren" >}}
{{< tabs >}}
{{< tab name="macOS" icon="simple-icons:apple" >}}
```zsh
brew install hugo go git
```
{{< /tab >}}
{{< tab name="Linux" icon="simple-icons:linux" >}}
```bash
sudo snap install hugo
sudo snap install go --classic
sudo apt install git
```
{{< /tab >}}
{{< tab name="Windows" icon="mdi:microsoft-windows" >}}
```powershell
winget install Hugo.Hugo.Extended
winget install GoLang.Go
winget install Git.Git
```
Danach ein neues Terminal öffnen, damit der geänderte `PATH` greift.
{{< /tab >}}
{{< tab name="Nix" icon="simple-icons:nixos" >}}
```bash
nix profile add nixpkgs#hugo nixpkgs#go nixpkgs#git
```
{{< /tab >}}
{{< /tabs >}}
{{< /step >}}

{{< step number="2" title="Site anlegen und Theme einklinken" >}}
```bash
hugo new site mysite && cd mysite
hugo mod init example.com/mysite
```
Das Theme als Hugo-Modul importieren:
```toml
# hugo.toml
[module]
  [[module.imports]]
    path = "codeberg.org/head1328/hugo-liftoff"
```
```bash
hugo mod get codeberg.org/head1328/hugo-liftoff
```
{{< /step >}}

{{< step number="3" title="Erste Seite schreiben" >}}
Eine frische Site hat keine Inhalte, die Startseite bleibt also leer.
Leg `content/_index.md` an:
{{< code language="markdown" >}}
+++
title = "Mein Produkt"
+++

{{</* hero title="Hallo," titleAccent="Welt." subtitle="Meine erste Seite mit Liftoff." */>}}
{{</* buttons */>}}
{{</* button href="/docs" variant="primary" size="lg" */>}}Zur Doku{{</* /button */>}}
{{</* /buttons */>}}
{{</* /hero */>}}
{{< /code >}}
```bash
hugo server
```
[localhost:1313](http://localhost:1313/) öffnen und die Datei
bearbeiten. Beim Speichern lädt die Seite neu.
{{< /step >}}

{{< step number="4" title="Weitermachen" >}}
Die Bausteine stehen einzeln. Pick dir raus, was du gerade brauchst.

{{< feature-grid >}}
{{< feature-card title="Shortcodes" icon="mdi:code-tags" url="/docs/shortcodes" >}}
Hero, Tabs, Steps, Feature-Grids, Pricing, Banner, CTAs.
{{< /feature-card >}}
{{< feature-card title="Konfiguration" icon="mdi:cog-outline" url="/docs/configuration" >}}
Menüs, Sprachen, Farbschemata, Ankündigungsleiste, Funding.
{{< /feature-card >}}
{{< feature-card title="Blueprints" icon="mdi:view-dashboard-outline" url="/blueprints" >}}
Fertige Seiten zum Abkupfern: SaaS-Landing, Doku-Site, OSS-Projekt.
{{< /feature-card >}}
{{< /feature-grid >}}
{{< /step >}}

{{< /steps >}}

{{< banner title="Hängst du fest?" icon="mdi:lifebuoy" button="Issue aufmachen|https://codeberg.org/head1328/hugo-liftoff/issues" >}}
Fragen sind auf Codeberg willkommen. Gib deine Hugo-Version und die
Fehlermeldung mit an.
{{< /banner >}}

{{< /section >}}

{{< section >}}

## Läuft überall

{{< icon-grid data="integrations" >}}

## Beratung & Entwicklung

{{< pricing data="consulting-de" >}}

## Stimmen

{{< testimonial author="Jane Doe" role="Platform Lead" >}}
Doku und Landingpage haben wir an einem Wochenende neu aufgesetzt.
Die Voreinstellungen passen, und wo man Hand anlegen muss, sieht man
sofort.

metrics:
- 80 % Zeit gespart
- 6 Seiten live
{{< /testimonial >}}

{{< /section >}}
