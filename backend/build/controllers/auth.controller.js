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
Object.defineProperty(exports, "__esModule", { value: true });
var auth_model_1 = require("../models/auth.model");
var hash_1 = require("../utils/hash");
var token_1 = require("../utils/token");
/**
 * Register a new user.
 * @route POST /api/auth/register
 * @group Auth - Operations about authentication
 * @param {string} email.body.required - email of the user
 * @param {string} password.body.required - password of the user
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.Authregister = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, userData, clt, exist, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (typeof req.body !== 'object' || req.body === null) {
                    return [2 /*return*/, res.status(400).json({ error: 'Le corps de la requête est vide ou invalide' })];
                }
                if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
                    return [2 /*return*/, res.status(400).json({ error: 'Les champs doivent être des chaines de caractères' })];
                }
                return [4 /*yield*/, (0, hash_1.hashPassword)(req.body.password)];
            case 1:
                hashedPassword = _a.sent();
                userData = new auth_model_1.Auth({ email: req.body.email, password: hashedPassword });
                return [4 /*yield*/, auth_model_1.Auth.getCollection()];
            case 2:
                clt = _a.sent();
                return [4 /*yield*/, clt.findOne({
                        email: userData.email
                    })];
            case 3:
                exist = _a.sent();
                if (exist) {
                    return [2 /*return*/, res.status(400).json({ message: 'Cet email est déjà utilisé' })];
                }
                return [4 /*yield*/, clt.insertOne(userData)];
            case 4:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.status(200).json({ message: 'Compte crée' })];
                }
                else {
                    return [2 /*return*/, res.status(500).json({ error: 'Erreur lors de la création du compte' })];
                }
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
/**
 * Login a user.
 * @route POST /api/auth/login
 * @group Auth - Operations about authentication
 * @param {string} email.body.required - email of the user
 * @param {string} password.body.required - password of the user
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.Authlogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var clt, data_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, auth_model_1.Auth.getCollection()];
            case 1:
                clt = _a.sent();
                data_1 = new auth_model_1.Auth({ email: req.body.email, password: req.body.password });
                clt.findOne({
                    email: data_1.email
                }).then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                    var equals, token;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!user) {
                                    return [2 /*return*/, res.status(400).json({ error: 'Utilisateur non trouvé' })];
                                }
                                return [4 /*yield*/, (0, hash_1.comparePassword)(data_1.password, user.password)];
                            case 1:
                                equals = _a.sent();
                                if (!equals) {
                                    return [2 /*return*/, res.status(400).json({ error: 'Mot de passe incorrect' })];
                                }
                                token = (0, token_1.generateToken)(user._id.toString());
                                return [2 /*return*/, res.status(200).json({
                                        userId: user._id,
                                        token: token
                                    })];
                        }
                    });
                }); });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
