// constants
var SIZE = 48;

// functions
function toGrid(x_or_y) {
    return Math.floor(x_or_y / SIZE) * SIZE;
}

var getSheet_names = {
    ui: "4_User_Interface_Elements/UI_48x48.png"
};
function getSheet(name, src) {
    if (!(name in image)) {
        if (name in getSheet_names) {
            src = getSheet_names[name];
        } else {
            getSheet_names[name] = src;
        }

        image[name] = new Tilesheet("/assets/modern_interiors/" + src);
    }

    return image[name].complete ? image[name] : false;
}

function getCharacterSheet(part, index, colour) {
    var name = "character_" + part + "_";
    var src = "2_Characters/Character_Generator/";

    switch (part) {
        case "accessory":
            src += "Accessories/48x48/Accessory_";
            break;

        case "book":
            src += "Books/48x48/Book_48x48_";
            break;

        case "eyes":
            src += "Eyes/48x48/Eyes_48x48_";
            break;

        case "eyes_kids":
            src += "Eyes_kids/48x48/Eyes_kids_48x48_";
            break;

        case "hair":
            src += "Hairstyles/48x48/Hairstyle_";
            break;

        case "hair_kids":
            src += "Hairstyles_kids/48x48/Hairstyle_kid_";
            break;

        case "outfit":
            src += "Outfits/48x48/Outfit_";
            break;

        case "outfit_kids":
            src += "Outfits_kids/48x48/Outfit_kid_";
            break;

        case "phone":
            src += "Smartphones/48x48/Smartphone_48x48_";
            break;

        case "body":
            src += "Bodies/48x48/Body_48x48_";
            break;

        case "body_kid":
            src += "Bodies_kids/48x48/Body_";
            break;
    }

    index = ("0" + index).substr(-2);
    name += index;
    src += index;

    switch (part) {
        case "accessory":
            switch (index) {
                case "01":
                    src += "_Ladybug_48x48_";
                    break;

                case "02":
                    src += "_Bee_48x48_";
                    break;

                case "03":
                    src += "_Backpack_48x48_";
                    break;

                case "04":
                    src += "_Snapback_48x48_";
                    break;

                case "05":
                    src += "_Dino_Snapback_48x48_";
                    break;

                case "06":
                    src += "_Policeman_Hat_48x48_";
                    break;

                case "07":
                    src += "_Bataclava_48x48_";
                    break;

                case "08":
                    src += "_Detective_Hat_48x48_";
                    break;

                case "09":
                    src += "_Zombie_Brain_48x48_";
                    break;

                case "10":
                    src += "_Bolt_48x48_";
                    break;

                case "11":
                    src += "_Beanie_48x48_";
                    break;

                case "12":
                    src += "_Mustache_48x48_";
                    break;

                case "13":
                    src += "_Beard_48x48_";
                    break;

                case "14":
                    src += "_Gloves_48x48_";
                    break;

                case "15":
                    src += "_Glasses_48x48_";
                    break;

                case "16":
                    src += "_Monocle_48x48_";
                    break;

                case "17":
                    src += "_Medical_Mask_48x48_";
                    break;

                case "18":
                    src += "_Chef_48x48_";
                    break;

                case "19":
                    src += "_Party_Cone_48x48_";
                    break;
            }
            break;

        case "body_kid":
            src += "_kid_48x48";
            break;

        case "outfit":
            src += "_48x48_";
            break;

        case "outfit_kid":
            src += "_48x48";
            break;
    }

    if (colour) {
        colour = ("0" + colour).substr(-2);
        name += index;
        src += colour;
    }

    return getSheet(name, src + ".png");
}

function inShadow(context, callable, is_shadow_only) {
    if (is_shadow_only) context.shadowOffsetX = 2000;

    context.shadowColor = "#000000AA";
    context.shadowBlur = SIZE / 2;

    callable();

    if (is_shadow_only) context.shadowOffsetX = 0;

    context.shadowBlur = 0;
}

function pickRandom(list) {
    return lists[Math.floor(Math.random() * list.length)];
}

