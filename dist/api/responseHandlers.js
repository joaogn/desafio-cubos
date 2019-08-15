"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Handlers {
    onError(res, err) {
        console.log(`${err}`);
        res.status(400).send(`${err}`);
    }
    onSucess(res, data) {
        res.status(200).json(data);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorHandlerApi(err, req, res, next) {
        console.error(`API error handler execute: ${err}`);
        res.status(500).send('Internal Server Error');
    }
}
exports.default = new Handlers();
//# sourceMappingURL=responseHandlers.js.map