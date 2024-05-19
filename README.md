# Image to CSS converter

Ever felt like images take too much storage? Too bad, because with this tool you can make them even larger.

This converts any image to CSS, using a bunch of divs and [linear-gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient).

# How does it work?

1. It creates a bunch of divs to equal the height of the image
2. Sets each div to 1px high
3. It traverses through each pixel and creates a very verbose linear-gradient string with [hard color stops](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient#gradient_with_multi-position_color-stops)

# Why does this exist?

I had an idea and some time.

# When should I use this?

Absolutely never. It will make your browser stop if you give it a large image.

# How much more space does the CSS version of the image take?

When tested on a 14 KB png, it gave a 14 MB long string.