function createSpeech(context, text, left_x, top_y, entity, prerender) {
    if (typeof text === "string") text = [text];

    var longest = text[0];
    for (var i = 1; i < text.length; i += 1) {
        if (text[i].length > longest.length) {
            longest = text[i];
        }
    }

    var font = context.measureText(longest);
    var width = font.width - 12;
    var corners = 33;

    font = (font.actualBoundingBoxAscent + font.actualBoundingBoxDescent) * 1.8;

    var height = (text.length - 1) * font;
    var x = left_x + SIZE / 4;
    var y = top_y - SIZE / 2;

    inShadow(
        context,
        function () {
            var bounds = [x + 6 - 2000, y + 21, width + corners, height + corners - 6];

            if (entity) entity.bounds = [bounds];

            context.fillRect(...bounds);
        },
        true
    );

    if (typeof prerender === "function") prerender();

    image.ui.tiles.speech.render(
        context,
        {
            x,
            y
        },
        {
            size: {
                x: width,
                y: height
            },
            anchor: "bottom left"
        }
    );

    x += 16;
    y += 35;

    // text
    context.fillStyle = "#000";
    text.forEach(function (line) {
        context.fillText(line, x, y);

        y += font;
    });
}

// classes
function Mouse() {
    var that = this;

    that.down = {
        is_pressed: false,
        x: 0,
        y: 0
    };

    that.x = 0;
    that.y = 0;

    that.size = {
        x: 1,
        y: 1
    };

    that.grid = {
        x: 0,
        y: 0
    };

    that.getEntities = function () {
        return entities.filter(function (entity) {
            return (
                entity.bounds &&
                entity.bounds.some(function (bound) {
                    return (
                        that.x > bound[0] &&
                        that.y > bound[1] &&
                        that.x < bound[0] + bound[2] &&
                        that.y < bound[1] + bound[3]
                    );
                })
            );
        });
    };

    that.onClick = function () {
        if (keyboard.isPressed("CapsLock")) {
            tiles.push([
                spritesheet,
                coords.x * SIZE,
                coords.y * SIZE,
                mouse.size.x * SIZE,
                mouse.size.y * SIZE,
                ...mouse.getCursor()
            ]);
        } else {
            that.getEntities().forEach(function (entity) {
                if (typeof entity.onClick === "function") entity.onClick();
            });
        }
    };

    that.onMove = function () {
        if (that.down.is_pressed) {
            that.onClick();
        }

        that.getEntities().forEach(function (entity) {
            if (typeof entity.onHover === "function") entity.onHover();
        });
    };

    that.onDrag = function () {};

    /**
     * @param {MouseEvent|WheelEvent} event
     */
    that.onEvent = function (event) {
        switch (event.type) {
            case "mousemove":
                that.x = event.clientX - canvas.offsetLeft;
                that.y = event.clientY - canvas.offsetTop;

                var x_grid = toGrid(that.x);
                var y_grid = toGrid(that.y);

                if (x_grid !== that.grid.x || y_grid !== that.grid.y) {
                    that.grid.x = x_grid;
                    that.grid.y = y_grid;
                }

                that.onMove();
                break;

            case "wheel":
                var keys = Object.keys(image);
                var key = keys.indexOf(spritesheet);

                if (event.deltaY > 0) {
                    key += 1;
                } else {
                    key -= 1;
                }

                if (typeof keys[key] === "undefined") {
                    key = key > 0 ? 0 : keys.length - 1;
                }

                spritesheet = keys[key];
                break;

            case "mousedown":
            case "mouseup":
                var was_down = that.down.is_pressed;

                that.down.is_pressed = event.type === "mousedown";

                if (that.down.is_pressed) {
                    if (!was_down) {
                        that.down.x = that.x;
                        that.down.y = that.y;
                        that.down.grid = JSON.parse(JSON.stringify(that.grid));
                    }
                } else {
                    if (was_down) {
                        if (JSON.stringify(that.grid) === JSON.stringify(that.down.grid)) {
                            that.onClick();
                        } else {
                            that.onDrag();
                        }
                    }
                }
                break;
        }
    };

    that.getCursor = function (offset) {
        if (typeof offset === "undefined") offset = 0;

        return [that.grid.x + offset, that.grid.y + offset, that.size.x * SIZE, that.size.y * SIZE];
    };
}

