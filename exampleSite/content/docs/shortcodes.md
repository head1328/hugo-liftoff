---
title: "Shortcodes"
description: "Reference for every shortcode the theme ships with."
category: "Authoring"
weight: 40
---

Liftoff ships a small set of shortcodes you can compose freely. Each
entry lists its parameters, a code example, and a live preview.

Two features need no shortcode at all, because they are markdown render
hooks: callouts and code blocks.

## Callouts {#callouts}

Blockquotes starting with an alert marker render as a callout. The
label is translated through `i18n`, so it follows the page language.

```markdown
> [!NOTE]
> Neutral background information.

> [!TIP]
> A shortcut or a better approach.

> [!WARNING]
> Something that bites later.

> [!DANGER]
> Something that breaks the build now.
```

`[!CAUTION]` is accepted as an alias for `[!DANGER]`. A blockquote
without a marker renders as a plain quotation.

> [!TIP]
> This is what a callout looks like. The four types differ only in
> colour and label.

## Code blocks {#code-blocks}

Fenced code blocks get a language label and a copy button
automatically. No shortcode needed.

````markdown
```bash
hugo server --source exampleSite --themesDir ../..
```
````

A fence without a language falls back to `text`. Use the
[`code`](#code) shortcode instead when you need the `wide` or
`featured` variants.

## `hero` {#hero}

Section-width hero with optional accent on the headline. Wrap any
additional blocks (code, buttons, pills) inside the body. They render
inside the hero column.

| Param         | Type     | Description                                                  |
|---------------|----------|--------------------------------------------------------------|
| `title`       | string   | Main headline.                                               |
| `titleAccent` | string   | Second half of the headline, rendered in the accent color.   |
| `subtitle`    | string   | Lead text below the headline. Markdown allowed.              |
| _body_        | markdown | Free content slot: code blocks, buttons, pills, anything.    |

```markdown
{{</* hero title="From zero to a" titleAccent="running site." subtitle="Pick your platform, drop in the theme, write content." */>}}

{{</* buttons */>}}
  {{</* button href="/docs" variant="primary" size="lg" */>}}Read the docs{{</* /button */>}}
{{</* /buttons */>}}

{{</* /hero */>}}
```

{{< hero title="From zero to a" titleAccent="running site." subtitle="Pick your platform, drop in the theme, write content." >}}

{{< buttons >}}
  {{< button href="/docs" variant="primary" size="lg" >}}Read the docs{{< /button >}}
{{< /buttons >}}

{{< /hero >}}

---

## `pills` / `pill` {#pills--pill}

Compact row of highlight tags for hero or section intros. Each `pill`
takes an optional Iconify icon.

| Param        | Type     | Description                              |
|--------------|----------|------------------------------------------|
| pill `icon`  | string   | Iconify identifier, e.g. `mdi:code-tags`. |
| pill _body_  | text     | Label.                                   |

```markdown
{{</* pills */>}}
  {{</* pill icon="mdi:code-tags" */>}}Any language{{</* /pill */>}}
  {{</* pill icon="mdi:translate" */>}}Multilingual{{</* /pill */>}}
  {{</* pill icon="mdi:flash" */>}}Static & fast{{</* /pill */>}}
{{</* /pills */>}}
```

{{< pills >}}
  {{< pill icon="mdi:code-tags" >}}Any language{{< /pill >}}
  {{< pill icon="mdi:translate" >}}Multilingual{{< /pill >}}
  {{< pill icon="mdi:flash" >}}Static & fast{{< /pill >}}
{{< /pills >}}

---

## `buttons` / `button` {#buttons--button}

`buttons` lays out a wrapping row; `button` renders a single link
styled as a button. Internal hrefs run through `relLangURL`; URLs
starting with `http(s)://` or `mailto:` are left untouched.

| Param          | Type   | Description                                              |
|----------------|--------|----------------------------------------------------------|
| `href`         | string | Link target.                                             |
| `target`       | string | HTML target, e.g. `_blank`. Adds `rel=noopener noreferrer`. |
| `variant`      | enum   | `primary` (default), `secondary`, `ghost`.               |
| `size`         | enum   | `sm`, `md` (default), `lg`.                              |
| `icon`         | string | Iconify identifier.                                      |
| `iconPosition` | enum   | `left` (default) or `right`.                             |
| `version`      | string | Version badge: fixed string or `latest`, see [configuration](/docs/configuration/#release-version). |
| _body_         | text   | Label.                                                   |

```markdown
{{</* buttons */>}}
  {{</* button href="/docs" variant="primary" size="lg" icon="mdi:rocket-launch" */>}}Get started{{</* /button */>}}
  {{</* button href="/docs" variant="ghost" size="lg" icon="mdi:arrow-right" iconPosition="right" */>}}Read the docs{{</* /button */>}}
{{</* /buttons */>}}
```

{{< buttons >}}
  {{< button href="/docs" variant="primary" size="lg" icon="mdi:rocket-launch" >}}Get started{{< /button >}}
  {{< button href="/docs" variant="ghost" size="lg" icon="mdi:arrow-right" iconPosition="right" >}}Read the docs{{< /button >}}
{{< /buttons >}}

Download buttons pair an OS icon with the current version:

```markdown
{{</* buttons */>}}
  {{</* button href="https://codeberg.org/head1328/hugo-liftoff/tags" variant="primary" icon="simple-icons:apple" version="latest" */>}}Download for macOS{{</* /button */>}}
  {{</* button href="https://codeberg.org/head1328/hugo-liftoff/tags" variant="secondary" icon="simple-icons:linux" version="latest" */>}}Download for Linux{{</* /button */>}}
  {{</* button href="https://codeberg.org/head1328/hugo-liftoff/tags" variant="secondary" icon="mdi:microsoft-windows" version="latest" */>}}Download for Windows{{</* /button */>}}
{{</* /buttons */>}}
```

{{< buttons >}}
  {{< button href="https://codeberg.org/head1328/hugo-liftoff/tags" variant="primary" icon="simple-icons:apple" version="latest" >}}Download for macOS{{< /button >}}
  {{< button href="https://codeberg.org/head1328/hugo-liftoff/tags" variant="secondary" icon="simple-icons:linux" version="latest" >}}Download for Linux{{< /button >}}
  {{< button href="https://codeberg.org/head1328/hugo-liftoff/tags" variant="secondary" icon="mdi:microsoft-windows" version="latest" >}}Download for Windows{{< /button >}}
{{< /buttons >}}

---

## `code` {#code}

A standalone code block with the same chrome as the markdown
codeblock render hook: language label, copy button, and an optional
animated gradient ring for hero placement.

| Param      | Type     | Description                                              |
|------------|----------|----------------------------------------------------------|
| `language` | string   | Chroma language id. Default `text`.                      |
| `wide`     | bool     | `true` to disable the hero width cap.                    |
| `featured` | bool     | `true` to draw an animated gradient border.              |
| _body_     | text     | Raw code. No backticks needed.                           |

```markdown
{{</* code language="zsh" featured="true" */>}}
hugo new site mysite && cd mysite
hugo mod init example.com/mysite
hugo mod get codeberg.org/head1328/hugo-liftoff
hugo server
{{</* /code */>}}
```

{{< code language="zsh" featured="true" >}}
hugo new site mysite && cd mysite
hugo mod init example.com/mysite
hugo mod get codeberg.org/head1328/hugo-liftoff
hugo server
{{< /code >}}

---

## `tabs` / `tab` {#tabs--tab}

Tabbed content panels. `tabs` wraps one or more `tab` shortcodes. The
first tab is active by default. Inner content is rendered as
markdown, so fenced code blocks (and nested shortcodes) work.

| Param          | Type     | Description                                          |
|----------------|----------|------------------------------------------------------|
| tabs `wide`    | bool     | `true` to disable the hero width cap.                |
| tabs `featured`| bool     | `true` to draw an animated gradient border.          |
| tab `name`     | string   | Label shown in the tab button.                       |
| tab `icon`     | string   | Iconify identifier shown left of the label.          |
| tab _body_     | markdown | Panel body. Code fences and shortcodes allowed.      |

````markdown
{{</* tabs */>}}
  {{</* tab name="macOS" icon="simple-icons:apple" */>}}
  ```zsh
  brew install hugo
  ```
  {{</* /tab */>}}
  {{</* tab name="Linux" icon="simple-icons:linux" */>}}
  ```bash
  sudo apt install hugo
  ```
  {{</* /tab */>}}
  {{</* tab name="Windows" icon="mdi:microsoft-windows" */>}}
  ```powershell
  winget install Hugo.Hugo.Extended
  ```
  {{</* /tab */>}}
{{</* /tabs */>}}
````

{{< tabs >}}
  {{< tab name="macOS" icon="simple-icons:apple" >}}
  ```zsh
  brew install hugo
  ```
  {{< /tab >}}
  {{< tab name="Linux" icon="simple-icons:linux" >}}
  ```bash
  sudo apt install hugo
  ```
  {{< /tab >}}
  {{< tab name="Windows" icon="mdi:microsoft-windows" >}}
  ```powershell
  winget install Hugo.Hugo.Extended
  ```
  {{< /tab >}}
{{< /tabs >}}

---

## `accordion` / `accordion-item` {#accordion--accordion-item}

Collapsible items for FAQs and reference lists. `accordion` wraps one
or more `accordion-item` shortcodes. Each item is a native `<details>`
element, so it works without JavaScript. The item title doubles as
anchor id: `#is-liftoff-free` links straight to the item titled
"Is liftoff free?".

| Param                  | Type     | Description                                     |
|------------------------|----------|-------------------------------------------------|
| accordion `exclusive`  | bool     | `true` keeps at most one item open at a time.   |
| accordion-item `title` | string   | Summary line, also the source of the anchor id. |
| accordion-item `open`  | bool     | `true` renders the item expanded.               |
| accordion-item _body_  | markdown | Item content. Code fences and shortcodes work.  |

````markdown
{{</* accordion exclusive="true" */>}}

{{</* accordion-item title="Is liftoff free?" open="true" */>}}
Yes. The theme is MIT licensed.
{{</* /accordion-item */>}}

{{</* accordion-item title="Which Hugo version do I need?" */>}}
Hugo extended 0.146 or newer:

```zsh
hugo version
```
{{</* /accordion-item */>}}

{{</* /accordion */>}}
````

{{< accordion exclusive="true" >}}

{{< accordion-item title="Is liftoff free?" open="true" >}}
Yes. The theme is MIT licensed.
{{< /accordion-item >}}

{{< accordion-item title="Which Hugo version do I need?" >}}
Hugo extended 0.146 or newer:

```zsh
hugo version
```
{{< /accordion-item >}}

{{< /accordion >}}

---

## `steps` / `step` {#steps--step}

Vertical, numbered onboarding flow. `steps` is the container; each
`step` is a self-contained card with a "Step N: Title" header and a
markdown body that accepts nested shortcodes.

| Param           | Type     | Description                                        |
|-----------------|----------|----------------------------------------------------|
| step `number`   | string   | Number shown in the header.                        |
| step `title`    | string   | Step title.                                        |
| step _body_     | markdown | Step content. Code, tabs, feature-grid all work.   |

````markdown
{{</* steps */>}}

{{</* step number="1" title="Install Hugo" */>}}
```zsh
brew install hugo
```
{{</* /step */>}}

{{</* step number="2" title="Wire the theme" */>}}
Add the module import to your `hugo.toml`, then:

```zsh
hugo mod tidy
hugo server
```
{{</* /step */>}}

{{</* /steps */>}}
````

{{< steps >}}

{{< step number="1" title="Install Hugo" >}}
```zsh
brew install hugo
```
{{< /step >}}

{{< step number="2" title="Wire the theme" >}}
Add the module import to your `hugo.toml`, then:

```zsh
hugo mod tidy
hugo server
```
{{< /step >}}

{{< /steps >}}

Steps compose with the other shortcodes. Wrap the whole sequence in
`tabs` to give each OS its own independent step flow. The number and
amount of steps can differ per tab.

`````markdown
{{</* tabs */>}}
  {{</* tab name="macOS" icon="simple-icons:apple" */>}}
  {{</* steps */>}}
  {{</* step number="1" title="Install Hugo" */>}}
  ```zsh
  brew install hugo
  ```
  {{</* /step */>}}
  {{</* step number="2" title="Run the server" */>}}
  ```zsh
  hugo server
  ```
  {{</* /step */>}}
  {{</* step number="3" title="Pick a starting point" */>}}
  {{</* feature-grid */>}}
  {{</* feature-card title="Landing" icon="mdi:rocket-launch" */>}}
  Hero, OS tabs, code demo, feature grid, pricing, CTA.
  {{</* /feature-card */>}}
  {{</* feature-card title="Docs" icon="mdi:book-open-page-variant" */>}}
  Sidebar-free layout, on-this-page TOC, render hooks.
  {{</* /feature-card */>}}
  {{</* /feature-grid */>}}
  {{</* /step */>}}
  {{</* /steps */>}}
  {{</* /tab */>}}
  {{</* tab name="Linux" icon="simple-icons:linux" */>}}
  {{</* steps */>}}
  {{</* step number="1" title="Install Hugo" */>}}
  ```bash
  sudo apt install hugo
  ```
  {{</* /step */>}}
  {{</* /steps */>}}
  {{</* /tab */>}}
{{</* /tabs */>}}
`````

{{< tabs >}}
  {{< tab name="macOS" icon="simple-icons:apple" >}}
  {{< steps >}}
  {{< step number="1" title="Install Hugo" >}}
  ```zsh
  brew install hugo
  ```
  {{< /step >}}
  {{< step number="2" title="Run the server" >}}
  ```zsh
  hugo server
  ```
  {{< /step >}}
  {{< step number="3" title="Pick a starting point" >}}
  {{< feature-grid >}}
  {{< feature-card title="Landing" icon="mdi:rocket-launch" >}}
  Hero, OS tabs, code demo, feature grid, pricing, CTA.
  {{< /feature-card >}}
  {{< feature-card title="Docs" icon="mdi:book-open-page-variant" >}}
  Sidebar-free layout, on-this-page TOC, render hooks.
  {{< /feature-card >}}
  {{< /feature-grid >}}
  {{< /step >}}
  {{< /steps >}}
  {{< /tab >}}
  {{< tab name="Linux" icon="simple-icons:linux" >}}
  {{< steps >}}
  {{< step number="1" title="Install Hugo" >}}
  ```bash
  sudo apt install hugo
  ```
  {{< /step >}}
  {{< /steps >}}
  {{< /tab >}}
{{< /tabs >}}

---

## `screenshot` {#screenshot}

Image with an optional caption. A click opens it full size in a
lightbox; Esc, the close button or a click on the backdrop closes it.
Without JavaScript the link opens the image directly.

| Param     | Type   | Description                                                 |
|-----------|--------|-------------------------------------------------------------|
| `src`     | string | Page bundle resource, falls back to a file under `assets/`. |
| `alt`     | string | Alternative text.                                           |
| `caption` | string | Caption below the image and in the lightbox.                |

A missing file only logs a warning, so the page builds before every
screenshot exists.

```markdown
{{</* screenshot src="img/screenshot-demo.svg" alt="Landing page" caption="Hero with code panel and feature cards." */>}}
```

{{< screenshot src="img/screenshot-demo.svg" alt="Landing page" caption="Hero with code panel and feature cards." >}}

---

## `carousel` / `slide` {#carousel--slide}

Several images in one frame. Swipe, scroll, the arrows or the dots
move between them; a click opens the current image in the lightbox.
Without JavaScript the strip still scrolls, only the controls are
missing.

| Param         | Type   | Description                                                  |
|---------------|--------|--------------------------------------------------------------|
| `images`      | string | Glob such as `gallery/*`, see below. Ignored when slides are nested. |
| `aspectRatio` | enum   | `16-9` (default), `21-9`, `4-3`, `3-2`, `1-1`. Images are cropped to fit. |
| `interval`    | int    | Autoplay delay in ms. `0` (default) turns autoplay off.      |

`slide` takes `src`, `alt` and `caption`, the same as
[screenshot](#screenshot). Use it when you want alt text and captions
inline:

```markdown
{{</* carousel interval="5000" */>}}
  {{</* slide src="img/carousel/landing.png" alt="Landing page" caption="Landing page with code-first hero." */>}}
  {{</* slide src="img/carousel/docs.png" alt="Docs index" caption="Docs index with topic cards." */>}}
  {{</* slide src="img/carousel/articles.png" alt="Article list" caption="Article list." */>}}
  {{</* slide src="img/carousel/blueprints.png" alt="Blueprints" caption="Blueprints with filters." */>}}
{{</* /carousel */>}}
```

{{< carousel interval="5000" >}}
  {{< slide src="img/carousel/landing.png" alt="Landing page" caption="Landing page with code-first hero." >}}
  {{< slide src="img/carousel/docs.png" alt="Docs index" caption="Docs index with topic cards." >}}
  {{< slide src="img/carousel/articles.png" alt="Article list" caption="Article list." >}}
  {{< slide src="img/carousel/blueprints.png" alt="Blueprints" caption="Blueprints with filters." >}}
{{< /carousel >}}

For a whole folder, `images` is shorter. It matches page bundle
resources first, then files under `assets/`. Alt text and captions come
from the bundle's front matter:

```markdown
---
resources:
  - src: gallery/01.jpg
    title: Alt text for the first image
    params:
      caption: Caption for the first image
---

{{</* carousel images="gallery/*" aspectRatio="21-9" */>}}
```

Autoplay pauses while the pointer or focus is on the carousel and
stays off for visitors who prefer reduced motion. Images are resized
to WebP at build time; SVG and GIF are used as is.

---

## `section` {#section}

Plain container with the standard content width. Use it to group
sections on shortcode-driven pages and to keep prose centered.

| Param   | Type | Description                                    |
|---------|------|------------------------------------------------|
| `width` | enum | `wide` (default) or `narrow`.                  |
| _body_  | markdown | Section content. Headings, prose, shortcodes. |

```markdown
{{</* section */>}}

## Run on any platform

{{</* icon-grid data="integrations" */>}}

{{</* /section */>}}
```

---

## `feature-grid` / `feature-card` {#feature-grid--feature-card}

A responsive grid of feature cards. `feature-grid` wraps any number of
nested `feature-card` shortcodes.

| Param          | Type     | Description                                      |
|----------------|----------|--------------------------------------------------|
| card `title`   | string   | Card heading.                                    |
| card `icon`    | string   | Iconify identifier.                              |
| card `url`     | string   | Make the whole card clickable.                   |
| card _body_    | markdown | Card body.                                       |

```markdown
{{</* feature-grid */>}}
  {{</* feature-card title="Landing" icon="mdi:rocket-launch" url="/get-started" */>}}
  Hero, OS tabs, code demo, feature grid, integrations, pricing, CTA.
  {{</* /feature-card */>}}
  {{</* feature-card title="Docs" icon="mdi:book-open-page-variant" url="/docs" */>}}
  Sidebar-free layout, on-this-page TOC, render hooks, prev/next.
  {{</* /feature-card */>}}
  {{</* feature-card title="Articles" icon="mdi:newspaper-variant-outline" url="/articles" */>}}
  Listing cards and an article view with a comfortable reading width.
  {{</* /feature-card */>}}
{{</* /feature-grid */>}}
```

{{< feature-grid >}}
  {{< feature-card title="Landing" icon="mdi:rocket-launch" url="/get-started" >}}
  Hero, OS tabs, code demo, feature grid, integrations, pricing, CTA.
  {{< /feature-card >}}
  {{< feature-card title="Docs" icon="mdi:book-open-page-variant" url="/docs" >}}
  Sidebar-free layout, on-this-page TOC, render hooks, prev/next.
  {{< /feature-card >}}
  {{< feature-card title="Articles" icon="mdi:newspaper-variant-outline" url="/articles" >}}
  Listing cards and an article view with a comfortable reading width.
  {{< /feature-card >}}
{{< /feature-grid >}}

---

## `icon-grid` {#icon-grid}

Tile grid driven by a data file. Useful for integration logos and
deployment-target overviews. Entries with an Iconify `icon` render as
inline SVG; entries without one render an empty tile.

| Param  | Type     | Description                                          |
|--------|----------|------------------------------------------------------|
| `data` | string   | Name of a YAML/TOML file under `data/`.              |

```yaml
# data/integrations.yaml
- name: Docker
  icon: simple-icons:docker
  url: "#"
- name: Kubernetes
  icon: simple-icons:kubernetes
  url: "#"
```

```markdown
{{</* icon-grid data="integrations" */>}}
```

{{< icon-grid data="integrations" >}}

---

## `pricing` {#pricing}

Tiered offer comparison driven by a data file. Renders one card per
entry; the entry with `featured: true` gets the accent ring and
ribbon.

| Param  | Type   | Description                                            |
|--------|--------|--------------------------------------------------------|
| `data` | string | Name of a YAML/TOML file under `data/`.                |

```yaml
# data/consulting.yaml
- name: Development
  tagline: Build the missing piece.
  price: from 800 EUR/day
  features: ["New features", "Migrations", "Code review"]
  cta:
    label: Get a quote
    url: "#"
- name: Consulting
  featured: true
  tag: Most booked
  price: 150 EUR/h
  features: ["Architecture audits", "Workshops"]
  cta: { label: Book a call, url: "#", primary: true }
```

```markdown
{{</* pricing data="consulting" */>}}
```

{{< pricing data="consulting" >}}

---

## `testimonial` {#testimonial}

Quote block with optional author, role, and metrics. Metrics are
parsed from a `metrics:` list at the end of the body.

| Param      | Type     | Description                                  |
|------------|----------|----------------------------------------------|
| `author`   | string   | Author name.                                 |
| `role`     | string   | Author role.                                 |
| _body_     | markdown | Quote. May end with a `metrics:` list.       |

```markdown
{{</* testimonial author="Jane Doe" role="Platform Lead, Acme" */>}}
We rebuilt our docs and landing in a weekend. The defaults are sensible,
the override points are obvious.

metrics:
- 80% time saved
- 6 sites shipped
{{</* /testimonial */>}}
```

{{< testimonial author="Jane Doe" role="Platform Lead, Acme" >}}
We rebuilt our docs and landing in a weekend. The defaults are sensible,
the override points are obvious.

metrics:
- 80% time saved
- 6 sites shipped
{{< /testimonial >}}

---

## `cta` {#cta}

A bold call-to-action band with an optional title, optional subtitle
(the shortcode body), and up to two action buttons.

| Param       | Type        | Description                                          |
|-------------|-------------|------------------------------------------------------|
| `title`     | string      | Heading rendered as H2.                              |
| `primary`   | `label\|url` | Primary action button, pipe-separated.              |
| `secondary` | `label\|url` | Secondary action button, pipe-separated.            |
| _body_      | markdown    | Subtitle below the heading.                          |

```markdown
{{</* cta title="Ready to scale?" primary="Get started|/get-started" secondary="Read the docs|/docs" */>}}
Pick a blueprint and adapt it. Five minutes from clone to deploy.
{{</* /cta */>}}
```

{{< cta title="Ready to scale?" primary="Get started|/get-started" secondary="Read the docs|/docs" >}}
Pick a blueprint and adapt it. Five minutes from clone to deploy.
{{< /cta >}}
