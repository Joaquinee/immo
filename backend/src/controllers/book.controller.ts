import { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";
import { ObjectId } from "mongodb";
import fs from "fs";
import { error } from "console";

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
exports.createBook = async (req: Request, res:  Response, next: NextFunction): Promise<any> => {
   const bookObject = JSON.parse(req.body.book);
   if (!req.file) {
       return res.status(400).json({error: 'Veuillez ajouter une image'});
    }
    if (typeof bookObject.year !== 'string' || typeof bookObject.title !== 'string' || typeof bookObject.author !== 'string' || typeof bookObject.genre !== 'string') {
        return res.status(400).json({error: 'Les champs doivent être des chaines de caractères et son olbigatoire'});
    }


   const book = new Book({
      ...bookObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
   
    });
    const clt = await Book.getCollection();
    const exist = await clt.findOne({ title: book.title, author: book.author });

    if (exist) {
        return res.status(400).json({error: 'Ce livre et deja publier'});
    }
    const result = await clt.insertOne(book);
    if (result) {
        return res.status(200).json({message: 'Livre crée avec succès'});
    } else {
        return res.status(500).json({error: 'Erreur lors de la création du livre'});
    }
   
}
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
exports.getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
   try {
       const clt = await Book.getCollection();
       const books = await clt.find().toArray();
       return res.status(200).json(books);
   } catch (error) {
       next(error);
   }
}
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
exports.getOneBook = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
   try {
      const clt = await Book.getCollection();
      const book = await clt.findOne({ _id: new ObjectId(req.params.bookId) });
      if (!book) {
         return res.status(404).json({ error: 'Livre non trouvé' });
      }
      return res.status(200).json(book);
   } catch (error) {
      next(error);
   }
}

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
exports.getBestRating = async (req: Request, res: Response, next: NextFunction): Promise<any> =>{
    try {
        const clt = await Book.getCollection();
        const books = await clt.find().sort({ averageRating: -1 }).limit(5).toArray();
        return res.status(200).json(books);
    } catch (error) {
        next(error);
    }
}
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
exports.deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const clt = await Book.getCollection();
        const book = await clt.findOne({ _id: new ObjectId(req.params.bookId) });
    
        if (!book) {
            return res.status(404).json({ error: new Error('Livre non trouvé') });
        }
        const deleteImage = book.imageUrl.split('/images/')[1];
        fs.unlink(`src/images/${deleteImage}`, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
            }
    
            try {
                const result = await clt.deleteOne({ _id: new ObjectId(req.params.bookId) });
                if (result.deletedCount > 0) {
                    return res.status(200).json({ message: 'Livre supprimé avec succès' });
                } else {
                    return res.status(500).json({ error: 'Erreur lors de la suppression du livre' });
                }
            } catch (error) {
                return res.status(500).json({ error: 'Erreur lors de la suppression du livre' });
            }
        });
    
    } catch (error) {
        next(error);
    }
}
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
exports.updateBook = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let imageUrl = req.body.imageUrl;
        const bookObject = req.body;

        if (typeof bookObject.year !== 'string' || typeof bookObject.title !== 'string' || typeof bookObject.author !== 'string' || typeof bookObject.genre !== 'string') {
            return res.status(400).json({error: 'Les champs doivent être des chaines de caractères et son olbigatoire'});
        }


        let book;
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            book = new Book({ 
                ...bookObject,
                imageUrl: imageUrl,
            });
            
        } else {
            book = new Book({
                ...bookObject
            });
        }
        const clt = await Book.getCollection();
        const result = await clt.updateOne({ _id: new ObjectId(req.params.bookId) }, { $set: book });
        if (result) {
            return res.status(200).json({ message: 'Livre modifié avec succès' });
        } else {
            return res.status(500).json({ error: 'Erreur lors de la modification du livre' });
        }
        
    } catch (error) {
        next(error);
    }
}
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
exports.addRating = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    try {
        const clt = await Book.getCollection();
        const book = await clt.findOne({ _id: new ObjectId(req.params.bookId) });
        if (!book) {
            return res.status(404).json({ error: 'Livre non trouvé' });
        }
        const userRating = book.ratings.find((rating) => rating.userId === req.body.userId);
        if (userRating) {
            return res.status(400).json({ error: 'Vous avez déjà voté pour ce livre' });
        }
        if (req.body.rating < 0 || req.body.rating > 5) {
            return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5' });
        }
        book.ratings.push({ userId: req.body.userId, grade: req.body.rating });
        const averageRating = (book.ratings.reduce((acc, rating) => acc + rating.grade, 0) / book.ratings.length).toFixed(1);
        const result = await clt.updateOne({ _id: new ObjectId(req.params.bookId) }, { $set: { ratings: book.ratings, averageRating: parseFloat(averageRating) } });
        if (result) {
            return res.status(200).json(book);
        } else {
            return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du vote' });
        }
    } catch (error) {
        next(error);
    }
    
}

