# adamnightingale0.github.io

Single-page tutoring site, served by GitHub Pages at
<https://adamnightingale0.github.io>.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole page — all the text lives here |
| `assets/styles.css` | All styling; colours are set as variables at the top |
| `assets/headshot.jpg` | Your photo (see below) |

## Two things to finish

**1. Add the headshot.** Save your photo as `assets/headshot.jpg` and commit it.
Until that file exists the page shows an "AN" circle instead — nothing breaks.
A square crop of roughly 600×600px or larger looks best.

**2. Replace the testimonials.** In `index.html`, find the
`<section id="testimonials">` block. Each quote is a `<blockquote class="quote">`
with placeholder text to swap out:

```html
<blockquote class="quote">
  <p>[Testimonial text goes here]</p>
  <cite>[Student / parent name], [Subject &amp; level]</cite>
</blockquote>
```

Delete or duplicate a whole `<blockquote>` block to show fewer or more.

## Previewing locally

```
python3 -m http.server 8000
```

then open <http://localhost:8000>.
