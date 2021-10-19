class Mouse {
    constructor(view) {
        this.coords = new Vector(0, 0);
        this.view = view;
        this.mouseover = [];
        this.is_down = false;
        this.target = game.entities[0];

        // listeners
        this.view.canvas.addEventListener(
            "mousemove",
            function (event) {
                this.onMove(event);
            }.bind(this)
        );

        this.view.canvas.addEventListener(
            "mousedown",
            function () {
                this.onMouseDown();
            }.bind(this)
        );

        this.view.canvas.addEventListener(
            "mouseup",
            function () {
                this.onMouseUp();
            }.bind(this)
        );
    }

    onMove(event) {
        this.coords.x = event.clientX;
        this.coords.y = event.clientY;
        this.cursor = Digraph.fromPoint(this.coords);

        game.entities.reverse().forEach(
            function (element) {
                if (typeof element.complex === "object") {
                    let index = this.mouseover.indexOf(element);

                    if (Object.values(element.complex).slice(-1)[0].isTouching(this.cursor)) {
                        // touching
                        if (typeof element.onMouseOver === "function" && index === -1) {
                            element.onMouseOver();
                            this.mouseover.push(element);
                        }
                    } else {
                        // not touching
                        if (index !== -1 && typeof element.onMouseOut === "function") {
                            element.onMouseOut();
                            this.mouseover.splice(index, 1)[0];
                        }
                    }
                }
            }.bind(this)
        );
    }

    onMouseDown() {
        this.is_down = this.coords;
    }

    onMouseUp() {
        if (this.coords.x === this.is_down.x && this.coords.y === this.is_down.y) {
            this.onClick();
        }

        this.is_down = false;
    }

    onClick() {
        if (
            !this.mouseover.some(function (element) {
                if (typeof element.onClick === "function") {
                    return element.onClick() === false;
                }

                return false;
            })
        ) {
            this.target.destination.push(this.coords.clone());
        }
    }
}

let mouse = new Mouse(view);
