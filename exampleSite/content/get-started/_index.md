---
title: "Get started"
description: "Install Liftoff and ship your first page in five minutes."
---

{{< hero title="From zero to a" titleAccent="running site." subtitle="Pick your platform, drop in the theme, write content. Liftoff stays out of your way." >}}

{{< code language="zsh" featured="true" >}}
hugo new site mysite && cd mysite
hugo mod init example.com/mysite
echo 'theme = "codeberg.org/head1328/hugo-liftoff"' >> hugo.toml
hugo mod get codeberg.org/head1328/hugo-liftoff
hugo server
{{< /code >}}

{{< buttons >}}
{{< button href="#start" variant="primary" size="lg" >}}Start{{< /button >}}
{{< button href="/blueprints" variant="ghost" size="lg" >}}See blueprints{{< /button >}}
{{< /buttons >}}

{{< /hero >}}

{{< section >}}

## Up and running in 4 steps {#start}

{{< banner title="What you need" icon="mdi:information-outline" variant="info" button="Installation|/docs/installation" >}}
Hugo extended `0.156.0` or newer, plus Go and Git for Hugo modules.
Distribution packages often lag behind, so use the commands below.
{{< /banner >}}

{{< steps >}}

{{< step number="1" title="Install Hugo, Go and Git" >}}
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
Open a new terminal afterwards, so the updated `PATH` is picked up.
{{< /tab >}}
{{< tab name="Nix" icon="simple-icons:nixos" >}}
```bash
nix profile add nixpkgs#hugo nixpkgs#go nixpkgs#git
```
{{< /tab >}}
{{< /tabs >}}
{{< /step >}}

{{< step number="2" title="Create the site and wire the theme" >}}
```bash
hugo new site mysite && cd mysite
hugo mod init example.com/mysite
```
Import the theme as a Hugo module:
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

{{< step number="3" title="Write the first page" >}}
A fresh site has no content, so the home page stays empty. Create
`content/_index.md`:
{{< code language="markdown" >}}
+++
title = "My product"
+++

{{</* hero title="Hello," titleAccent="world." subtitle="My first Liftoff page." */>}}
{{</* buttons */>}}
{{</* button href="/docs" variant="primary" size="lg" */>}}Read the docs{{</* /button */>}}
{{</* /buttons */>}}
{{</* /hero */>}}
{{< /code >}}
```bash
hugo server
```
Open [localhost:1313](http://localhost:1313/) and edit the file. The
page reloads on save.
{{< /step >}}

{{< step number="4" title="Go further" >}}
The pieces are independent. Use what you need.

{{< feature-grid >}}
{{< feature-card title="Shortcodes" icon="mdi:code-tags" url="/docs/shortcodes" >}}
Hero, tabs, steps, feature grids, pricing, banners, CTAs.
{{< /feature-card >}}
{{< feature-card title="Configuration" icon="mdi:cog-outline" url="/docs/configuration" >}}
Menus, languages, colour presets, announcement bar, funding.
{{< /feature-card >}}
{{< feature-card title="Blueprints" icon="mdi:view-dashboard-outline" url="/blueprints" >}}
Complete pages to copy: SaaS landing, docs site, OSS project.
{{< /feature-card >}}
{{< /feature-grid >}}
{{< /step >}}

{{< /steps >}}

{{< banner title="Stuck?" icon="mdi:lifebuoy" button="Open an issue|https://codeberg.org/head1328/hugo-liftoff/issues" >}}
Questions are welcome on Codeberg. Include your Hugo version and the
error message.
{{< /banner >}}

{{< /section >}}

{{< section >}}

## Run on any platform

{{< icon-grid data="integrations" >}}

## Consulting

{{< pricing data="consulting" >}}

## What people say

{{< testimonial author="Jane Doe" role="Platform Lead" >}}
We rebuilt our docs and landing in a weekend. The defaults are sensible,
the override points are obvious.

metrics:
- 80% time saved
- 6 sites shipped
{{< /testimonial >}}

{{< /section >}}
