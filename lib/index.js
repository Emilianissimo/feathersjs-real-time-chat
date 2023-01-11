"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const logger_1 = require("./logger");
const port = app_1.app.get('port');
const host = app_1.app.get('host');
app_1.app.listen(port).then(() => {
    logger_1.logger.info(`Feathers app listening on http://${host}:${port}`);
});
