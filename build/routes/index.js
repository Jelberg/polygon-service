"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var polygon_router_1 = __importDefault(require("./polygon/polygon.router"));
function routerApi(app) {
    app.use('/api', polygon_router_1.default);
}
exports.default = routerApi;
//# sourceMappingURL=index.js.map