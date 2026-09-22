# adamnightingale0.github.io

Single-page tutoring site, served by GitHub Pages at
<https://adamnightingale0.github.io>.

The design comes from a Claude Design canvas ("Organic" design system —
Caprasimo headings, Figtree body, cream/terracotta/olive palette). This repo
holds a plain static reconstruction of it: no build step and no external
requests. The only JavaScript is `assets/carousel.js`, which rotates the
testimonials; everything else is plain HTML and CSS, and the page works
without it.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page — all the text lives here |
| `assets/styles.css` | The design system (tokens at the top) plus component classes |
| `assets/carousel.js` | Rotates the testimonials — the page still works with it removed |
| `assets/headshot.jpg` | The hero photo |
| `assets/fonts/*.woff2` | Caprasimo + Figtree, self-hosted so the page loads nothing from a CDN |

## Adding a testimonial

In `index.html`, find `<section id="testimonials">`. Each quote is a
`<figure class="testimonial">`. Copy a whole block and swap the two pieces of
text:

```html
<figure class="testimonial">
  <span class="testimonial-mark" aria-hidden="true">&ldquo;</span>
  <blockquote class="testimonial-quote">
    <p>One paragraph of the quote.</p>
    <p>Another paragraph, if the quote has one.</p>
  </blockquote>
  <figcaption class="testimonial-attr">Name, parent &mdash; Subject &amp; level</figcaption>
</figure>
```

Wrap each paragraph in its own `<p>`, and leave out the opening and closing
quote marks — the card draws its own large `&ldquo;` above the text.

Nothing else needs changing. `assets/carousel.js` counts the cards itself and
builds one navigation dot per testimonial, and the panel measures each quote
so it can size itself to whatever you write.

### How the rotation behaves

The testimonials are a plain grid in the HTML, and `carousel.js` upgrades them
to a single rotating panel. If the script is removed or fails to load, every
testimonial simply stays on the page in the grid — so the section never ends
up empty.

Once running, it shows one quote at a time and advances every 7 seconds, and
the panel animates its height to fit each quote rather than being fixed to the
longest one. It stops rotating when a visitor hovers over it or tabs into it,
and there are previous/next buttons, dots, and a pause button. Visitors who
have asked their system for reduced motion get no auto-rotation at all — the
controls still work.

To change the pace, edit `AUTO_MS` at the top of `assets/carousel.js`. If you
change the transition speed, change `TRANSITION_MS` there and the matching
`420ms` values in the carousel block of `assets/styles.css` together.

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
