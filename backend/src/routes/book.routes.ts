import { Router } from "express";
import { MiddleWareAuth } from "../middleware/Auth";
import { multerMiddleware } from "../middleware/Multer.middleware";
const bookRouter = Router();
const bookController = require("../controllers/book.controller");

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
bookRouter.post("/", MiddleWareAuth, multerMiddleware ,bookController.createBook);
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
bookRouter.put("/:bookId", MiddleWareAuth, multerMiddleware ,bookController.updateBook);
/**
* Delete a Book with bookId.
* @route DELETE /api/books/:bookId
* @param bookId - The ID of the book to delete.
*/
bookRouter.delete("/:bookId",MiddleWareAuth, bookController.deleteBook);
/**
 * Add a review to a book.
 * @route POST /api/books/:bookId/review
 */
bookRouter.post("/:bookId/rating", MiddleWareAuth, bookController.addRating);


export default bookRouter;