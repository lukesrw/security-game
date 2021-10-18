let load_getSpritesheet = {};
function getSpritesheet(src) {
    return new Promise(function (resolve) {
        if (src in load_getSpritesheet) {
            return resolve(load_getSpritesheet[src]);
        }

        load_getSpritesheet[src] = {
            img: new Image()
        };

        load_getSpritesheet[src].img.onload = function () {
            return resolve(load_getSpritesheet[src]);
        };

        load_getSpritesheet[src].img.src = src;
    });
}

let cache_getImage = {};

/**
 * @todo automate the creation of animations dummy
 */

let character_src = "/assets/modern_interiors/2_Characters/Character_Generator/";
let character_animations = {
    idle: {
        coords: {
            right: new Vector(0, 2),
            up: new Vector(6, 2),
            left: new Vector(12, 2),
            down: new Vector(18, 2)
        },
        size: new Vector(1, 2),
        length: 6,
        delay: 10
    },
    walk: {
        coords: {
            right: new Vector(0, 4),
            up: new Vector(6, 4),
            left: new Vector(12, 4),
            down: new Vector(18, 4)
        },
        size: new Vector(1, 2),
        length: 6,
        delay: 10
    },
    sleep: {
        coords: new Vector(0, 6),
        size: new Vector(1, 2),
        length: 6,
        delay: 10
    },
    sit_over: {
        coords: {
            right: new Vector(0, 8),
            left: new Vector(6, 8)
        },
        size: new Vector(1, 2),
        length: 6,
        delay: 10
    },
    sit_under: {
        coords: {
            right: new Vector(0, 10),
            left: new Vector(6, 10)
        },
        size: new Vector(1, 2),
        length: 6,
        delay: 10
    },
    phone: {
        coords: {
            down: new Vector(0, 12)
        },
        size: new Vector(1, 2),
        length: 8,
        reset: 3,
        end: "phone_away",
        delay: 10
    },
    phone_away: {
        coords: {
            down: new Vector(9, 12)
        },
        size: new Vector(1, 2),
        length: 3,
        reset: "idle",
        delay: 10
    },
    book: {
        coords: {
            down: new Vector(0, 14)
        },
        size: new Vector(1, 2),
        length: 5,
        reset: 0,
        delay: 10
    },
    page: {
        coords: {
            down: new Vector(6, 14)
        },
        size: new Vector(1, 2),
        length: 6,
        reset: "book",
        end: "book",
        delay: 10
    },
    cart: {
        coords: {
            right: new Vector(0, 16),
            up: new Vector(6, 16),
            left: new Vector(12, 16),
            down: new Vector(18, 16)
        },
        size: new Vector(1, 2),
        length: 6,
        delay: 10
    },
    pick_up: {
        coords: {
            right: new Vector(0, 18),
            up: new Vector(12, 18),
            left: new Vector(24, 18),
            down: new Vector(36, 18)
        },
        size: new Vector(1, 2),
        length: 12,
        delay: 10,
        reset: "idle"
    },
    gift: {
        coords: {
            right: new Vector(0, 20),
            up: new Vector(10, 20),
            left: new Vector(20, 20),
            down: new Vector(30, 20)
        },
        size: new Vector(1, 2),
        length: 10,
        delay: 10,
        reset: "idle"
    },
    lift: {
        coords: {
            right: new Vector(0, 22),
            up: new Vector(14, 22),
            left: new Vector(28, 22),
            down: new Vector(42, 22)
        },
        size: new Vector(1, 2),
        length: 14,
        reset: "idle",
        delay: 10
    },
    throw: {
        coords: {
            right: new Vector(0, 24),
            up: new Vector(14, 24),
            left: new Vector(28, 24),
            down: new Vector(42, 24)
        },
        size: new Vector(1, 2),
        length: 14,
        reset: "idle",
        delay: 10
    },
    hit: {
        coords: {
            right: new Vector(0, 26),
            up: new Vector(6, 26),
            left: new Vector(12, 26),
            down: new Vector(18, 26)
        },
        size: new Vector(1, 2),
        length: 6,
        reset: "idle",
        delay: 10
    },
    punch: {
        coords: {
            right: new Vector(0, 28),
            up: new Vector(6, 28),
            left: new Vector(12, 28),
            down: new Vector(18, 28)
        },
        size: new Vector(1, 2),
        length: 6,
        reset: "idle",
        delay: 10
    },
    stab: {
        coords: {
            right: new Vector(0, 30),
            up: new Vector(6, 30),
            left: new Vector(12, 30),
            down: new Vector(18, 30)
        },
        size: new Vector(1, 2),
        length: 6,
        reset: "idle",
        delay: 10
    },
    grab_gun: {
        coords: {
            right: new Vector(0, 32),
            up: new Vector(4, 32),
            left: new Vector(8, 32),
            down: new Vector(12, 32)
        },
        size: new Vector(1, 2),
        length: 6,
        reset: "idle_gun",
        delay: 10
    },
    idle_gun: {
        coords: {
            right: new Vector(0, 34),
            up: new Vector(6, 34),
            left: new Vector(12, 34),
            down: new Vector(18, 34)
        },
        size: new Vector(1, 2),
        length: 6,
        delay: 10
    },
    shoot: {
        coords: {
            right: new Vector(0, 36),
            up: new Vector(3, 36),
            left: new Vector(6, 36),
            down: new Vector(8, 36)
        },
        size: new Vector(1, 2),
        length: 3,
        delay: 10,
        reset: "idle_gun"
    },
    hurt: {
        coords: {
            right: new Vector(0, 38),
            up: new Vector(3, 38),
            left: new Vector(6, 38),
            down: new Vector(9, 38)
        },
        size: new Vector(1, 2),
        length: 3,
        delay: 10,
        reset: "idle"
    }
};

