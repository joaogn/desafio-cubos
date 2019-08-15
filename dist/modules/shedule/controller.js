"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandlers_1 = __importDefault(require("../../api/responseHandlers"));
const service_1 = __importDefault(require("./service"));
class SheduleController {
    getAll(req, res) {
        service_1.default.getAll()
            .then(value => responseHandlers_1.default.onSucess(res, value))
            .catch(err => responseHandlers_1.default.onError(res, err));
    }
}
exports.default = new SheduleController();
//# sourceMappingURL=controller.js.map