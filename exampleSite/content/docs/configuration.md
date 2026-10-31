---
title: "Configuration"
description: "Site params, menus, languages, and theme overrides."
category: "Setup"
weight: 20
---

Liftoff reads conventional Hugo configuration. A few extras enable the
landing-style chrome.

## Required markup settings

The shortcodes emit HTML, so Goldmark must be allowed to pass it
through. Without this, feature cards and callouts render as escaped
text.

```toml
[markup.goldmark.renderer]
  unsafe = true
```

Syntax highlighting comes from a stylesheet the theme ships,
`assets/css/syntax.css`, so Chroma has to emit class names for it to
match. The inline variant is also the first thing a
Content-Security-Policy without `'unsafe-inline'` throws away, which
leaves every code block colourless.

```toml
[markup.highlight]
  style      = "github-dark"
  noClasses  = false
  lineNos    = false
  codeFences = true
  tabWidth   = 2
```

Another Chroma style needs its own stylesheet. Write it to
`assets/css/syntax.css` in your site, where it takes precedence over the
theme's copy:

```bash
hugo gen chromastyles --style=dracula > assets/css/syntax.css
```

## Site params

```toml
[params]
  description     = "What your site does in one line."
  tagline         = "Used in the footer brand block."
  ogImage         = "/images/og.png"
  accent          = "cyan"
  copyrightOwner  = "ACME"
  copyrightSuffix = "All rights reserved."
```

| Param             | Used by            | Default      |
| ----------------- | ------------------ | ------------ |
| `description`     | Meta description, Open Graph | none |
| `tagline`         | Footer brand block | none         |
| `ogImage`         | Open Graph and Twitter card image | none |
| `accent`          | Colour preset, see below | `cyan` |
| `copyrightOwner`  | Footer copyright line | `site.Title` |
| `copyrightSuffix` | Text after the copyright line | none |

### Colour presets

`accent` swaps the two brand colours. Surfaces, text and the semantic
colours stay the same, and every preset ships a matching light-mode
variant, so the theme toggle keeps working either way.

| Value    | Brand colours     | Reads as                        |
| -------- | ----------------- | ------------------------------- |
| `cyan`   | Cyan and violet   | Default. Product and developer tooling |
| `ember`  | Orange and pink   | Warm, high energy               |
| `forest` | Emerald and cyan  | Calm, infrastructure-flavoured  |
| `indigo` | Indigo and magenta| Conservative SaaS               |
| `mono`   | Slate only        | Near-neutral, content-first     |

The two colours sit far enough apart on the wheel that the gradients
in the hero headline, the CTA band and the brand mark stay legible as
gradients. `mono` is the deliberate exception: it has almost no
contrast between the two, which is the point.

The value lands on `<html data-accent="...">`. For a palette of your
own, override the tokens directly instead, see
[customization](/docs/customization).

Any of these can be overridden per language under
`[languages.<code>.params]`.

### Repository stats

Renders a star count in the header. Only `codeberg` and `github` are
supported as hosts. The count is fetched in the browser and cached in
`localStorage` for an hour, so it costs nothing at build time.

```toml
[params.repo]
  host  = "codeberg"
  owner = "head1328"
  name  = "liftoff"
```

### Release version {#release-version}

Buttons and hero actions can show a version badge next to their label,
e.g. `Download | v1.2.0`. A fixed value such as `version="v1.2.0"` is
printed as is. `version="latest"` is resolved at build time, first hit
wins:

1. **Newest release** of `params.repo`, read from the host's REST API.
2. **Newest tag** of the same repo, for repos that publish tags but no
   releases.
3. **`params.release.version`**, a value you maintain by hand.

If none of these yields a value, the build logs a warning and the
button renders without a badge.

```toml
[params.release]
  lookup  = true      # false skips steps 1 and 2
  version = "v1.2.0"  # fallback, or the only source with lookup = false
```

What to know about the lookup:

- Only `codeberg` and `github` are supported as hosts, the same as for
  the star count. Other hosts skip straight to step 3.
- The API is called during `hugo` and `hugo server`, not in the
  browser. Visitors never contact the host, and a Content Security
  Policy does not get in the way.
- The answer is cached for one day. A new release shows up with the
  first build on the following day at the latest.
- Network errors, rate limits or unexpected responses only log a
  warning. The build continues with the next step.
- Turn it off with `lookup = false` if your build runs offline, behind
  a proxy, or if the API gives you trouble. The badge then comes from
  `params.release.version` only.
