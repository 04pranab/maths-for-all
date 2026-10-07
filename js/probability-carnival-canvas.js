window.ProbabilityCarnivalCanvas = (() => {
  const TOKENS = {
    sun: { label: "☀", color: "#e39a2d", light: "#fff0c8" },
    moon: { label: "☾", color: "#74658d", light: "#eee9f7" }
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

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawAwning(ctx, centerX, topY, width) {
    const segment = width / 7;

    for (let index = 0; index < 7; index += 1) {
      ctx.fillStyle = index % 2 === 0 ? "#765a72" : "#f4b942";
      ctx.beginPath();
      ctx.moveTo(centerX - width / 2 + index * segment, topY);
      ctx.lineTo(centerX - width / 2 + (index + 1) * segment, topY);
      ctx.lineTo(centerX - width / 2 + (index + 1) * segment - 8, topY + 24);
      ctx.quadraticCurveTo(
        centerX - width / 2 + (index + 0.5) * segment,
        topY + 34,
        centerX - width / 2 + index * segment + 8,
        topY + 24
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawToken(ctx, x, y, token, radius) {
    const item = TOKENS[token];

    ctx.fillStyle = item.light;
    ctx.beginPath();
    ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fffdf8";
    ctx.font = "800 " + Math.round(radius * 1.15) + "px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.label, x, y + 1);
  }

  function drawMachine(ctx, width, height, tokens, result) {
    const centerX = width / 2;
    const machineWidth = Math.max(260, Math.min(width * 0.78, 430));
    const machineHeight = Math.max(170, Math.min(height * 0.68, 250));
    const machineX = centerX - machineWidth / 2;
    const machineY = height * 0.18;

    drawAwning(ctx, centerX, machineY - 20, machineWidth * 0.86);

    ctx.fillStyle = "#fffdf8";
    ctx.strokeStyle = "#263238";
    ctx.lineWidth = 5;
    roundedRect(ctx, machineX, machineY + 5, machineWidth, machineHeight, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#263238";
    ctx.font = "900 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PROBABILITY ENGINE", centerX, machineY + 35);

    const chamberX = machineX + 24;
    const chamberY = machineY + 52;
    const chamberWidth = machineWidth - 48;
    const chamberHeight = machineHeight - 86;

    ctx.fillStyle = "#edf5e9";
    ctx.strokeStyle = "#b9ccbf";
    ctx.lineWidth = 3;
    roundedRect(ctx, chamberX, chamberY, chamberWidth, chamberHeight, 18);
    ctx.fill();
    ctx.stroke();

    const maxVisible = Math.min(tokens.length, 12);
    const columns = maxVisible <= 6 ? maxVisible : 6;
    const rows = Math.ceil(maxVisible / columns);
    const gapX = chamberWidth / (columns + 1);
    const gapY = chamberHeight / (rows + 1);
    const radius = Math.min(20, gapX * 0.27, gapY * 0.27);

    for (let index = 0; index < maxVisible; index += 1) {
      const column = index % columns;
      const row = Math.floor(index / columns);
      drawToken(
        ctx,
        chamberX + gapX * (column + 1),
        chamberY + gapY * (row + 1),
        tokens[index],
        radius
      );
    }

    const chuteY = machineY + machineHeight - 14;

    ctx.fillStyle = "#263238";
    roundedRect(ctx, centerX - 36, chuteY, 72, 42, 10);
    ctx.fill();

    if (result) {
      drawToken(ctx, centerX, chuteY + 21, result, 17);

      ctx.fillStyle = TOKENS[result].color;
      ctx.font = "900 22px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        result === "sun" ? "SUN!" : "MOON!",
        centerX,
        height * 0.91
      );
    } else {
      ctx.fillStyle = "#56666b";
      ctx.font = "800 15px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Choose your move, then spin the machine!", centerX, height * 0.91);
    }
  }

  function drawBars(ctx, width, height, values, labels) {
    const max = Math.max(1, ...values);
    const baseY = height - 42;
    const barWidth = Math.min(120, width / (values.length * 2.2));
    const gap = barWidth * 0.55;
    const totalWidth = values.length * barWidth + (values.length - 1) * gap;
    let x = (width - totalWidth) / 2;

    values.forEach((value, index) => {
      const barHeight = (height - 110) * (value / max);

      ctx.fillStyle = index === 0 ? TOKENS.sun.color : TOKENS.moon.color;
      roundedRect(ctx, x, baseY - barHeight, barWidth, Math.max(8, barHeight), 10);
      ctx.fill();

      ctx.fillStyle = "#263238";
      ctx.font = "800 15px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(labels[index], x + barWidth / 2, baseY + 24);
      ctx.fillText(String(value), x + barWidth / 2, baseY - barHeight - 10);

      x += barWidth + gap;
    });
  }

  function render(canvas, scene = {}) {
    const { ctx, width, height } = setup(canvas);
    const tokens = scene.tokens || ["sun", "sun", "sun", "moon"];

    ctx.fillStyle = "#fffaf0";
    ctx.fillRect(0, 0, width, height);

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
      ctx.strokeStyle = "#f4b942";
      ctx.lineWidth = 5;
      ctx.setLineDash([8, 7]);
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.5, Math.min(width, height) * 0.39, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function animateResult(canvas, tokens, result, onComplete) {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const duration = reduced ? 0 : 520;

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
        result: progress > 0.58 ? result : null,
        highlight: progress < 0.68
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
