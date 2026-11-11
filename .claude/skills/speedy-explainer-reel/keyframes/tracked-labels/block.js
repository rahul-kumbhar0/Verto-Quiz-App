/* tracked-labels: small caps labels with a pointer line that stay glued to moving things.
 * opts:  { size: font px, color, labels: [{ text, at: time it appears, out: time it leaves, anchor: [x, y] | (t) => [x, y], dx, dy: where the text sits relative to the anchor }] }
 * api:   frame(t) */
KF.define("tracked-labels", (host, o) => {
  const NS = "http://www.w3.org/2000/svg", svg = document.createElementNS(NS, "svg"); svg.setAttribute("class", "kf-lab"); svg.dataset.qa = "ok"; host.appendChild(svg);
  const col = o.color || KF.C.ink, items = (o.labels || []).map(L => { const g = document.createElementNS(NS, "g"), ln = document.createElementNS(NS, "path"), dot = document.createElementNS(NS, "circle"), tx = document.createElementNS(NS, "text");
    ln.setAttribute("fill", "none"); ln.setAttribute("stroke", col); ln.setAttribute("stroke-width", 2); ln.setAttribute("opacity", 0.75); dot.setAttribute("r", 5); dot.setAttribute("fill", col);
    tx.textContent = L.text; if (o.size) tx.style.fontSize = o.size + "px"; tx.setAttribute("fill", col); g.append(ln, dot, tx); svg.appendChild(g); return { L, g, ln, dot, tx }; });
  return { frame(t) { items.forEach(({ L, g, ln, dot, tx }) => { const a = L.at ?? 0, on = t >= a && (L.out == null || t < L.out + 0.25); g.style.display = on ? "" : "none"; if (!on) return;
        const [x, y] = typeof L.anchor === "function" ? L.anchor(t) : L.anchor, dx = L.dx ?? 120, dy = L.dy ?? -70, p = KF.ease.out(KF.prog(t, a, 0.3)), q = KF.prog(t, a + 0.18, 0.25), fade = L.out != null ? 1 - KF.prog(t, L.out, 0.25) : 1;
        const ex = x + dx * p, ey = y + dy * p, right = dx >= 0; ln.setAttribute("d", `M${x.toFixed(1)} ${y.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)} h${right ? 26 * p : -26 * p}`);
        dot.setAttribute("cx", x); dot.setAttribute("cy", y); tx.setAttribute("x", ex + (right ? 36 : -36)); tx.setAttribute("y", ey + 8); tx.setAttribute("text-anchor", right ? "start" : "end"); tx.setAttribute("opacity", q); g.setAttribute("opacity", fade); }); } };
});
