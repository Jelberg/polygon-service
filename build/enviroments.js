"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env_polygon = exports.env = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: process.env.PORT || 5555
};
exports.env_polygon = {
    key: process.env.POLYGON_KEY,
    limit: process.env.POLYGON_LIMIT_RESULTS || 10
};
//# sourceMappingURL=enviroments.js.map