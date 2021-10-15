// constants
var SIZE = 48;

function init() {
    /**
     * @todo add debounce
     */

    view.canvas.width = document.body.clientWidth;
    view.canvas.height = document.body.clientHeight;
}

// window setup
window.addEventListener("resize", init);

// body setup
document.documentElement.style.height = "100%";
document.body.style.overflow = "hidden";
document.body.style.height = "100%";
document.body.style.margin = "0";

// canvas setup
var view = new View(document.querySelector("canvas"));

init();
view.canvas.focus();

view.context.font = "13px Courier New";
view.context.textAlign = "left";
view.context.textBaseline = "middle";
view.context.strokeStyle = "#FFF";
