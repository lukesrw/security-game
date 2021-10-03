// constants
var SIZE = 48;

// functions
function toGrid(x_or_y) {
    return Math.floor(x_or_y / SIZE) * SIZE;
}

function getSheet(name, src) {
    image[name] = new Image();
    image[name].onload = function () {
        render(true);
    };
    image[name].src = "/assets/modern_interiors/" + src;
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

    that.onClick = function () {
        if (keyboard.isPressed("Shift")) {
            tiles.push([
                spritesheet,
                coords.x * SIZE,
                coords.y * SIZE,
                mouse.size.x * SIZE,
                mouse.size.y * SIZE,
                ...mouse.getCursor()
            ]);
        }
    };

    that.onMove = function () {
        if (that.down.is_pressed) {
            that.onClick();
        }
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
                    render();
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

                that.keys[event.key].is_pressed = event.type === "keydown";

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

function inShadow(context, callable) {
    context.shadowColor = "#000000AA";
    context.shadowBlur = SIZE / 2;

    callable();

    context.shadowBlur = 0;
}

function Character() {
    var that = this;

    that.text = [];

    that.renderBase = function (context, x, y) {
        /**
         * @todo generate using hair/eyes/body/etc.
         */
        inShadow(context, function () {
            context.drawImage(image.character, SIZE * 3, 0, SIZE, SIZE * 2, x, y, SIZE, SIZE * 2);
        });

        return image.character.complete;
    };

    that.render = function (context, init_x, init_y) {
        if (that.text.length) {
            if (typeof that.text === "string") that.text = [that.text];

            var longest = that.text[0];
            for (var i = 1; i < that.text.length; i += 1) {
                if (that.text[i].length > longest.length) {
                    longest = that.text[i];
                }
            }

            var font = context.measureText(longest);
            var width = font.width - 12;
            var corners = 33;

            font = (font.actualBoundingBoxAscent + font.actualBoundingBoxDescent) * 1.8;

            var height = (that.text.length - 1) * font;
            var x = init_x + SIZE / 4;
            var y = init_y - (SIZE / 4 + height);

            inShadow(context, function () {
                context.fillStyle = "#8E97C7";
                context.fillRect(x + 6, y + corners, width + corners, height + corners - 6);
            });

            that.renderBase(context, init_x, init_y);

            // top left
            context.drawImage(image.ui, 192, 0, corners, SIZE, x, y, corners, SIZE);
            y += SIZE;

            // left
            context.drawImage(image.ui, 192, SIZE, corners, 2, x, y, corners, height);
            y += height;

            // bottom left
            context.drawImage(image.ui, 192, 54, corners, 45, x, y, corners, 45);
            x += corners;

            // bottom
            context.drawImage(image.ui, 225, 54, 3, 45, x, y, width, 45);
            x += width;

            // bottom right
            context.drawImage(image.ui, 228, 54, 13, 45, x, y, 13, 45);
            y -= height;

            // right
            context.drawImage(image.ui, 228, SIZE, 13, 6, x, y, 13, height);
            y -= SIZE;

            // top right
            context.drawImage(image.ui, 228, 0, 13, SIZE, x, y, 13, SIZE);
            x -= width;

            // top
            context.drawImage(image.ui, 227, 0, 1, SIZE, x, y, width, SIZE);
            x -= 17.5;
            y += SIZE - 1;

            // middle
            context.fillStyle = "#EBE1F6";
            context.fillRect(x, y, width + 17.5, height + 1);

            // text
            context.fillStyle = "#000";
            that.text.forEach(function (line) {
                context.fillText(line, x, y);

                y += font;
            });
        } else {
            that.renderBase(context, init_x, init_y);
        }
    };
}

// globals
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

            render();
        }
    },
    ArrowRight: {
        keydown: function () {
            if (keyboard.isPressed("Shift")) {
                coords.x = Math.min(image[spritesheet].width / SIZE - 1, coords.x + 1);
            } else {
                mouse.size.x = Math.min(image[spritesheet].width / SIZE, mouse.size.x + 1);
            }

            render();
        }
    },
    ArrowUp: {
        keydown: function () {
            if (keyboard.isPressed("Shift")) {
                coords.y = Math.max(0, coords.y - 1);
            } else {
                mouse.size.y = Math.max(1, mouse.size.y - 1);
            }

            render();
        }
    },
    ArrowDown: {
        keydown: function () {
            if (keyboard.isPressed("Shift")) {
                coords.y = Math.min(image[spritesheet].height / SIZE - 1, coords.y + 1);
            } else {
                mouse.size.y = Math.min(image[spritesheet].height / SIZE, mouse.size.y + 1);
            }

            render();
        }
    }
});

// body setup
document.documentElement.style.height = "100%";
document.body.style.overflow = "hidden";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.addEventListener("focus", render);

// canvas setup
var canvas = document.querySelector("canvas");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
canvas.focus();

canvas.addEventListener("mousemove", mouse.onEvent);
canvas.addEventListener("mousedown", mouse.onEvent);
canvas.addEventListener("mouseup", mouse.onEvent);
canvas.addEventListener("wheel", mouse.onEvent);

canvas.addEventListener("keyup", keyboard.onEvent);
canvas.addEventListener("keydown", keyboard.onEvent);

// context setup
var context = canvas.getContext("2d");
context.font = "13px Courier New";
context.textAlign = "left";
context.textBaseline = "middle";
context.webkitImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

var image = {
    interiors: new Image(),
    character: new Image(),
    ui: new Image()
};

Object.keys(image).forEach(function (name) {
    image[name].onload = function () {
        render(true);
    };
});

getSheet("interiors", "1_Interiors/48x48/Theme_Sorter_48x48/18_Jail_48x48.png");
getSheet("character", "2_Characters/Character_Generator/0_Premade_Characters/48x48/Premade_Character_48x48_19.png");
getSheet("ui", "4_User_Interface_Elements/UI_48x48.png");
getSheet("floor", "1_Interiors/48x48/Room_Builder_subfiles_48x48/Room_Builder_Floors_48x48.png");

var character = new Character();

function render(is_force) {
    if (is_force || document.hasFocus()) {
        first_render = false;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // background
        context.fillStyle = "#404059";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // tiles
        tiles.forEach(function (tile) {
            context.drawImage(image[tile[0]], ...tile.slice(1));
        });

        // cursor
        context.globalAlpha = 0.3;

        var is_draw_mode = keyboard.isPressed("Shift");
        if (is_draw_mode) {
            context.drawImage(
                image[spritesheet],
                coords.x * SIZE,
                coords.y * SIZE,
                mouse.size.x * SIZE,
                mouse.size.y * SIZE,
                ...mouse.getCursor()
            );
        } else {
            context.strokeStyle = "#000";
            context.lineWidth = 1;
            context.setLineDash(is_draw_mode ? [] : [16, 16, 16, 0]);
            context.strokeRect(...mouse.getCursor(0.5));
        }

        context.globalAlpha = 1;

        character.text = ["Excuse me miss,", "do you have ID?"];
        character.render(context, 4 * SIZE, 4 * SIZE);
    }
}

setInterval(render, 1000);

render(true);
