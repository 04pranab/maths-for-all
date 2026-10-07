window.ProbabilityCarnivalCanvas = (() => {
  function render(canvas, result) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2 - 20;
    const r = Math.min(w, h) * .25;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#52616b";
    ctx.fillStyle = "#fffdf8";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - r * .72, cy + r * .68);
    ctx.lineTo(cx - r * .25, cy + r * 1.2);
    ctx.lineTo(cx + r * .25, cy + r * 1.2);
    ctx.lineTo(cx + r * .72, cy + r * .68);
    ctx.stroke();

    ctx.font = "700 34px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#315f72";
    ctx.fillText("☀️", cx - r * .42, cy);
    ctx.fillStyle = "#8a5c72";
    ctx.fillText("🌙", cx + r * .42, cy);

    if (result) {
      ctx.font = "800 22px system-ui";
      ctx.fillStyle = "#25313a";
      ctx.fillText(result === "sun" ? "SUN" : "MOON", cx, cy + r * 1.55);
    }
  }
  return { render };
})();