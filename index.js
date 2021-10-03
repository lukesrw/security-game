const { Host } = require("module-core");
const { default: Http } = require("module-core/js/modules/http");
const { Socket } = require("module-core/js/modules/socket");
const { Logger } = require("module-core/js/modules/logger");

async function main() {
    let srv = new Host();

    let options = {
        root: __dirname,
    };

    await srv.add(Logger, options);

    await srv.add(Http, options);

    await srv.add(Socket, options);

    srv.start();
}

main();
