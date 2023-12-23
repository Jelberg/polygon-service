"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var getWatchlistController_1 = require("../../controllers/getWatchlistController");
var getInfoCompanyByTickerController_1 = require("../../controllers/getInfoCompanyByTickerController");
var getQuoteByTickerController_1 = require("../../controllers/getQuoteByTickerController");
var router = express_1.default.Router();
router.get("/", function (req, res) {
    res.send("It's OK!");
});
router.get("/stock", getWatchlistController_1.getWatchlistController.bind(getWatchlistController_1.getWatchlistController));
router.get('/stock/:ticker/company', getInfoCompanyByTickerController_1.getInfoCompanyByTickerController.bind(getInfoCompanyByTickerController_1.getInfoCompanyByTickerController));
router.get('/stock/:ticker', getQuoteByTickerController_1.getQuoteTickerController.bind(getQuoteByTickerController_1.getQuoteTickerController));
exports.default = router;
//# sourceMappingURL=polygonRouter.js.map