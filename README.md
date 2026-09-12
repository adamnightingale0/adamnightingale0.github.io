# adamnightingale0.github.io

Single-page tutoring site, served by GitHub Pages at
<https://adamnightingale0.github.io>.

The design comes from a Claude Design canvas ("Organic" design system —
Caprasimo headings, Figtree body, cream/terracotta/olive palette). This repo
holds a plain static reconstruction of it: no JavaScript, no build step, no
external requests.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page — all the text lives here |
| `assets/styles.css` | The design system (tokens at the top) plus component classes |
| `assets/headshot.jpg` | The hero photo |
| `assets/fonts/*.woff2` | Caprasimo + Figtree, self-hosted so the page loads nothing from a CDN |

## One thing to finish

**Replace the testimonials.** In `index.html`, find
`<section id="testimonials">`. Each quote is a `<figure>` with placeholder text
to swap out — change the text inside `<blockquote>` and `<figcaption>`:

```html
<blockquote style="...">Testimonial text goes here.</blockquote>
<figcaption style="...">Student / parent name &mdash; Subject &amp; level</figcaption>
```

Delete or duplicate a whole `<figure>` block to show fewer or more.

## Changing colours or type

Everything visual is driven by the custom properties in the `:root` block at
the top of `assets/styles.css` — `--color-bg`, `--color-accent`,
`--color-accent-2`, the tonal ramps, spacing, radii and shadows. Change a token
there and the whole page follows.

## Previewing locally

```
python3 -m http.server 8000
```

then open <http://localhost:8000>.
