const canvas = document.getElementById('polydwarf-world');
const ctx = canvas.getContext('2d');
let width;
let height;
let worldChanged;

ctx.font = '20px monospace';
ctx.textBaseline = 'middle';
const cellSize = { y: 20, x: Math.ceil(ctx.measureText('_').width) };

const world = new World();
offset = { x: 0, y: 0 };

function drawWorld() {
  if (worldChanged) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.font = '20px monospace';
    ctx.textBaseline = 'middle';

    ctx.fillText('_ _ _ _ _', 5, 15);
    ctx.fillText('. . . . .', 5, 45);
    worldChanged = false;
  }
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  worldChanged = true;
};

resize();
window.addEventListener('resize', resize);

let animationHandle;

function animate() {
  drawWorld();
  drawUi();
  animationHandle = window.requestAnimationFrame(animate);
};

animate();

