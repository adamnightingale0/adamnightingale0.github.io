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

## Adding a testimonial

In `index.html`, find `<section id="testimonials">`. Each quote is a `<figure>`.
Copy a whole `<figure>` block and swap the two pieces of text:

```html
<blockquote style="...">The quote, without surrounding quote marks.</blockquote>
<figcaption style="...">Name, parent &mdash; Subject &amp; level</figcaption>
```

Leave out the opening and closing quote marks — the card draws its own large
`&ldquo;` above the text. The cards flow into columns on their own as you add
more, so nothing else needs changing.

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
