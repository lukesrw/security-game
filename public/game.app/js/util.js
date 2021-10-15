function inShadow(context, callback) {
    context.shadowBlur = Character.SHADOW_SIZE;
    context.shadowOffsetY = 3;
    context.shadowColor = "#00000088";

    callback();

    context.shadowBlur = 0;
}
