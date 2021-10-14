const { Host } = require("module-core");
const { default: Http } = require("module-core/js/modules/http");
const { Socket } = require("module-core/js/modules/socket");
const { Logger } = require("module-core/js/modules/logger");

async function main() {
    let srv = new Host();

    let options = {
        root: __dirname,
    };

    srv.extensions
        .addExtension(Logger, options)
        .addExtension(Http, options)
        .addExtension(Socket, options);

    await srv.start();
}

main();
