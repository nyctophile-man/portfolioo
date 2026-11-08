const buildSample = () => {
  const c = document.createElement("canvas");
  const w = 260, h = Math.round((img.height / img.width) * w);
  c.width = w; c.height = h;
  const x = c.getContext("2d");
  x.drawImage(img, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data;
  const at = (i, j, k) => d[(j * w + i) * 4 + k];
  const bg = [0, 1, 2].map((k) => (at(10, 10, k) + at(w - 11, 10, k) + at(10, 40, k) + at(w - 11, 40, k)) / 4);
  const inMask = new Uint8Array(w * h);
  const lumA = new Float32Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const r = at(i, j, 0), g = at(i, j, 1), b = at(i, j, 2);
    const diff = Math.max(Math.abs(r - bg[0]), Math.abs(g - bg[1]), Math.abs(b - bg[2]));
    lumA[j * w + i] = 0.299 * r + 0.587 * g + 0.114 * b;
    inMask[j * w + i] = diff > 34 && i > 7 && i < w - 12 && j > 7 ? 1 : 0;
  }
  const pts = [];
  for (let j = 1; j < h - 1; j++) for (let i = 1; i < w - 1; i++) {
    const k = j * w + i;
    if (!inMask[k]) continue;
    // edge = mask boundary -> outlines hair & shoulders
    const edge = !inMask[k - 1] || !inMask[k + 1] || !inMask[k - w] || !inMask[k + w];
    // local contrast so eyes / brows / mouth read clearly
    const gx = lumA[k + 1] - lumA[k - 1], gy = lumA[k + w] - lumA[k - w];
    const grad = Math.min(1, Math.hypot(gx, gy) / 60);
    let tone = 1 - Math.pow(Math.max(0, Math.min(1, (lumA[k] - 62) / 112)), 1.05); // darkness
    let prob = 0.05 + 0.95 * tone;                 // lit skin = dense dots, hair/eyes = sparse
    if (edge) prob = Math.max(prob, 0.85);
    prob = Math.min(1, prob + grad * 0.25);
    const fadeY = j / h > 0.8 ? Math.max(0, 1 - (j / h - 0.8) / 0.2) : 1;
    prob *= fadeY;
    if (Math.random() > prob) continue;
    const a = Math.min(1, 0.35 + tone * 0.75 + (edge ? 0.3 : 0)) * (0.5 + 0.5 * fadeY);
    pts.push({ u: i / w + (Math.random() - 0.5) / w, v: j / h + (Math.random() - 0.5) / h, a });
  }
  sample = { pts, ratio: w / h, cols: w };
};

const layout = () => {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.clientWidth; H = canvas.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!sample) return;
  const ph = Math.min(H * 0.92, W * 1.2);
  const pw = ph * sample.ratio;
  const ox = (W - pw) / 2, oy = H * 0.05;
  targets = sample.pts.map((p) => ({ x: ox + p.u * pw, y: oy + p.v * ph, a: p.a }));
  const cell = ph / sample.cols;
  while (parts.length < targets.length) {
    const ang = Math.random() * 6.283, rad = Math.max(W, H) * (0.4 + Math.random() * 0.6);
    parts.push({
      x: W / 2 + Math.cos(ang) * rad, y: H / 2 + Math.sin(ang) * rad,
      vx: 0, vy: 0, d: Math.random(),
    });
  }
  parts.length = targets.length;
  parts.forEach((p, i) => {
    p.tx = targets[i].x + (Math.random() - 0.5) * cell;
    p.ty = targets[i].y + (Math.random() - 0.5) * cell;
    p.a = targets[i].a; p.s = Math.max(1.05, cell * (0.65 + Math.random() * 0.45));
  });
};

const tick = (t) => {
  ctx.clearRect(0, 0, W, H);
  const mx = mouse.x < -999 ? 0 : (mouse.x / W - 0.5), my = mouse.y < -999 ? 0 : (mouse.y / H - 0.5);
  tiltX += (mx * 26 - tiltX) * 0.05; tiltY += (my * 16 - tiltY) * 0.05;
  if (goRef.current && !started) started = t;
  const el = started ? (t - started) / 1000 : -1;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (el >= 0 && el > p.d * 1.2) {
      p.vx += (p.tx + tiltX * (p.a - 0.5) - p.x) * 0.014; p.vy += (p.ty + tiltY * (p.a - 0.5) - p.y) * 0.014;
    } else {
      p.vx += Math.sin(t / 900 + i) * 0.01; p.vy += Math.cos(t / 800 + i) * 0.01;
    }
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 90 && dist > 0) {
      const force = (90 - dist) / 90;
      p.vx += (dx / dist) * force * 1.7;
      p.vy += (dy / dist) * force * 1.7;
    }
    p.vx *= 0.91;
    p.vy *= 0.91;
    p.x += p.vx;
    p.y += p.vy;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s / 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(25, 22, 18, ${p.a})`;
    ctx.fill();
  }
  raf = window.requestAnimationFrame(tick);
};

const resize = () => layout();
const onMove = (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
};
const onLeave = () => {
  mouse.x = -9999;
  mouse.y = -9999;
};

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mouseleave", onLeave);
window.addEventListener("resize", resize);

img.onload = () => {
  buildSample();
  layout();
  raf = window.requestAnimationFrame(tick);
};
img.onerror = () => {
  sample = { pts: [], ratio: 1, cols: 1 };
  layout();
  raf = window.requestAnimationFrame(tick);
};
img.src = PHOTO;

return () => {
  window.cancelAnimationFrame(raf);
  window.removeEventListener("resize", resize);
  canvas.removeEventListener("mousemove", onMove);
  canvas.removeEventListener("mouseleave", onLeave);
};