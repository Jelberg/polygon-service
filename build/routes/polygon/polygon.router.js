"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var watchlist_1 = require("../../data/watchlist");
var enviroments_1 = require("../../enviroments");
var router = express_1.default.Router();
var apiKey = enviroments_1.env_polygon.key;
router.get("/", function (req, res) {
    res.send("It's OK!");
});
router.get('/stock', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, currentDate, formatDate_1, value_1, variation_1, summary_1, signal_1, response_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(watchlist_1.wl.length);
                if (watchlist_1.wl.length === 0) {
                    console.error('El arreglo está vacío. No se realizarán solicitudes.');
                    return [2 /*return*/, res.status(400).json({ error: 'El arreglo está vacío.' })];
                }
                date = new Date();
                currentDate = new Date();
                date.setDate(currentDate.getDate() - 1);
                formatDate_1 = date.toISOString().split('T')[0];
                value_1 = 0;
                variation_1 = 0;
                summary_1 = '';
                signal_1 = '';
                response_1 = [];
                // Utilizar Promise.all para esperar a que todas las promesas se resuelvan
                return [4 /*yield*/, Promise.all(watchlist_1.wl.map(function (element) { return __awaiter(void 0, void 0, void 0, function () {
                        var quote, results, first, last, fluctuation, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    quote = void 0;
                                    return [4 /*yield*/, axios_1.default.get("https://api.polygon.io/v2/aggs/ticker/".concat(element.ticket.toUpperCase(), "/range/1/minute/").concat(formatDate_1, "/").concat(formatDate_1, "?adjusted=true&sort=desc&limit=2&apiKey=").concat(apiKey))];
                                case 1:
                                    quote = _a.sent();
                                    results = quote.data.results;
                                    if (results.length >= 2) {
                                        first = results[0];
                                        last = results[results.length - 1];
                                        variation_1 = last.c - first.c;
                                        value_1 = first.c.toFixed(2);
                                        fluctuation = (variation_1 / first.c) * 100;
                                        variation_1 >= 0 ? (signal_1 = '+') : (signal_1 = '-');
                                        summary_1 = "".concat(variation_1.toFixed(2), "$ (").concat(fluctuation.toFixed(2), "%)");
                                    }
                                    else {
                                        console.error('No hay suficientes datos para calcular la variación.');
                                    }
                                    response_1.push({
                                        company: watchlist_1.wl.filter(function (t) { return t.ticket.toUpperCase() === element.ticket.toUpperCase(); }),
                                        quote: quote.data,
                                        signal: signal_1,
                                        value: value_1,
                                        summary: summary_1,
                                    });
                                    return [4 /*yield*/, wait(20000)];
                                case 2:
                                    _a.sent(); // 20000 milisegundos
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    console.error('Error en la solicitud:', error_2.message);
                                    throw error_2; // Relanzar el error para que se maneje en el catch externo
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                // Utilizar Promise.all para esperar a que todas las promesas se resuelvan
                _a.sent();
                console.log(response_1);
                res.json(response_1);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                if (error_1.isAxiosError && error_1.response.status === 429) {
                    console.error('Error: Has excedido la cantidad máxima de solicitudes por minuto.');
                }
                else {
                    console.error('Error en la función principal:', error_1.message);
                    res.status(500).json({ error: 'Error to get data' });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Función para esperar un período de tiempo
function wait(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
// Endpoint para obtener detalles de una acción
router.get('/stock/:ticker/company', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticker, response_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ticker = req.params.ticker;
                return [4 /*yield*/, axios_1.default.get("https://api.polygon.io/v1/meta/symbols/".concat(ticker.toUpperCase(), "/company?apiKey=").concat(apiKey))];
            case 1:
                response_2 = _a.sent();
                res.json(response_2.data);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ error: 'Error al obtener detalles de la acción.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Endpoint para obtener cotizaciones en tiempo real
router.get('/stock/:ticker/quote', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticker, date, currentDate, formatDate, response_3, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                ticker = req.params.ticker;
                date = new Date();
                currentDate = new Date();
                date.setDate(currentDate.getDate() - 1);
                formatDate = date.toISOString().split('T')[0];
                console.log(formatDate);
                return [4 /*yield*/, axios_1.default.get("https://api.polygon.io/v2/aggs/ticker/".concat(ticker.toUpperCase(), "/range/1/minute/").concat(formatDate, "/").concat(formatDate, "?adjusted=true&sort=desc&limit=").concat(enviroments_1.env_polygon.limit, "&apiKey=").concat(apiKey))];
            case 1:
                response_3 = _a.sent();
                res.json(response_3.data);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                res.status(500).json({ error: 'Error al obtener cotizaciones en tiempo real.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/stock/:ticker', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticker, date, currentDate, formatDate, value, variation, summary, signal, quote, company, results, first, last, fluctuation, response_4, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                ticker = req.params.ticker;
                date = new Date();
                currentDate = new Date();
                date.setDate(currentDate.getDate() - 1);
                formatDate = date.toISOString().split('T')[0];
                value = 0;
                variation = 0;
                summary = '';
                signal = '';
                return [4 /*yield*/, axios_1.default.get("https://api.polygon.io/v2/aggs/ticker/".concat(ticker.toUpperCase(), "/range/1/minute/").concat(formatDate, "/").concat(formatDate, "?adjusted=true&sort=desc&limit=").concat(enviroments_1.env_polygon.limit, "&apiKey=").concat(apiKey))];
            case 1:
                quote = _a.sent();
                return [4 /*yield*/, axios_1.default.get("https://api.polygon.io/v1/meta/symbols/".concat(ticker.toUpperCase(), "/company?apiKey=").concat(apiKey))];
            case 2:
                company = _a.sent();
                results = quote.data.results;
                if (results.length >= 2) {
                    first = results[0];
                    last = results[results.length - 1];
                    // Calcular variación absoluta
                    variation = last.c - first.c;
                    value = first.c.toFixed(2);
                    fluctuation = (variation / first.c) * 100;
                    variation >= 0 ? signal = '+' : signal = '-';
                    console.log("Price: ".concat(first.c.toFixed(2)));
                    console.log("Variation: ".concat(variation.toFixed(2), " USD"));
                    console.log("Percent: ".concat(fluctuation.toFixed(2), "%"));
                    summary = "".concat(variation.toFixed(2), "$ (").concat(fluctuation.toFixed(2), "%)");
                }
                else {
                    console.error("No hay suficientes datos para calcular la variación.");
                }
                response_4 = {
                    company: company.data,
                    quote: quote.data,
                    signal: signal,
                    value: value,
                    summary: summary
                };
                res.json(response_4);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.log(error_5);
                res.status(500).json({ error: 'Error to get data' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=polygon.router.js.map