- If you commit Hugo's `getresource` cache, e.g. to keep CI clear of
  the Iconify rate limit, each lookup adds new cache files there once
  per day. Disable the lookup in `hugo.toml` and enable it in CI only,
  as this demo site does. Local builds then show
  `params.release.version`.

  ```yaml
  # Woodpecker step (GitHub Actions: env)
  environment:
    HUGO_PARAMS_RELEASE_LOOKUP: "true"
  ```

### Funding {#funding}

Lists donation options in three places: a sponsor button in the
header, an optional banner above the header, and the
[`funding` shortcode](/docs/shortcodes/#funding). The keys are the
same as in a `FUNDING.yml` for GitHub or Forgejo:

```toml
[params.funding]
  github    = ["max-mustermann", "acme"]
  liberapay = "max-mustermann"
  ko_fi     = "max-mustermann"
  custom    = ["https://example.com/donate"]
```

Supported keys: `github`, `liberapay`, `open_collective`, `ko_fi`,
`patreon`, `buy_me_a_coffee`, `polar`, `thanks_dev`, `tidelift`,
`issuehunt`, `community_bridge`, `lfx_crowdfunding` and `custom`.
Unknown keys log a warning.

If the site lives in the same repository as a `FUNDING.yml`, mount the
file as `data/funding.yml` instead of maintaining the links twice. It
takes precedence over `params.funding`:

```toml
[[module.mounts]]
  source = ".forgejo/FUNDING.yml"   # or .github/FUNDING.yml
  target = "data/funding.yml"
[[module.mounts]]
  source = "data"                   # custom mounts replace the default
  target = "data"
```

How the links are shown:

```toml
[params.sponsor]
  header          = true    # sponsor button in the header
  banner          = false   # dismissible banner above the header
  message         = ""      # replaces the default text in popover and banner
  attention       = "none"  # heartbeat or pulse, see below
  attentionRepeat = "once"  # or a duration such as "120s", see below
```

The header button opens a popover with all links. It works without
JavaScript. The banner stays hidden for visitors who dismissed it
once; without JavaScript it does not show at all. Without any funding
links, nothing is rendered.

`attention` draws the eye to the header button when a visitor arrives:
`heartbeat` lets the heart beat with a ring around the button, `pulse`
shows the ring only. Each run starts one second after the page loads and
lasts three beats. With `attentionRepeat = "once"` it runs once per
browser tab. A duration such as `"120s"`, `"2m"` or a plain number of
seconds repeats it at that interval, also across page loads. A run takes
about four seconds, so shorter intervals cut it off. Once the visitor
opened the popover, it stops for that tab. Visitors who prefer reduced
motion never see it.

### Social links

Rendered in the footer. `icon` is an Iconify identifier. Internal paths
are resolved per language, external URLs are left alone.

```toml
[[params.social]]
  icon = "simple-icons:codeberg"
  name = "Codeberg"
  url  = "https://codeberg.org/head1328"
```

### Footer address

Parsed as markdown, so links and line breaks work.

```toml
[params.footer]
  address = """
ACME
Anytown, Germany
[hello@acme.example](mailto:hello@acme.example)
"""
```

## Pagination

The articles listing and taxonomy term pages both use Hugo's paginator.

```toml
[pagination]
  pagerSize = 6
```

## Languages

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

## Menus

```toml
[[menus.main]]
  name    = "Docs"
  pageRef = "/docs"
  weight  = 10
```

Footer columns are top-level menu entries with children:

```toml
[[menus.footer]]
  identifier = "product"
  name       = "Product"
[[menus.footer]]
  parent = "product"
  name   = "Get started"
  url    = "/get-started"
```

Prefer `pageRef` over `url` for internal targets. It resolves through
Hugo's page lookup, so a broken reference fails the build instead of
shipping a 404. Footer entries with a hard `url` are not checked.

## Front matter

Fields the theme reads on top of Hugo's built-ins.

| Field         | Sections            | Purpose                              |
| ------------- | ------------------- | ------------------------------------ |
| `hero`        | any list or page    | Renders the hero, see [landing pages](/docs/landing) |
| `description` | all                 | Card summary and meta description    |
| `image`       | all                 | Per-page Open Graph image, overrides `params.ogImage` |
| `author`      | articles            | Shown in the article meta line       |
| `weight`      | docs                | Index order and prev/next links      |
| `tags`        | articles, docs      | Taxonomy terms, linked               |
| `categories`  | articles            | Taxonomy terms, linked               |
| `mark`        | blueprints          | Short label on the card, falls back to the first two title characters |
| `filters`     | blueprints          | Filter buttons on the index, not a taxonomy |
| `startFrom`   | blueprints          | Optional link to the matching reference page |
