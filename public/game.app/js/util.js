function inShadow(context, callback) {
    context.shadowBlur = 3;
    context.shadowOffsetY = 3;
    context.shadowColor = "#00000088";

    callback();

    context.shadowBlur = 0;
}

function toGrid(x_or_y) {
    return Math.floor(x_or_y / SIZE) * SIZE;
}
