function inShadow(context, callback) {
    context.shadowBlur = 3;
    context.shadowOffsetY = 3;
    context.shadowColor = "#00000088";

    callback();

    context.shadowBlur = 0;
}
