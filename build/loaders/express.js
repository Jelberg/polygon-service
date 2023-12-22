"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("../routes"));
exports.app = (0, express_1.default)();
var port = 3000;
exports.app.listen(port, function () {
    console.log("My port: " + port);
});
(0, routes_1.default)(exports.app);
//# sourceMappingURL=express.js.map