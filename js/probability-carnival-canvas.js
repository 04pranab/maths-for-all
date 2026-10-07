window.ProbabilityCarnivalCanvas = (() => {
  const TOKENS = {
    sun: { label: "☀", color: "#d78a28" },
    moon: { label: "☾", color: "#6b668f" }
  };

  function setup(canvas) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    return { ctx, width, height };
  }

  function drawMachine(ctx, width, height, tokens, result) {
    const centerX = width / 2;
    const machineY = height * 0.42;
    const machineRadius = Math.min(width, height) * 0.2;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#52616b";
    ctx.fillStyle = "#fffdf8";
    ctx.beginPath();
    ctx.arc(centerX, machineY, machineRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const maxVisible = Math.min(tokens.length, 12);
    const step = maxVisible > 1 ? (machineRadius * 1.5) / (maxVisible - 1) : 0;
    const startX = centerX - ((maxVisible - 1) * step) / 2;

    for (let index = 0; index < maxVisible; index += 1) {
      const token = tokens[index];
      const x = startX + index * step;
      const y = machineY + Math.sin(index * 1.7) * machineRadius * 0.38;
      const item = TOKENS[token];

      ctx.fillStyle = item.color;
      ctx.font = "700 31px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.label, x, y);
    }

    ctx.strokeStyle = "#52616b";
    ctx.beginPath();
    ctx.moveTo(centerX - machineRadius * 0.72, machineY + machineRadius * 0.68);
    ctx.lineTo(centerX - machineRadius * 0.25, machineY + machineRadius * 1.18);
    ctx.lineTo(centerX + machineRadius * 0.25, machineY + machineRadius * 1.18);
    ctx.lineTo(centerX + machineRadius * 0.72, machineY + machineRadius * 0.68);
    ctx.stroke();

    if (result) {
      const item = TOKENS[result];
      ctx.fillStyle = item.color;
      ctx.font = "800 24px system-ui, sans-serif";
      ctx.fillText(result === "sun" ? "SUN" : "MOON", centerX, height * 0.92);
    }
  }

  function drawBars(ctx, width, height, values, labels) {
    const max = Math.max(1, ...values);
    const baseY = height - 34;
    const barWidth = Math.min(110, width / (values.length * 2));
    const gap = barWidth * 0.55;
    const totalWidth = values.length * barWidth + (values.length - 1) * gap;
    let x = (width - totalWidth) / 2;

    values.forEach((value, index) => {
      const barHeight = (height - 82) * (value / max);

      ctx.fillStyle = index === 0 ? TOKENS.sun.color : TOKENS.moon.color;
      ctx.fillRect(x, baseY - barHeight, barWidth, barHeight);

      ctx.fillStyle = "#25313a";
      ctx.font = "700 15px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[index], x + barWidth / 2, baseY + 22);
      ctx.fillText(String(value), x + barWidth / 2, baseY - barHeight - 9);

      x += barWidth + gap;
    });
  }

  function render(canvas, scene = {}) {
    const { ctx, width, height } = setup(canvas);
    const tokens = scene.tokens || ["sun", "sun", "sun", "moon"];

    if (scene.kind === "bars") {
      drawBars(
        ctx,
        width,
        height,
        scene.values || [0, 0],
        scene.labels || ["Sun", "Moon"]
      );
      return;
    }

    drawMachine(ctx, width, height, tokens, scene.result || null);

    if (scene.highlight) {
      ctx.strokeStyle = "#7a5b1e";
      ctx.lineWidth = 3;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.arc(
        width / 2,
        height * 0.42,
        Math.min(width, height) * 0.25,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function animateResult(canvas, tokens, result, onComplete) {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const duration = reduced ? 0 : 420;

    if (!duration) {
      render(canvas, { tokens, result });
      onComplete?.();
      return;
    }

    const start = performance.now();

    function frame(now) {
      const progress = Math.min(1, (now - start) / duration);

      render(canvas, {
        tokens,
        result: progress > 0.55 ? result : null,
        highlight: progress < 0.65
      });

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    }

    requestAnimationFrame(frame);
  }

  return {
    render,
    animateResult
  };
})();
