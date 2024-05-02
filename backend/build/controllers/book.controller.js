"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var book_model_1 = require("../models/book.model");
var mongodb_1 = require("mongodb");
var fs_1 = __importDefault(require("fs"));
/**
 * Create a new book
 * @param req
 * @param res
 * @param next
 * @returns
 * @route POST /api/books
 * @group Books - Operations about books
 * @param {string} year.body.required - The year of the book
 * @param {string} title.body.required - The title of the book
 * @param {string} author.body.required - The author of the book
 * @param {string} genre.body.required - The genre of the book
 * @param {string} imageUrl.body.required - The image of the book
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.createBook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bookObject, book, clt, exist, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bookObject = JSON.parse(req.body.book);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: 'Veuillez ajouter une image' })];
                }
                if (typeof bookObject.year !== 'string' || typeof bookObject.title !== 'string' || typeof bookObject.author !== 'string' || typeof bookObject.genre !== 'string') {
                    return [2 /*return*/, res.status(400).json({ error: 'Les champs doivent être des chaines de caractères et son olbigatoire' })];
                }
                book = new book_model_1.Book(__assign(__assign({}, bookObject), { imageUrl: "".concat(req.protocol, "://").concat(req.get('host'), "/images/").concat(req.file.filename) }));
                return [4 /*yield*/, book_model_1.Book.getCollection()];
            case 1:
                clt = _a.sent();
                return [4 /*yield*/, clt.findOne({ title: book.title, author: book.author })];
            case 2:
                exist = _a.sent();
                if (exist) {
                    return [2 /*return*/, res.status(400).json({ error: 'Ce livre et deja publier' })];
                }
                return [4 /*yield*/, clt.insertOne(book)];
            case 3:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.status(200).json({ message: 'Livre crée avec succès' })];
                }
                else {
                    return [2 /*return*/, res.status(500).json({ error: 'Erreur lors de la création du livre' })];
                }
                return [2 /*return*/];
        }
    });
}); };
/**
 * Retrieve all books
 * @param req
 * @param res
 * @param next
 * @returns
 * @route GET /api/books
 * @group Books - Operations about books
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.getAllBooks = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var clt, books, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, book_model_1.Book.getCollection()];
            case 1:
                clt = _a.sent();
                return [4 /*yield*/, clt.find().toArray()];
            case 2:
                books = _a.sent();
                return [2 /*return*/, res.status(200).json(books)];
            case 3:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Retrieve a single book with bookId
 * @param req
 * @param res
 * @param next
 * @returns
 * @route GET /api/books/:bookId
 * @group Books - Operations about books
 * @param {string} bookId.path.required - The ID of the book to retrieve
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.getOneBook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var clt, book, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, book_model_1.Book.getCollection()];
            case 1:
                clt = _a.sent();
                return [4 /*yield*/, clt.findOne({ _id: new mongodb_1.ObjectId(req.params.bookId) })];
            case 2:
                book = _a.sent();
                if (!book) {
                    return [2 /*return*/, res.status(404).json({ error: 'Livre non trouvé' })];
                }
                return [2 /*return*/, res.status(200).json(book)];
            case 3:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Retrieve the 5 best rated books
 * @param req
 * @param res
 * @param next
 * @returns
 * @route GET /api/books/bestrating
 * @group Books - Operations about books
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.getBestRating = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var clt, books, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, book_model_1.Book.getCollection()];
            case 1:
                clt = _a.sent();
                return [4 /*yield*/, clt.find().sort({ averageRating: -1 }).limit(5).toArray()];
            case 2:
                books = _a.sent();
                return [2 /*return*/, res.status(200).json(books)];
            case 3:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Delete a book with bookId
 * @param req
 * @param res
 * @param next
 * @returns
 * @route DELETE /api/books/:bookId
 * @group Books - Operations about books
 * @param {string} bookId.path.required - The ID of the book to delete
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.deleteBook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var clt_1, book, deleteImage, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, book_model_1.Book.getCollection()];
            case 1:
                clt_1 = _a.sent();
                return [4 /*yield*/, clt_1.findOne({ _id: new mongodb_1.ObjectId(req.params.bookId) })];
            case 2:
                book = _a.sent();
                if (!book) {
                    return [2 /*return*/, res.status(404).json({ error: new Error('Livre non trouvé') })];
                }
                deleteImage = book.imageUrl.split('/images/')[1];
                fs_1.default.unlink("src/images/".concat(deleteImage), function (err) { return __awaiter(void 0, void 0, void 0, function () {
                    var result, error_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    return [2 /*return*/, res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' })];
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, clt_1.deleteOne({ _id: new mongodb_1.ObjectId(req.params.bookId) })];
                            case 2:
                                result = _a.sent();
                                if (result.deletedCount > 0) {
                                    return [2 /*return*/, res.status(200).json({ message: 'Livre supprimé avec succès' })];
                                }
                                else {
                                    return [2 /*return*/, res.status(500).json({ error: 'Erreur lors de la suppression du livre' })];
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                error_5 = _a.sent();
                                return [2 /*return*/, res.status(500).json({ error: 'Erreur lors de la suppression du livre' })];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                next(error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Update a book with bookId
 * @param req
 * @param res
 * @param next
 * @returns
 * @route PUT /api/books/:bookId
 * @group Books - Operations about books
 * @param {string} bookId.path.required - The ID of the book to update
 * @param {string} year.body.required - The year of the book
 * @param {string} title.body.required - The title of the book
 * @param {string} author.body.required - The author of the book
 * @param {string} genre.body.required - The genre of the book
 * @param {string} imageUrl.body.required - The image of the book
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.updateBook = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var imageUrl, bookObject, book, clt, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                imageUrl = req.body.imageUrl;
                bookObject = req.body;
                if (typeof bookObject.year !== 'string' || typeof bookObject.title !== 'string' || typeof bookObject.author !== 'string' || typeof bookObject.genre !== 'string') {
                    return [2 /*return*/, res.status(400).json({ error: 'Les champs doivent être des chaines de caractères et son olbigatoire' })];
                }
                book = void 0;
                if (req.file) {
                    imageUrl = "".concat(req.protocol, "://").concat(req.get('host'), "/images/").concat(req.file.filename);
                    book = new book_model_1.Book(__assign(__assign({}, bookObject), { imageUrl: imageUrl }));
                }
                else {
                    book = new book_model_1.Book(__assign({}, bookObject));
                }
                return [4 /*yield*/, book_model_1.Book.getCollection()];
            case 1:
                clt = _a.sent();
                return [4 /*yield*/, clt.updateOne({ _id: new mongodb_1.ObjectId(req.params.bookId) }, { $set: book })];
            case 2:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.status(200).json({ message: 'Livre modifié avec succès' })];
                }
                else {
                    return [2 /*return*/, res.status(500).json({ error: 'Erreur lors de la modification du livre' })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Add a review to a book
 * @param req
 * @param res
 * @param next
 * @returns
 * @route POST /api/books/:bookId/review
 * @group Books - Operations about books
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.addRating = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var clt, book, userRating, averageRating, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, book_model_1.Book.getCollection()];
            case 1:
                clt = _a.sent();
                return [4 /*yield*/, clt.findOne({ _id: new mongodb_1.ObjectId(req.params.bookId) })];
            case 2:
                book = _a.sent();
                if (!book) {
                    return [2 /*return*/, res.status(404).json({ error: 'Livre non trouvé' })];
                }
                userRating = book.ratings.find(function (rating) { return rating.userId === req.body.userId; });
                if (userRating) {
                    return [2 /*return*/, res.status(400).json({ error: 'Vous avez déjà voté pour ce livre' })];
                }
                if (req.body.rating < 0 || req.body.rating > 5) {
                    return [2 /*return*/, res.status(400).json({ error: 'La note doit être comprise entre 0 et 5' })];
                }
                book.ratings.push({ userId: req.body.userId, grade: req.body.rating });
                averageRating = (book.ratings.reduce(function (acc, rating) { return acc + rating.grade; }, 0) / book.ratings.length).toFixed(1);
                return [4 /*yield*/, clt.updateOne({ _id: new mongodb_1.ObjectId(req.params.bookId) }, { $set: { ratings: book.ratings, averageRating: parseFloat(averageRating) } })];
            case 3:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.status(200).json(book)];
                }
                else {
                    return [2 /*return*/, res.status(500).json({ error: 'Erreur lors de l\'enregistrement du vote' })];
                }
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
