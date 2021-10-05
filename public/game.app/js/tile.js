class Tile {
    constructor(tilesheet, x, y, width, height) {
        this.tilesheet = tilesheet;

        this.x = x * SIZE;
        this.y = y * SIZE;

        this.width = width * SIZE;
        this.height = height * SIZE;

        this.split = false;
    }

    render(context, x, y, modify) {
        if (this.split && modify) {
            if (modify.anchor) {
                if (typeof modify.anchor === "string") {
                    modify.anchor = modify.anchor.toLowerCase().split(" ");
                }

                while (modify.anchor && Array.isArray(modify.anchor) && modify.anchor.length) {
                    switch (modify.anchor[0]) {
                        case "bottom":
                            y -= modify.height - this.split.h[1];
                            break;

                        case "right":
                            x -= modify.width - this.split.w[1];
                            break;
                    }

                    modify.anchor.shift();
                }
            }

            // top left
            context.drawImage(
                this.tilesheet,
                this.x,
                this.y,
                this.split.w[0],
                this.split.h[0],
                x,
                y,
                this.split.w[0],
                this.split.h[0]
            );

            context.drawImage(
                this.tilesheet,
                this.x,
                this.split.y[1],
                this.split.w[0],
                this.split.h[1],
                x,
                y + this.split.h[0],
                this.split.w[0],
                modify.height
            );

            context.drawImage(
                this.tilesheet,
                this.split.x[1],
                this.split.y[1],
                this.split.w[2],
                this.split.h[1],
                x + this.split.w[0] + modify.width,
                y + this.split.h[0],
                this.split.w[2],
                modify.height
            );

            // top middle
            context.drawImage(
                this.tilesheet,
                this.split.x[0],
                this.y,
                this.split.w[1],
                this.split.h[0],
                x + this.split.w[0],
                y,
                modify.width,
                this.split.h[0]
            );

            context.drawImage(
                this.tilesheet,
                this.split.x[0],
                this.split.y[1],
                this.split.w[1],
                this.split.h[2],
                x + this.split.w[0],
                y + this.split.h[0] + modify.height,
                modify.width,
                this.split.h[2]
            );

            // bottom left
            context.drawImage(
                this.tilesheet,
                this.x,
                this.split.y[1],
                this.split.w[0],
                this.split.h[2],
                x,
                y + this.split.h[0] + modify.height,
                this.split.w[0],
                this.split.h[2]
            );

            context.drawImage(
                this.tilesheet,
                this.split.x[1],
                this.y,
                this.split.w[2],
                this.split.h[0],
                x + this.split.w[0] + modify.width,
                y,
                this.split.w[2],
                this.split.h[0]
            );

            context.drawImage(
                this.tilesheet,
                this.split.x[1],
                this.split.y[1],
                this.split.w[2],
                this.split.h[2],
                x + this.split.w[0] + modify.width,
                y + this.split.h[0] + modify.height,
                this.split.w[2],
                this.split.h[2]
            );

            context.drawImage(
                this.tilesheet,
                this.split.x[0],
                this.split.y[1],
                this.split.w[1],
                this.split.h[1],
                x + this.split.w[0],
                y + this.split.h[0],
                modify.width,
                modify.height
            );
        } else {
            context.drawImage(this.tilesheet, this.x, this.y, this.width, this.height, x, y, this.width, this.height);
        }

        return this;
    }

    setSplit(x, y, width, height) {
        this.split = {
            h: [y, height, this.height - y - height],
            w: [x, width, this.width - x - width],
            x: [this.x + x, this.x + x + width],
            y: [this.y + y, this.y + y + height]
        };

        return this;
    }

    debug(context, x, y) {
        this.render(context, x, y);

        if (this.split) {
            context.save();

            x += 0.5;
            y += 0.5;

            context.strokeStyle = "#F00";
            context.strokeWidth = 1;

            var x2 = x + this.split.w[0] + this.split.w[1];
            var y2 = y + this.split.h[0] + this.split.h[1];
            var w1 = this.split.w[0] - 1;
            var w2 = this.width - w1 - this.split.w[1] - 2;
            var h1 = this.split.h[0] - 1;
            var h2 = this.height - h1 - this.split.h[1] - 2;

            context.strokeRect(x, y, w1, h1); // top left
            context.strokeRect(x2, y, w2, h1); // top right
            context.strokeRect(x, y2, w1, h2); // bottom left
            context.strokeRect(x2, y2, w2, h2); // bottom right
            context.restore();
        }

        return this;
    }
}
