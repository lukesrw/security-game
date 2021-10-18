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
let character_src = "/assets/modern_interiors/2_Characters/Character_Generator/";
let character_animations = {
    idle: 6,
    walk: 6,
    sleep: 6,
    sit_over: 6,
    sit_under: 6,
    phone: 8,
    phone_away: 3,
    book: 6,
    page: 6,
    cart: 6,
    pick_up: 12,
    gift: 10,
    lift: 14,
    throw: 14,
    hit: 6,
    punch: 6,
    stab: 6,
    grab_gun: 4,
    idle_gun: 6,
    shoot: 3,
    hurt: 3
};

Object.keys(character_animations).forEach(function (name, name_i) {
    if (name_i > 5) {
        name_i -= 1;
        if (name_i > 6) {
            name_i -= 1;
        }
    }

    console.table({
        name: name,
        name_i: name_i,
        calc: 2 + name_i * 2
    });

    name_i = 2 + name_i * 2;

    character_animations[name] = {
        coords: {
            right: new Vector(0, name_i),
            up: new Vector(character_animations[name], name_i),
            left: new Vector(character_animations[name] * 2, name_i),
            down: new Vector(character_animations[name] * 3, name_i)
        },
        size: new Vector(1, 2),
        length: character_animations[name],
        delay: 10
    };

    switch (name) {
        case "phone":
            character_animations[name].end = "phone_away";
            character_animations[name].reset = 3;
            break;

        case "phone_away":
        case "pick_up":
        case "gift":
        case "lift":
        case "throw":
        case "hit":
        case "punch":
        case "stab":
        case "hurt":
            character_animations[name].reset = "idle";
            break;

        case "page":
            character_animations[name].reset = "book";
            character_animations[name].end = "book";
            break;

        case "grab_gun":
        case "shoot":
            character_animations[name].reset = "idle_gun";
            break;
    }
});

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