class Character {
    constructor(view, options, coords) {
        this.key = false;
        this.view = view;
        this.coords = coords;
        this.is_rendering = false;
        this.tick = 0;
        this.frame_delay = 0;
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

                        return Array.isArray(value) ? value[0] : value;
                    },
                    set: function (value) {
                        switch (property) {
                            case "frame":
                                // do not change
                                break;

                            default:
                                if (!Array.isArray(value)) {
                                    value = [value];
                                }

                                value = value.map(function (part) {
                                    if (typeof part === "number") {
                                        return ("0" + part).substr(-2);
                                    }

                                    return part;
                                });

                                if (property === "animation") {
                                    if (Array.isArray(this.raw[property])) {
                                        value = this.raw[property].concat(value);
                                    }
                                }
                        }

                        this.raw[property] = value;
                    }.bind(this)
                });
            }.bind(this)
        );

        options = Object.assign(this.raw, options);

        Object.keys(options).forEach(
            function (property) {
                this[property] = options[property];
            }.bind(this)
        );
    }

    static RENDER_ORDER = ["body", "eyes", "outfit", "hair", "accessory", "phone", "book"];

    getImage() {
        return new Promise(
            function (resolve) {
                let key = Object.values(this.raw).join("|");

                if (key in cache_getImage) {
                    if (this.complex !== cache_getImage[key].complex) {
                        this.complex = cache_getImage[key].complex;
                    }

                    return resolve(cache_getImage[key].img);
                }

                if (this.key && this.key in cache_getImage) {
                    this.complex = cache_getImage[this.key].complex;

                    resolve(cache_getImage[this.key].img);
                }

                cache_getImage[key] = false;

                let parts = Character.RENDER_ORDER.filter(
                    function (part) {
                        return this[part];
                    }.bind(this)
                ).map(
                    function (part) {
                        return getSpritesheet(this[part]);
                    }.bind(this)
                );

                Promise.all(parts)
                    .then(
                        function (spritesheets) {
                            let animation = this.getAnimation();
                            let canvas = document.createElement("canvas");
                            canvas.width = SIZE * 2;
                            canvas.height = SIZE * 10;

                            let context = canvas.getContext("2d");

                            cache_getImage[key] = {
                                img: new Image(),
                                complex: {}
                            };

                            spritesheets.forEach(
                                function (spritesheet, spritesheet_i) {
                                    if (spritesheet) {
                                        let offset = 0;
                                        if (this.state === "part") {
                                            offset = spritesheet_i * SIZE * 2;
                                        }

                                        context.drawImage(
                                            spritesheet.img,
                                            animation.coords.x * SIZE,
                                            animation.coords.y * SIZE,
                                            animation.size.x * SIZE,
                                            animation.size.y * SIZE,
                                            0,
                                            offset,
                                            animation.size.x * SIZE,
                                            animation.size.y * SIZE
                                        );

                                        cache_getImage[key].complex[parts[spritesheet_i]] = Complex.fromImage(
                                            this.coords,
                                            canvas,
                                            0,
                                            0,
                                            SIZE,
                                            SIZE * 10,
                                            SIZE,
                                            SIZE * 10
                                        );
                                    }
                                }.bind(this)
                            );

                            cache_getImage[key].img.onload = function () {
                                this.complex = cache_getImage[key].complex;
                                this.key = key;

                                return resolve(cache_getImage[key].img);
                            }.bind(this);

                            cache_getImage[key].img.src = canvas.toDataURL();
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

    getAnimation(value) {
        let animation = character_animations[value || this.animation];

        return {
            coords: (animation.coords[this.facing] || animation.coords).clone().add({
                x: this.frame
            }),
            size: animation.size,
            length: animation.length,
            reset: animation.reset || 0,
            delay: animation.delay,
            end: animation.end
        };
    }

    render() {
        this.tick += 1;
        if (this.tick >= this.frame_delay) {
            this.tick = 0;
            this.frame += 1;

            // cycle rendering
            let animation = this.getAnimation();

            if (this.frame_delay === 0) this.frame_delay = animation.delay;

            if (this.frame === animation.length) {
                if (typeof animation.reset === "string" && this.raw.animation.length === 1) {
                    this.raw.animation.splice(1, 0, animation.reset);
                }

                if (this.raw.animation.length > 1) {
                    if (typeof animation.end === "string") {
                        this.raw.animation.splice(1, 0, animation.end);
                    }

                    this.raw.animation.shift();

                    animation = this.getAnimation();
                    this.frame_delay = animation.delay;
                    this.frame = 0;
                } else {
                    this.frame = animation.reset || 0;
                }
            }
        }

        if (!this.is_rendering) {
            this.is_rendering = true;

            this.getImage().then(
                function (image) {
                    this.view.context.globalAlpha = this.is_hover ? 0.5 : 1;

                    inShadow(
                        this.view.context,
                        function () {
                            this.view.context.drawImage(image, this.coords.x, this.coords.y);
                        }.bind(this)
                    );

                    this.is_rendering = false;
                }.bind(this)
            );
        }
    }
}
