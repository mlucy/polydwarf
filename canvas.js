const canvas = document.getElementById('polydwarf-world');
const ctx = canvas.getContext('2d');
let width;
let height;
let worldChanged;

ctx.font = '20px monospace';
ctx.textBaseline = 'middle';
const cellSize = { y: 10, x: 10 };

const world = new World();
offset = { x: 0, y: 0, z: 0 };

const colorTable = [];
for (let i = 0; i < 256; ++i) {
  colorTable[i] = `hsl(${(i % 16) * (360 / 16)}, 100%, ${ 30 + Math.floor(i / 16) * (70 / 16)}%)`;
}

function drawWorld() {
  if (worldChanged) {
    const start = new Date();
    ctx.clearRect(0, 0, width, height);
    const max = { x: (width / cellSize.x) + 1, y: (height / cellSize.y) + 1 };
    for (let y = offset.y; y < max.y; ++y) {
      for (let x = offset.x; x < max.x; ++x) {
        const b = world.bytes[offset.z][y][x];
        ctx.fillStyle = colorTable[b];
        ctx.fillRect(x * cellSize.x, y * cellSize.y, cellSize.x, cellSize.y);
      }
    }
    worldChanged = false;
    const end = new Date();
    console.log(`Render time: ${end - start}`);
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
    offset.z = Math.max(0, offset.z - 1);
    worldChanged = true;
    break;
  case 'ArrowDown':
    offset.z = Math.min(worldLayers - 1, offset.z + 1);
    worldChanged = true;
    break;
  default:
    break;
  }
}

window.addEventListener('keydown', keyDown);

resize();
window.addEventListener('resize', resize);

let animationHandle;

function animate() {
  drawWorld();
  animationHandle = window.requestAnimationFrame(animate);
};

animate();

