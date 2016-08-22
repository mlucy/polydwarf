const worldLayers = 16; // IF YOU CHANGE THIS, CHANGE `randStone`!
const worldHeight = 1000;
const worldWidth = 1000;

const layerDeposits = 50;
const depositRadius = 4;

function rand(max) {
  return Math.floor(Math.random()*max);
}

function srand(max) {
  const r = Math.random();
  return Math.floor(r*r*max);
}

function randStone(maxLayer) {
  const layer = maxLayer - srand(maxLayer);
  return layer*16 + srand(16);
}

class World {
  constructor() {
    this.bytes = [];
    for (let i = 0; i < worldLayers; ++i) {
      const layer = (this.bytes[i] = []);
      for (let f = 0; f < worldHeight; ++f) {
        const line = (layer[f] = new Uint8Array(4*worldWidth));
        for (let k = 0; k < 4*worldWidth; ++k) {
          line[k] = 0;
        }
      }
    }
    this.fillWorld();
  }

  iter(cb) {
    for (let i = 0; i < worldLayers; ++i) {
      for (let f = 0; f < worldHeight; ++f) {
        for (let k = 0; k < worldWidth; ++k) {
          cb(i, f, k);
        }
      }
    }
  }

  fillDeposit(layer, height, width) {
    const r = 1 + srand(depositRadius);
    const d = 0.5 + srand(0.5);
    for (let f = height - r; f <= height + r; ++f) {
      if (f > 0 && f < worldHeight) {
        for (let k = width - r; k <= width + r; ++k) {
          if (k > 0 && k < worldWidth) {
            if (Math.random() < d) {
              this.bytes[layer][f][k] = this.bytes[layer][height][width];
            }
          }
        }
      }
    }
  }

  fillWorld() {
    this.iter((layer, height, width) => {
      this.bytes[layer][height][width] = randStone(layer);
    });
    for (let i = 0; i < worldLayers; ++i) {
      for (let d = 0; d < layerDeposits; ++d) {
        this.fillDeposit(i, rand(worldHeight), rand(worldWidth));
      }
    }
  }
}
