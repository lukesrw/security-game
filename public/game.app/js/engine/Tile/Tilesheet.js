class Tilesheet extends Image {
    constructor(src, onload) {
        super();

        // Image
        this.onload = onload;
        this.src = src;

        // storage
        this.tiles = {};
        this.animation = {};
    }

    createTile(name, coords, size) {
        this.tiles[name] = new Tile(this, coords, size);

        return this.tiles[name];
    }

    createAnimation(name, size, tiles) {
        this.animation[name] = new TileAnimation(this, size, tiles);

        return this.animation[name];
    }
}
