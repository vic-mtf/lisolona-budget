let offscreen, ctx;
let layers = [];
let isRunning = false;
let frameInterval = 1000 / 60;
let timer;

self.onmessage = (e) => {
  const { type, canvas, width, height, fps, layers: newLayers } = e.data;

  switch (type) {
    case 'init':
      offscreen = canvas;
      ctx = offscreen.getContext('2d', { alpha: true });
      offscreen.width = width;
      offscreen.height = height;
      break;

    case 'updateLayers':
      layers = newLayers;
      break;

    case 'clearLayers':
      layers = [];
      break;

    case 'start':
      if (isRunning) return;
      isRunning = true;
      frameInterval = 1000 / (fps || 60);
      renderLoop();
      break;

    case 'pause':
    case 'stop':
      isRunning = false;
      clearTimeout(timer);
      break;
  }
};

function renderLoop() {
  if (!isRunning) return;

  ctx.clearRect(0, 0, offscreen.width, offscreen.height);

  for (const layer of layers) {
    if (!layer) continue;
    ctx.drawImage(layer, 0, 0, offscreen.width, offscreen.height);
  }

  timer = setTimeout(renderLoop, frameInterval);
}
