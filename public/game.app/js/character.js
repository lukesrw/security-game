let load_getSpritesheet = {};
function getSpritesheet(src) {
    return new Promise(function (resolve) {
        if (src in load_getSpritesheet) {
            return resolve(load_getSpritesheet[src]);
        } else {
            load_getSpritesheet[src] = {
                img: new Image()
            };

            load_getSpritesheet[src].img.onload = function () {
                return resolve(load_getSpritesheet[src]);
            };

            load_getSpritesheet[src].img.src = src;
        }
    });
}

let character_src = "/assets/modern_interiors/2_Characters/Character_Generator/";
let character_animations = {
    idle: {
        coords: {
            right: new Vector(0, 0),
            up: new Vector(1, 0),
            left: new Vector(2, 0),
            down: new Vector(3, 0)
        },
        size: new Vector(1, 2)
    }
};

class Character {
    constructor(view, options, coords) {
        this.view = view;
        this.coords = coords;
        this.is_rendering = false;
        this.cache = {};
        this.raw = {
            frame: 0,
            is_hover: false,
            state: "whole",
            animation: "idle",
            facing: "right",
            accessory: false,
            body: false,
            book: false,
            eyes: false,
            hair: false,
            outfit: false,
            phone: false,
            is_kid: false
        };

        Object.keys(this.raw).forEach(
            function (property) {
                Object.defineProperty(this, property, {
                    get: function () {
                        let value = this.raw[property];

                        if (value) {
                            switch (property) {
                                case "accessory":
                                    return character_src + accessories.getPath(value);

                                case "body":
                                    return character_src + bodies.getPath(value, this.is_kid);

                                case "book":
                                    return character_src + books.getPath(value);

                                case "eyes":
                                    return character_src + eyes.getPath(value, this.is_kid);

                                case "hair":
                                    return character_src + hairs.getPath(value, this.is_kid);

                                case "outfit":
                                    return character_src + outfits.getPath(value, this.is_kid);

                                case "phone":
                                    return character_src + phones.getPath(value);
                            }

                            if (Array.isArray(value)) {
                                return value[0];
                            }

                            return value;
                        }

                        return false;
                    },
                    set: function (value) {
                        if (!Array.isArray(value)) {
                            value = [value];
                        }

                        value = value.map(function (part) {
                            if (typeof part === "number") {
                                return ("0" + part).substr(-2);
                            }

                            return part;
                        });

                        this.raw[property] = value;
                    }.bind(this)
                });
            }.bind(this)
        );

        Object.keys(options).forEach(
            function (property) {
                this[property] = options[property];
            }.bind(this)
        );
    }

    static SHADOW_SIZE = 5;
    static RENDER_ORDER = ["body", "eyes", "outfit", "hair", "accessory", "phone", "book"];

    getImage() {
        return new Promise(
            function (resolve) {
                let key = Object.values(this.raw).join("|");

                if (key in this.cache) return resolve(this.cache[key]);

                this.cache[key] = false;

                Promise.all(
                    Character.RENDER_ORDER.filter(
                        function (part) {
                            return this[part];
                        }.bind(this)
                    ).map(
                        function (part) {
                            return getSpritesheet(this[part]);
                        }.bind(this)
                    )
                )
                    .then(
                        function (spritesheets) {
                            let animation = character_animations[this.animation];
                            let canvas = document.createElement("canvas");
                            canvas.width = SIZE;
                            canvas.height = SIZE * 10;

                            let context = canvas.getContext("2d");

                            spritesheets.forEach(
                                function (spritesheet, spritesheet_i) {
                                    if (spritesheet) {
                                        let offset = 0;
                                        if (this.state === "part") {
                                            offset = spritesheet_i * SIZE * 2;
                                        }

                                        context.drawImage(
                                            spritesheet.img,
                                            animation.coords[this.facing].x * SIZE,
                                            animation.coords[this.facing].y * SIZE,
                                            animation.size.x * SIZE,
                                            animation.size.y * SIZE,
                                            0,
                                            offset,
                                            animation.size.x * SIZE,
                                            animation.size.y * SIZE
                                        );
                                    }
                                }.bind(this)
                            );

                            let shadow_canvas = document.createElement("canvas");
                            let shadow_context = shadow_canvas.getContext("2d");

                            if (this.is_hover) shadow_context.globalAlpha = 0.5;

                            inShadow(shadow_context, function () {
                                shadow_context.drawImage(canvas, Character.SHADOW_SIZE, Character.SHADOW_SIZE);
                            });

                            this.cache[key] = new Image();
                            this.cache[key].onload = function () {
                                this.complex = Complex.fromImage(
                                    this.coords,
                                    this.cache[key],
                                    0,
                                    0,
                                    SIZE,
                                    SIZE * 2,
                                    SIZE,
                                    SIZE * 2
                                );

                                return resolve(this.cache[key]);
                            }.bind(this);
                            this.cache[key].src = shadow_canvas.toDataURL();
                        }.bind(this)
                    )
                    .catch(console.log);
            }.bind(this)
        );
    }

    onMouseOver() {
        this.is_hover = true;
    }

    onMouseOut() {
        this.is_hover = false;
    }

    onClick() {
        if (this.state === "whole") {
            this.state = "part";
        } else {
            this.state = "whole";
        }
    }

    async render() {
        if (!this.is_rendering) {
            this.is_rendering = true;

            let img = await this.getImage();

            if (img) {
                this.view.context.drawImage(
                    img,
                    this.coords.x - Character.SHADOW_SIZE,
                    this.coords.y - Character.SHADOW_SIZE
                );
            }

            this.is_rendering = false;
        }
    }
}
