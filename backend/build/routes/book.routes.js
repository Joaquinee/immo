"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Auth_1 = require("../middleware/Auth");
var bookRouter = (0, express_1.Router)();
var bookController = require("../controllers/book.controller");
var upload = require('../middleware/Multer.middleware');
/**
* Retrieve all Books.
* @route GET /api/books
*/
bookRouter.get("/", bookController.getAllBooks);
/**
 * Retrieve the 5 best rated books.
 * @route GET /api/books/bestrating
 *
 */
bookRouter.get("/bestrating", bookController.getBestRating);
/**
* Create a new Book.
* @route POST /api/books
*/
bookRouter.post("/", Auth_1.MiddleWareAuth, upload.multerMiddleware, upload.rezizeImage, bookController.createBook);
/**
* Retrieve a single Book with bookId.
* @route GET /api/books/:bookId
* @param bookId - The ID of the book to retrieve.
*/
bookRouter.get("/:bookId", bookController.getOneBook);
/**
* Update a Book with bookId.
* @route PUT /api/books/:bookId
* @param bookId - The ID of the book to update.
*/
bookRouter.put("/:bookId", Auth_1.MiddleWareAuth, upload.multerMiddleware, upload.rezizeImage, bookController.updateBook);
/**
* Delete a Book with bookId.
* @route DELETE /api/books/:bookId
* @param bookId - The ID of the book to delete.
*/
bookRouter.delete("/:bookId", Auth_1.MiddleWareAuth, bookController.deleteBook);
/**
 * Add a review to a book.
 * @route POST /api/books/:bookId/review
 */
bookRouter.post("/:bookId/rating", Auth_1.MiddleWareAuth, bookController.addRating);
exports.default = bookRouter;