function Keyboard(keys) {
    var that = this;

    that.keys = typeof keys === "undefined" ? {} : keys;

    /**
     * @param {KeyboardEvent} event
     */
    that.onEvent = function (event) {
        switch (event.type) {
            case "keydown":
            case "keyup":
                if (!(event.key in that.keys)) {
                    that.keys[event.key] = {
                        is_pressed: false
                    };
                }

                if (event.key === "CapsLock") {
                    that.keys[event.key].is_pressed = event.getModifierState("CapsLock");
                } else {
                    that.keys[event.key].is_pressed = event.type === "keydown";
                }

                if (typeof that.keys[event.key][event.type] === "function") {
                    that.keys[event.key][event.type](event);
                }
                break;
        }
    };

    that.isPressed = function (key) {
        return key in that.keys ? that.keys[key].is_pressed : false;
    };
}

function Character(setup) {
    var that = this;

    that.onClick = function () {
        switch (that.state) {
            case "saying":
                // createSpeech(context, ["Hello World"], 100, 100);

                that.text.push("", "Hello?!");

                that.state = "waiting";
                break;
        }
    };

    that.onHover = function () {
        if (that.state === "saying") {
            canvas.style.cursor = "pointer";
        }
    };

    that.isLoaded = function () {
        var conditions = [];

        if (that.text.length) conditions.push(getSheet("ui"));

        conditions.push(that.getPart("accessory"));
        conditions.push(that.getPart("body"));

        return conditions.every(function (item) {
            return typeof item === "object";
        });
    };

    that.getPart = function (name) {
        var is_kid = that.is_kid ? "_kid" : "";

        switch (name) {
            case "accessory":
                if (that.parts.accessory && Array.isArray(that.parts.accessory)) {
                    return getCharacterSheet("accessory", ...that.parts.accessory);
                }
                break;

            case "body":
                return getCharacterSheet("body" + is_kid, that.parts.body);

            case "book":
                if (that.parts.book) {
                    return getCharacterSheet("book", that.parts.book);
                }
                break;

            case "eyes":
                return getCharacterSheet("eyes" + is_kid, that.parts.eyes);

            case "hair":
                if (that.parts.hair && Array.isArray(that.parts.hair)) {
                    return getCharacterSheet("hair" + is_kid, ...that.parts.hair);
                }
                break;

            case "outfit":
                if (that.parts.outfit && Array.isArray(that.parts.outfit)) {
                    return getCharacterSheet("outfit" + is_kid, ...that.parts.outfit);
                }
                break;

            case "phone":
                if (that.parts.phone) {
                    return getCharacterSheet("phone", that.parts.phone);
                }
                break;
        }

        return false;
    };

    that.renderBase = function (context) {
        var draw = [SIZE * 3, 0, SIZE, SIZE * 2, that.x, that.y, SIZE, SIZE * 2];
        var accessory = that.getPart("accessory");
        var book = that.getPart("book");
        var eyes = that.getPart("eyes");
        var hair = that.getPart("hair");
        var outfit = that.getPart("outfit");
        var phone = that.getPart("phone");

        /**
         * @todo generate using hair/eyes/body/etc.
         */
        inShadow(context, function () {
            context.drawImage(that.getPart("body"), ...draw);
        });

        if (accessory) context.drawImage(accessory, ...draw);
        if (book) context.drawImage(book, ...draw);
        if (eyes) context.drawImage(eyes, ...draw);
        if (hair) context.drawImage(hair, ...draw);
        if (outfit) context.drawImage(outfit, ...draw);
        if (phone) context.drawImage(phone, ...draw);

        return image.character.complete;
    };

    that.render = function (context) {
        if (that.isLoaded()) {
            if (that.text.length) {
                createSpeech(context, that.text, that.x, that.y, that, function () {
                    that.renderBase(context);
                });
            } else {
                that.renderBase(context);
            }
        }
    };

    that.x = setup.x || 0;
    that.y = setup.y || 0;
    that.text = setup.text || [];
    that.bounds = [];
    that.state = "saying";
    that.parts = Object.assign(
        {
            accessory: [6, 1],
            body: 1,
            book: 1,
            eyes: 1,
            hair: 1,
            outfit: [6, 1],
            phone: 1
        },
        setup.parts
    );
    that.facing = setup.facing || "down";
    that.is_kid = Boolean(setup.is_kid);
}

