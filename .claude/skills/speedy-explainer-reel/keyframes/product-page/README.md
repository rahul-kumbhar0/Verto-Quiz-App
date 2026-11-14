# product-page

A shop product page in a real browser window that loads (grey skeleton → content), with a load timer ("the page took 1.4 s", pricing, "what the user sees"). Laid out like a real store: nav with search and bag, thumbnail rail, rating, size picker, Add to Bag.

![preview](preview.jpg)

- `opts`: { url, brand, title, sub, price, cta, emoji: the product picture (an emoji or short text), tint, w, top, rating: "4.8", reviews: "1,204", sizes: ["UK 7", ...] }
- `state`: { show: 0..1, load: 0..1 (0 = grey skeleton, 1 = fully loaded), ms: number shown in the timer chip (hidden when undefined), slow: bool (timer turns red) } · api: frame(t, state)

Use: `const b = KF.make("product-page", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=product-page`).
