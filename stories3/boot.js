/* v3 boot: preload images used inside canvases/WebGL, then build the story */
(function () {
  const S = RP.params;
  const load = (n) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(i);
    i.src = `../assets/img/${n.includes("/") ? n : "photos/" + n}.jpg`; });
  Promise.all((S.preload || []).map(load)).then((imgs) => {
    RP.run(function (tl, RP) {
      const c = S3.make(tl, RP);
      const fn = S3.reg[S.id];
      if (!fn) { c.layer({ background: "#000" }); console.error("unknown story " + S.id); return; }
      fn(c);
      if (c.after) c.after(imgs);
    });
  });
})();
