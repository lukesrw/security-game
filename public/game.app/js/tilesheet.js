class Tilesheet extends Image {
    constructor(src) {
        super();

        this.src = src;
        this.tiles = {};
    }

    createTile(name, x, y, width, height) {
        this.tiles[name] = new Tile(this, x, y, width, height);

        return this.tiles[name];
    }
}
