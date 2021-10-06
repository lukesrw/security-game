class Tile {
    constructor(tilesheet, coords, size) {
        this.tilesheet = tilesheet;

        this.coords = {
            x: coords.x * SIZE,
            y: coords.y * SIZE
        };

        this.size = {
            x: size.x * SIZE,
            y: size.y * SIZE
        };

        this.split = false;
    }

    render(context, coords, modify) {
        if (this.split && modify) {
            if (typeof modify.anchor === "string") {
                modify.anchor = modify.anchor.toLowerCase();

                if (modify.anchor.indexOf("bottom") > -1) {
                    coords.y -= modify.size.y - this.split.h[1];
                }

                if (modify.anchor.indexOf("right") > -1) {
                    coords.x -= modify.size.x - this.split.w[1];
                }
            }

            // top left
            context.drawImage(
                this.tilesheet,
                this.coords.x,
                this.coords.y,
                this.split.w[0],
                this.split.h[0],
                coords.x,
                coords.y,
                this.split.w[0],
                this.split.h[0]
            );

            // top middle
            context.drawImage(
                this.tilesheet,
                this.split.x[0],
                this.coords.y,
                this.split.w[1],
                this.split.h[0],
                coords.x + this.split.w[0],
                coords.y,
                modify.size.x,
                this.split.h[0]
            );

            // top right
            context.drawImage(
                this.tilesheet,
                this.split.x[1],
                this.coords.y,
                this.split.w[2],
                this.split.h[0],
                coords.x + this.split.w[0] + modify.size.x,
                coords.y,
                this.split.w[2],
                this.split.h[0]
            );

            // middle left
            context.drawImage(
                this.tilesheet,
                this.coords.x,
                this.split.y[1],
                this.split.w[0],
                this.split.h[1],
                coords.x,
                coords.y + this.split.h[0],
                this.split.w[0],
                modify.size.y
            );

            // middle center
            context.drawImage(
                this.tilesheet,
                this.split.x[0],
                this.split.y[1],
                this.split.w[1],
                this.split.h[1],
                coords.x + this.split.w[0],
                coords.y + this.split.h[0],
                modify.size.x,
                modify.size.y
            );

            // middle right
            context.drawImage(
                this.tilesheet,
                this.split.x[1],
                this.split.y[1],
                this.split.w[2],
                this.split.h[1],
                coords.x + this.split.w[0] + modify.size.x,
                coords.y + this.split.h[0],
                this.split.w[2],
                modify.size.y
            );

            // bottom left
            context.drawImage(
                this.tilesheet,
                this.coords.x,
                this.split.y[1],
                this.split.w[0],
                this.split.h[2],
                coords.x,
                coords.y + this.split.h[0] + modify.size.y,
                this.split.w[0],
                this.split.h[2]
            );

            // bottom center
            context.drawImage(
                this.tilesheet,
                this.split.x[0],
                this.split.y[1],
                this.split.w[1],
                this.split.h[2],
                coords.x + this.split.w[0],
                coords.y + this.split.h[0] + modify.size.y,
                modify.size.x,
                this.split.h[2]
            );

            // bottom right
            context.drawImage(
                this.tilesheet,
                this.split.x[1],
                this.split.y[1],
                this.split.w[2],
                this.split.h[2],
                coords.x + this.split.w[0] + modify.size.x,
                coords.y + this.split.h[0] + modify.size.y,
                this.split.w[2],
                this.split.h[2]
            );
        } else {
            context.drawImage(
                this.tilesheet,
                this.coords.x,
                this.coords.y,
                this.size.x,
                this.size.y,
                coords.x,
                coords.y,
                this.size.x,
                this.size.y
            );
        }

        return this;
    }

    setSplit(coords, size) {
        this.split = {
            h: [coords.y, size.y, this.size.y - coords.y - size.y],
            w: [coords.x, size.x, this.size.x - coords.x - size.x],
            x: [this.coords.x + coords.x, this.coords.x + coords.x + size.x],
            y: [this.coords.y + coords.y, this.coords.y + coords.y + size.y]
        };

        return this;
    }

    debug(context, coords, modify) {
        this.render(context, coords, modify);

        if (this.split) {
            context.save();

            coords.x += 0.5;
            coords.y += 0.5;

            context.strokeStyle = "#F00";
            context.strokeWidth = 1;

            var x2 = coords.x + this.split.w[0] + this.split.w[1];
            var y2 = coords.y + this.split.h[0] + this.split.h[1];
            var w1 = this.split.w[0] - 1;
            var w2 = this.size.x - w1 - this.split.w[1] - 2;
            var h1 = this.split.h[0] - 1;
            var h2 = this.size.y - h1 - this.split.h[1] - 2;

            context.strokeRect(coords.x, coords.y, this.split.w[0] - 1, this.split.h[0] - 1); // top left
            context.strokeRect(x2, coords.y, w2, h1); // top right
            context.strokeRect(coords.x, y2, w1, h2); // bottom left
            context.strokeRect(x2, y2, w2, h2); // bottom right
            context.restore();
        }

        return this;
    }
}