// globals
var frame = 0;
var entities = [];
var spritesheet = "interiors";
var tiles = [["interiors", 384, 0, 192, 96, 144, 192, 192, 96]];
var mouse = new Mouse();
var coords = {
    x: 0,
    y: 0
};
var keyboard = new Keyboard({
    Shift: {
        keyup: render,
        keydown: render
    },
    ArrowLeft: {
        keydown: function () {
            if (keyboard.isPressed("Shift")) {
                coords.x = Math.max(0, coords.x - 1);
            } else {
                mouse.size.x = Math.max(1, mouse.size.x - 1);
            }
        }
    },
    ArrowRight: {
        keydown: function () {
            if (keyboard.isPressed("Shift")) {
                coords.x = Math.min(image[spritesheet].width / SIZE - 1, coords.x + 1);
            } else {
                mouse.size.x = Math.min(image[spritesheet].width / SIZE, mouse.size.x + 1);
            }
        }
    },
    ArrowUp: {
        keydown: function () {
            if (keyboard.isPressed("Shift")) {
                coords.y = Math.max(0, coords.y - 1);
            } else {
                mouse.size.y = Math.max(1, mouse.size.y - 1);
            }
        }
    },
    ArrowDown: {
        keydown: function () {
            if (keyboard.isPressed("Shift")) {
                coords.y = Math.min(image[spritesheet].height / SIZE - 1, coords.y + 1);
            } else {
                mouse.size.y = Math.min(image[spritesheet].height / SIZE, mouse.size.y + 1);
            }
        }
    }
});

canvas.addEventListener("mousemove", mouse.onEvent);
canvas.addEventListener("mousedown", mouse.onEvent);
canvas.addEventListener("mouseup", mouse.onEvent);
canvas.addEventListener("wheel", mouse.onEvent);

canvas.addEventListener("keyup", keyboard.onEvent);
canvas.addEventListener("keydown", keyboard.onEvent);

var image = {
    ui: new Tilesheet("/assets/modern_interiors/4_User_Interface_Elements/UI_48x48.png"),
    character: new Tilesheet(
        "/assets/modern_interiors/2_Characters/Character_Generator/0_Premade_Characters/48x48/Premade_Character_48x48_19.png"
    )
};

image.ui
    .createTile(
        "speech",
        {
            x: 4,
            y: 0
        },
        {
            x: 1,
            y: 2
        }
    )
    .setSplit(
        {
            x: 33,
            y: 48
        },
        {
            x: 3,
            y: 6
        }
    );

image.character.createAnimation(
    "walk",
    {
        x: 1,
        y: 2
    },
    [
        {
            x: 0,
            y: 4
        },
        {
            x: 1,
            y: 4
        },
        {
            x: 2,
            y: 4
        },
        {
            x: 3,
            y: 4
        },
        {
            x: 4,
            y: 4
        },
        {
            x: 5,
            y: 4
        }
    ]
);

getSheet("interiors", "1_Interiors/48x48/Theme_Sorter_48x48/18_Jail_48x48.png");
// getSheet("character", "2_Characters/Character_Generator/0_Premade_Characters/48x48/Premade_Character_48x48_19.png");
// getSheet("ui", "4_User_Interface_Elements/UI_48x48.png");
getSheet("floor", "1_Interiors/48x48/Room_Builder_subfiles_48x48/Room_Builder_Floors_48x48.png");

entities.push(
    new Character({
        x: SIZE * 4,
        y: SIZE * 4,
        text: ["Excuse me miss,", "do you have ID?"]
    })
);

function render() {
    if (document.hasFocus()) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.cursor = "default";

        // background
        context.fillStyle = "#404059";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // tiles
        tiles.forEach(function (tile) {
            context.drawImage(image[tile[0]], ...tile.slice(1));
        });

        entities.forEach(function (entity) {
            entity.render(context);
        });

        // cursor
        context.globalAlpha = 0.3;

        var is_draw_mode = keyboard.isPressed("CapsLock");
        if (is_draw_mode) {
            context.drawImage(
                image[spritesheet],
                coords.x * SIZE,
                coords.y * SIZE,
                mouse.size.x * SIZE,
                mouse.size.y * SIZE,
                ...mouse.getCursor()
            );
        }

        context.setLineDash(is_draw_mode ? [] : [SIZE / 3, SIZE / 3, SIZE / 3, 0]);
        context.strokeRect(...mouse.getCursor(0.5));
        context.globalAlpha = 1;

        mouse.onMove();

        image.character.animation.walk.render(context, {
            x: 4,
            y: 4
        });
    }

    frame += 1;

    requestAnimationFrame(render);
}

render();
