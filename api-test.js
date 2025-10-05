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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatGPTResponse = getChatGPTResponse;
var fs = require("fs");
function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
}
function getChatGPTResponse(config, question, imageUrl // optional: pass an image URL/base64
) {
    return __awaiter(this, void 0, void 0, function () {
        var controller, timeoutControler, OR_API_URL, content, response, _a, _b, _c, result, text;
        var _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    controller = new AbortController();
                    timeoutControler = setTimeout(function () { return controller.abort(); }, 20 * 1000);
                    OR_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
                    content = [{ type: "text", text: question }];
                    if (imageUrl) {
                        content.push({
                            type: "image_url",
                            image_url: { url: imageUrl }, // can be https://... or data:image/...;base64
                        });
                    }
                    return [4 /*yield*/, fetch(OR_API_URL, {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(config.apiKey),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                model: 'qwen/qwen2.5-vl-72b-instruct:free',
                                messages: [
                                    {
                                        role: 'user',
                                        content: content,
                                    },
                                ],
                                max_tokens: config.maxTokens || 200,
                            }),
                            signal: config.timeout ? controller.signal : null,
                        })];
                case 1:
                    response = _h.sent();
                    clearTimeout(timeoutControler);
                    if (!!response.ok) return [3 /*break*/, 3];
                    _a = Error.bind;
                    _c = (_b = "OpenRouter API error ".concat(response.status, ": ")).concat;
                    return [4 /*yield*/, response.text()];
                case 2: throw new (_a.apply(Error, [void 0, _c.apply(_b, [_h.sent()])]))();
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    result = _h.sent();
                    text = (_g = (_f = (_e = (_d = result.choices) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.message) === null || _f === void 0 ? void 0 : _f.content) !== null && _g !== void 0 ? _g : JSON.stringify(result);
                    return [2 /*return*/, {
                            question: question,
                            response: text,
                            normalizedResponse: normalizeText(text),
                        }];
            }
        });
    });
}
var imageBase64 = fs.readFileSync("images.jpeg", { encoding: "base64" });
var imageDataUrl = "data:image/png;base64,".concat(imageBase64);
// Example usage:
var config = { apiKey: "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" };
getChatGPTResponse(config, "What do you see in this picture?", imageDataUrl).then(function (ans) { return console.log(ans); });
