const canvas = document.getElementById('polydwarf-world');
const ctx = canvas.getContext('2d');
let width;
let height;

let worldChanged = true;
const world = new World();

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  worldChanged = true;
};

resize();
window.addEventListener('resize', resize);

const cellSize = { x: 10, y: 10 };

// Offsets measured in pixels from top-left
const screenPos = {
  x: ((cellSize.x * worldWidth) - width) / 2,
  y: ((cellSize.y * worldHeight) - height) / 2,
  z: 0,
};

const colorTable = [];
for (let i = 0; i < 256; ++i) {
  colorTable[i] = `hsl(${(i % 16) * (360 / 16)}, 100%, ${30 + Math.floor(i / 16) * (70 / 16)}%)`;
}
colorTable[0] = '#000000';

function drawWorld() {
  if (worldChanged) {
    ctx.clearRect(0, 0, width, height);
    const startTime = new Date();
    const renderStart =
      { x: Math.floor(screenPos.x / cellSize.x), y: Math.floor(screenPos.y / cellSize.y) };
    const renderEnd =
      { x: renderStart.x + Math.ceil(width / cellSize.x), y: renderStart.y + Math.ceil(height / cellSize.y) };

    console.log(`screenPos: ${JSON.stringify(screenPos)}, renderStart: ${JSON.stringify(renderStart)}, renderEnd: ${JSON.stringify(renderEnd)}`);
    for (let y = renderStart.y; y < renderEnd.y; ++y) {
      for (let x = renderStart.x; x < renderEnd.x; ++x) {
        const b = world.bytes[screenPos.z][y][x];
        if (b !== 0) {
          ctx.fillStyle = colorTable[b];
          ctx.fillRect(cellSize.x * x - screenPos.x,
                       cellSize.y * y - screenPos.y,
                       cellSize.x, cellSize.y);
        }
      }
    }

    worldChanged = false;
    console.log(`Render time: ${new Date() - startTime} ms`);
  }
}

function keyDown(event) {
  console.log(`keyDown: ${event.key}`);
  switch (event.key) {
  case 'ArrowUp':
    screenPos.z = Math.max(0, screenPos.z - 1);
    worldChanged = true;
    break;
  case 'ArrowDown':
    screenPos.z = Math.min(worldLayers - 1, screenPos.z + 1);
    worldChanged = true;
    break;
  default:
    break;
  }
}

const zoom_in_ratio = 1.3;
const zoom_out_ratio = 1 / zoom_in_ratio;

function doZoom(cursorPos, ratio) {
  const oldWorldPos = {
    x: (screenPos.x + cursorPos.x) / cellSize.x,
    y: (screenPos.y + cursorPos.y) / cellSize.y,
  };

  if (ratio < 1) {
    cellSize.x = Math.max(Math.min(Math.floor(cellSize.x * ratio), cellSize.x - 1), 1);
    cellSize.y = Math.max(Math.min(Math.floor(cellSize.y * ratio), cellSize.y - 1), 1);
  } else if (ratio > 1) {
    cellSize.x = Math.max(Math.floor(cellSize.x * ratio), cellSize.x + 1);
    cellSize.y = Math.max(Math.floor(cellSize.y * ratio), cellSize.x + 1);
  }

  const newWorldPos = {
    x: (screenPos.x + cursorPos.x) / cellSize.x,
    y: (screenPos.y + cursorPos.y) / cellSize.y,
  };

  screenPos.x = screenPos.x - Math.round((newWorldPos.x - oldWorldPos.x) * cellSize.x);
  screenPos.y = screenPos.y - Math.round((newWorldPos.y - oldWorldPos.y) * cellSize.y);
  worldChanged = true;
}

function wheel(event) {
  if (event.deltaY < 0) {
    doZoom({x: event.clientX, y: event.clientY}, zoom_in_ratio);
  } else if (event.deltaY > 0) {
    doZoom({x: event.clientX, y: event.clientY}, zoom_out_ratio);
  }
}

let startDrag = null;
function mouseMove(event) {
  if (startDrag) {
    screenPos.x += startDrag.x - event.clientX;
    screenPos.y += startDrag.y - event.clientY;
    startDrag = { x: event.clientX, y: event.clientY };
    worldChanged = true;
  }
}

function mouseDown(event) {
  console.log('mouseDown');
  if (event.button === 2) {
    startDrag = { x: event.clientX, y: event.clientY };
  }
}

function mouseUp(event) {
  console.log('mouseUp');
  mouseMove(event);
  if (event.button === 2) {
    startDrag = null;
  }
}

function mouseEnter(event) {
  // console.log('mouseEnter');
}

function mouseLeave(event) {
  // console.log('mouseLeave');
  mouseMove(event);
  startDrag = null;
}

window.addEventListener('keydown', keyDown);
canvas.addEventListener('wheel', wheel);
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mouseenter', mouseEnter);
canvas.addEventListener('mouseleave', mouseLeave);
canvas.addEventListener('mousemove', mouseMove); // TODO: only listen on this when dragging

// Disable the right-click menu so users can use right-clicks as input
canvas.addEventListener('contextmenu', (event) => event.preventDefault());

let animationHandle;

function animate() {
  try {
    drawWorld();
  } catch (err) {
    console.log(`error when rendering: ${err}`);
  }
  animationHandle = window.requestAnimationFrame(animate);
};

animate();
