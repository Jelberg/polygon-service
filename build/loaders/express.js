"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("../routes"));
var enviroments_1 = require("../enviroments");
exports.app = (0, express_1.default)();
exports.app.listen(enviroments_1.env.port, function () {
    console.log("My port: " + enviroments_1.env.port);
});
(0, routes_1.default)(exports.app);
//# sourceMappingURL=express.js.map