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
exports.getQuoteInfoByTicker = exports.getInfoCompanyByTicker = exports.getWatchlistInfo = void 0;
var axios_1 = __importDefault(require("axios"));
var watchlist_1 = require("../data/watchlist");
var enviroments_1 = require("../enviroments");
var apiKey = enviroments_1.env_polygon.key;
var polygonApiUrl = 'https://api.polygon.io';
// Constants for error messages
var ERROR_MESSAGES = {
    EMPTY_DATA: 'The WL array is empty.',
    UNDEFINED_RESULTS: 'Polygon returned undefined results',
    NOT_ENOUGH_DATA: 'Not enough data to calculate the variation.',
    EXCEEDED_REQUEST_LIMIT: 'You have exceeded the maximum number of requests per minute.',
    GENERAL_ERROR: 'An error occurred.',
};
/**
 * Function that retrieves information from the watchlist
 */
function getWatchlistInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var date, formatDate_1, response_1, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Check if watchlist is empty
                    if (watchlist_1.wl.length === 0) {
                        console.error('Data is Empty.');
                        throw new Error(ERROR_MESSAGES.EMPTY_DATA);
                    }
                    date = new Date();
                    date.setDate(date.getDate() - 1);
                    formatDate_1 = date.toISOString().split('T')[0];
                    response_1 = [];
                    // Use Promise.all to concurrently fetch information for each element in the watchlist
                    return [4 /*yield*/, Promise.all(watchlist_1.wl.map(function (element) { return __awaiter(_this, void 0, void 0, function () {
                            var endpoint, quote, results, first, last, variation, value, fluctuation, signal, summary, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        endpoint = "/v2/aggs/ticker/".concat(element.ticket.toUpperCase(), "/range/1/minute/").concat(formatDate_1, "/").concat(formatDate_1, "?adjusted=true&sort=desc&limit=2&apiKey=").concat(apiKey);
                                        return [4 /*yield*/, axios_1.default.get(polygonApiUrl + endpoint)];
                                    case 1:
                                        quote = _a.sent();
                                        results = quote.data;
                                        // Check if the results are undefined
                                        if (!results) {
                                            throw new Error(ERROR_MESSAGES.UNDEFINED_RESULTS);
                                        }
                                        // Check if there are enough data points to calculate the variation
                                        if (results.length >= 2) {
                                            first = results[0];
                                            last = results[results.length - 1];
                                            variation = last.c - first.c;
                                            value = first.c.toFixed(2);
                                            fluctuation = (variation / first.c) * 100;
                                            signal = variation >= 0 ? '+' : '-';
                                            summary = "".concat(variation.toFixed(2), "$ (").concat(fluctuation.toFixed(2), "%)");
                                            response_1.push({
                                                company: watchlist_1.wl.filter(function (t) { return t.ticket.toUpperCase() === element.ticket.toUpperCase(); }),
                                                quote: quote.data,
                                                signal: signal,
                                                value: value,
                                                summary: summary,
                                            });
                                            console.log(response_1);
                                        }
                                        else {
                                            // If there is not enough data, throw a new error with a specific message
                                            throw new Error(ERROR_MESSAGES.NOT_ENOUGH_DATA);
                                        }
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_2 = _a.sent();
                                        console.error('Error in the request:', error_2.message);
                                        // Re-throw the error to be caught in the outer catch block
                                        throw error_2;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    // Use Promise.all to concurrently fetch information for each element in the watchlist
                    _a.sent();
                    return [2 /*return*/, response_1];
                case 2:
                    error_1 = _a.sent();
                    // Handle the specific error here before calling the handleErrors function
                    console.log(error_1);
                    return [2 /*return*/, handleErrors(error_1)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getWatchlistInfo = getWatchlistInfo;
/**
 * Utility function to handle errors consistently
 * @param {Error} error
 * @returns {Object} - Object containing status and message
 */
function handleErrors(error) {
    var errorMessage = getErrorMessage(error);
    var status = getErrorStatus(error);
    throw { status: status, message: errorMessage };
}
/**
 * Get the error message based on the exception
 * @param {Error} error
 * @returns {string}
 */
function getErrorMessage(error) {
    switch (error.message) {
        case ERROR_MESSAGES.NOT_ENOUGH_DATA:
            return ERROR_MESSAGES.NOT_ENOUGH_DATA;
        // Add more cases as needed
        default:
            return ERROR_MESSAGES.GENERAL_ERROR;
    }
}
/**
 * Get the status code based on the exception
 * @param {Error} error
 * @returns {number}
 */
function getErrorStatus(error) {
    switch (error.message) {
        case ERROR_MESSAGES.NOT_ENOUGH_DATA:
            return 400;
        case ERROR_MESSAGES.EXCEEDED_REQUEST_LIMIT:
            return 429;
        case ERROR_MESSAGES.UNDEFINED_RESULTS:
            return 400;
        case ERROR_MESSAGES.EMPTY_DATA:
            return 400;
        default:
            return 500; // Internal Server Error
    }
}
/**
 * Function to wait for a period of time
 * @param {number} ms - milliseconds to wait
 * @returns {Promise<void>}
 */
function wait(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
/**
 * Gets information about the company based on the ticket
 * @param {string} ticker
 * @returns {Promise<any>}
 */
function getInfoCompanyByTicker(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var endpoint, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    endpoint = "/v1/meta/symbols/".concat(ticker.toUpperCase(), "/company?apiKey=").concat(apiKey);
                    return [4 /*yield*/, axios_1.default.get(polygonApiUrl + endpoint)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 2:
                    error_3 = _a.sent();
                    handleErrors(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getInfoCompanyByTicker = getInfoCompanyByTicker;
/**
 * Gets the value difference of a ticket per minute for the previous day
 * @param {string} ticker
 * @returns {Promise<any>}
 */
function getQuoteInfoByTicker(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var date, formatDate, endpoint, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    date = new Date();
                    date.setDate(date.getDate() - 1);
                    formatDate = date.toISOString().split('T')[0];
                    endpoint = "/v2/aggs/ticker/".concat(ticker.toUpperCase(), "/range/1/minute/").concat(formatDate, "/").concat(formatDate, "?adjusted=true&sort=desc&limit=").concat(enviroments_1.env_polygon.limit, "&apiKey=").concat(apiKey);
                    return [4 /*yield*/, axios_1.default.get(polygonApiUrl + endpoint)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 2:
                    error_4 = _a.sent();
                    handleErrors(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getQuoteInfoByTicker = getQuoteInfoByTicker;
//# sourceMappingURL=apiService.js.map