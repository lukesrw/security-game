// constants
var SIZE = 48;

// functions
function toGrid(x_or_y) {
    return Math.floor(x_or_y / SIZE) * SIZE;
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
                var is_scroll_down = event.deltaY > 0;
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

// globals
var tiles = [];
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
                coords.x = Math.min(spritesheets.interiors.width / SIZE - 1, coords.x + 1);
            } else {
                mouse.size.x = Math.min(spritesheets.interiors.width / SIZE, mouse.size.x + 1);
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
                coords.y = Math.min(spritesheets.interiors.height / SIZE - 1, coords.y + 1);
            } else {
                mouse.size.y = Math.min(spritesheets.interiors.height / SIZE, mouse.size.y + 1);
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

context.webkitImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

var spritesheets = {};
spritesheets.interiors = new Image();
spritesheets.interiors.src = "/assets/modern_interiors/1_Interiors/48x48/Theme_Sorter_48x48/18_Jail_48x48.png";

var first_render = true;

function render() {
    if (first_render || document.hasFocus()) {
        first_render = false;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // background
        context.fillStyle = "#404059";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // tiles
        tiles.forEach(function (tile) {
            context.drawImage(spritesheets.interiors, ...tile);
        });

        // cursor
        context.globalAlpha = 0.3;

        var is_draw_mode = keyboard.isPressed("Shift");
        if (is_draw_mode) {
            context.drawImage(
                spritesheets.interiors,
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
    }
}

setInterval(render, 1000);

render();
