"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("../modules/shedule/controller"));
const routes = express_1.Router();
routes.get('/shedules', controller_1.default.getAll);
exports.default = routes;
//# sourceMappingURL=routes.js.map