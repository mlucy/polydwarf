const worldLayers = 16;
const worldWidth = 1000;
const worldHeight = 1000;

class World {
  constructor() {
    this.bytes = [];
    for (const i = 0; i < worldLayers; ++i) {
      const layer = [];
      for (const f = 0; f < worldHeight; ++f) {
        const line = new Uint8Array();
        for (const k = 0; k < worldWidth; ++k) {
          line.push(0);
          line.push(0);
          line.push(0);
          line.push(0);
        }
        layer.push(line);
      }
      bytes.push(layer);
    }
  }
  forEach(cb) {
    for (const i = 0; i < worldLayers; ++i) {
      for (const f = 0; f < worldHeight; ++f) {
        for (const k = 0; k < worldWidth; ++k) {
          cb(this.bytes[i][f][k*4+0],
             this.bytes[i][f][k*4+1],
             this.bytes[i][f][k*4+2],
             this.bytes[i][f][k*4+3]);
        }
      }
    }
  }
}
