# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-10-31

### Added

- `version` parameter on `button` for a version badge after the label.
  A fixed value is printed as is, `version="latest"` is resolved at
  build time from the newest release or tag of `params.repo`, falling
  back to `params.release.version`. `params.release.lookup = false`
  skips the API call, see
  [Release version](https://hugo-liftoff.kevinhorst.de/en/docs/configuration/#release-version).
- `carousel` and `slide` shortcodes. The track is a CSS scroll-snap
  container that works without JavaScript, `main.js` adds arrows, dots
  and optional autoplay. A click opens the image in the lightbox.
- Funding support: a sponsor button in the header with a popover, an
  optional dismissible banner and the `funding` shortcode. Links come
  from `params.funding` or a mounted `FUNDING.yml`. `params.sponsor`
  controls placement, text and an optional `heartbeat` or `pulse`
  animation, see
  [Funding](https://hugo-liftoff.kevinhorst.de/en/docs/configuration/#funding).

### Changed

- **The theme requires Hugo 0.156 or later.** It reads data files via
  `hugo.Data`, because `site.Data` is deprecated since 0.156.
- Shortcode headings in the docs are formatted as code, so the table
  of contents shows them consistently.

## [0.1.3] - 2026-10-25

### Added

- `accordion` and `accordion-item` shortcodes for FAQs and reference
  lists. Items are native `<details>` elements, `exclusive="true"`
  keeps at most one open, and the title doubles as anchor id.
- `screenshot` shortcode with a lightbox. Images come from the page
  bundle or `assets/`, a click opens them full size, Esc or the
  backdrop closes them.
- `--color-code-selection-text` and `--color-code-selection-bg` tokens
  for text selected inside code blocks.

### Changed

- **A failed Iconify fetch now fails production builds.** Before, the
  site deployed without icons. `hugo server` still only warns. CI
  builds should commit the `getresource` cache, see
  [Icons](https://hugo-liftoff.kevinhorst.de/en/docs/icons/#caching-and-offline-builds).

### Fixed

- The language switcher links to the translation of the current page
  instead of the home page, and falls back to the home page when no
  translation exists.
- The step label in `step` is translated (`Schritt` in German).
- Below 800px the header actions no longer cover the opened menu.
  Contributed by [@foosel](https://codeberg.org/foosel).
- Selected text in code blocks is readable in the light theme.
  Contributed by [@foosel](https://codeberg.org/foosel).
- The demo site lost all icons because Iconify rate-limits CI builds
  with `429`. It now builds from a committed icon cache.

## [0.1.2] - 2026-09-10

### Changed

- **Sites must set `markup.highlight.noClasses = false`.** Chroma now
  needs to emit class names, because the theme ships the syntax colours
  as a stylesheet, `assets/css/syntax.css`. A site that keeps the Hugo
  default loses its code highlighting. See
  [Configuration](https://hugo-liftoff.kevinhorst.de/en/docs/configuration/)
  for the full block, and regenerate the stylesheet with
  `hugo gen chromastyles` when picking a different Chroma style.

### Fixed

- Code blocks and table column alignment no longer rely on inline
  `style` attributes. A Content-Security-Policy without
  `'unsafe-inline'` dropped them, which left code unhighlighted and
  centred or right-aligned columns flush left. Table markup comes from
  a new `_markup/render-table.html` render hook and carries
  `table__cell--left`, `--center` and `--right` classes.
- Markdown links no longer end on a newline. In running text, a link
  followed by punctuation rendered as `link .` instead of `link.`.
  Contributed by [@foosel](https://codeberg.org/foosel).

## [0.1.1] - 2026-09-10

### Fixed

- The CTA band lost its border, padding, centred text and grid gaps in
  the dark theme. Those declarations sat in the `[data-theme="light"]`
  block, so only light mode ever applied them. Contributed by
  [@foosel](https://codeberg.org/foosel).

## [0.1.0] - 2026-07-19

### Added

- Initial release. Layouts for product landing, docs, articles and
  blueprints, seventeen shortcodes, markdown render hooks for code
  blocks and callouts, five accent presets with light mode, German and
  English i18n, build-time Iconify icons, and a bilingual demo site
  under `exampleSite/`.

[0.2.0]: https://codeberg.org/head1328/hugo-liftoff/compare/v0.1.3...v0.2.0
[0.1.3]: https://codeberg.org/head1328/hugo-liftoff/compare/v0.1.2...v0.1.3
[0.1.2]: https://codeberg.org/head1328/hugo-liftoff/compare/v0.1.1...v0.1.2
[0.1.1]: https://codeberg.org/head1328/hugo-liftoff/compare/v0.1.0...v0.1.1
[0.1.0]: https://codeberg.org/head1328/hugo-liftoff/releases/tag/v0.1.0
