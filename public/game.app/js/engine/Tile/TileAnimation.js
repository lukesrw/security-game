class TileAnimation {
    constructor(tilesheet, size, tiles) {
        this.tilesheet = tilesheet;

        this.tiles = tiles.map(
            function (tile) {
                if (!(tile instanceof Tile)) {
                    tile = new Tile(this.tilesheet, tile, size);
                }

                return tile;
            }.bind(this)
        );

        this.tile_i = 0;

        this.delay = Math.floor(1000 / this.tiles.length);

        this.frame = 0;
    }

    render(context, coords, modify) {
        this.frame += 1;

        if (this.frame >= this.delay) {
            this.frame = 0;
            this.tile_i = (this.tile_i + 1) % this.tiles.length;
        }

        console.log(this.tile_i, new Date().toString());

        return this.tiles[this.tile_i].render(context, coords, modify);
    }

    debug(context, coords, modify) {
        this.tiles.forEach(function (tile) {
            tile.render(context, coords, modify);

            coords.x += SIZE;
        });
    }
}
