const worldLayers = 16; // IF YOU CHANGE THIS, CHANGE `randStone`!
const worldHeight = 1000;
const worldWidth = 1000;

const layerDeposits = 1000;

function rand(max) {
  return Math.floor(Math.random()*max);
}

function srand(max, n = 2) {
  return Math.floor(Math.pow(Math.random(), n)*max);
}

function randStone(maxLayer) {
  if (Math.random() < 0.75) {
    return 0;
  }
  const layer = maxLayer - srand(maxLayer);
  return layer*16 + srand(16, 3);
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
    const horiz = 5 + srand(50);
    const vert = 5 + srand(50);
    for (let f = height - vert; f <= height + vert; ++f) {
      if (f >= 0 && f < worldHeight) {
        for (let k = width - horiz; k <= width + horiz; ++k) {
          if (Math.random() < Math.pow(Math.abs(f - height) / vert, 2)) {
            continue;
          }
          if (Math.random() < Math.pow(Math.abs(k - width) / horiz, 2)) {
            continue;
          }
          if (k >= 0 && k < worldWidth) {
            this.bytes[layer][f][k] = this.bytes[layer][height][width];
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
        const f = rand(worldHeight);
        const k = rand(worldHeight);
        this.bytes[i][f][k] = randStone(i);
        this.fillDeposit(i, rand(worldHeight), rand(worldWidth));
      }
    }
  }
}
