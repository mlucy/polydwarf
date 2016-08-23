const canvas = document.getElementById('polydwarf-world');
const ctx = canvas.getContext('2d');
let width;
let height;
let worldChanged;

ctx.font = '20px monospace';
ctx.textBaseline = 'middle';
const cellSize = { y: 10, x: 10 };

const world = new World();
center = { x: 512, y: 512, z: 0 };

const colorTable = [];
for (let i = 0; i < 256; ++i) {
  colorTable[i] = `hsl(${(i % 16) * (360 / 16)}, 100%, ${30 + Math.floor(i / 16) * (70 / 16)}%)`;
}
colorTable[0] = '#000000';

function drawWorld() {
  if (worldChanged) {
    ctx.clearRect(0, 0, width, height);
    const startTime = new Date();
    const numCells =
      { x: Math.ceil(width / cellSize.x), y: Math.ceil(height / cellSize.y) };
    const renderStart =
      { x: Math.floor(center.x - numCells.x), y: Math.floor(center.y - numCells.y) };
    const renderEnd =
      { x: Math.ceil(center.x + numCells.x), y: Math.ceil(center.y + numCells.y) };
    const pixelOffset =
      { x: Math.floor(width / 2), y: Math.floor(height / 2) };

    console.log(`renderStart: ${JSON.stringify(renderStart)}, renderEnd: ${JSON.stringify(renderEnd)}, numCells: ${JSON.stringify(numCells)}`);
    for (let y = renderStart.y; y < renderEnd.y; ++y) {
      for (let x = renderStart.x; x < renderEnd.x; ++x) {
        const b = world.bytes[center.z][y][x];
        if (b !== 0) {
          ctx.fillStyle = colorTable[b];
          ctx.fillRect(pixelOffset.x + (x - center.x) * cellSize.x,
                       pixelOffset.y + (y - center.y) * cellSize.y,
                       cellSize.x, cellSize.y);
        }
      }
    }

    worldChanged = false;
    console.log(`Render time: ${new Date() - startTime} ms`);
  }
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  worldChanged = true;
};

function keyDown(event) {
  console.log(`keyDown: ${event.key}`);
  switch (event.key) {
  case 'ArrowUp':
    center.z = Math.max(0, center.z - 1);
    worldChanged = true;
    break;
  case 'ArrowDown':
    center.z = Math.min(worldLayers - 1, center.z + 1);
    worldChanged = true;
    break;
  default:
    break;
  }
}

const zoom_in_ratio = 1.3;
const zoom_out_ratio = 1 / zoom_in_ratio;

function wheel(event) {
  if (event.deltaY < 0) {
    cellSize.x = Math.floor(cellSize.x * zoom_in_ratio);
    cellSize.y = Math.floor(cellSize.y * zoom_in_ratio);
    worldChanged = true;
  } else if (event.deltaY > 0) {
    cellSize.x = Math.max(5, Math.ceil(cellSize.x * zoom_out_ratio));
    cellSize.y = Math.max(5, Math.ceil(cellSize.y * zoom_out_ratio));
    worldChanged = true;
  }
}

let startDrag = null;
function mouseMove(event) {
  if (startDrag) {
    let moved = false;
    const delta = { x: event.clientX - startDrag.x, y: event.clientY - startDrag.y };
    if (Math.abs(delta.x) > cellSize.x) {
      center.x += delta.x / cellSize.x;
      moved = true;
    }
    if (Math.abs(delta.y) > cellSize.y) {
      center.y += delta.y / cellSize.y;
      moved = true;
    }
    if (moved) {
      startDrag = { x: event.clientX, y: event.clientY };
      worldChanged = true;
    }
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

resize();
window.addEventListener('resize', resize);

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

