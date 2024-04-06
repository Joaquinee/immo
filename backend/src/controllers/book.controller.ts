import { NextFunction, Request, Response } from "express";
import { Book } from "../models/book.model";
import { json } from "body-parser";
import { formToJSON } from "axios";
import { ObjectId } from "mongodb";



/*
Initialise la note moyenne du livre à 0 et le rating
* fais les verifications si on a bien une image, une année en string un titre et un auteur et un genre
*/
exports.createBook = async (req: Request, res:  Response, next: NextFunction): Promise<any> => {
   const bookObject = JSON.parse(req.body.book);
   if (!req.file) {
       return res.status(400).json({message: 'Veuillez ajouter une image'});
    }
    if (typeof bookObject.year !== 'string' || typeof bookObject.title !== 'string' || typeof bookObject.author !== 'string' || typeof bookObject.genre !== 'string') {
        return res.status(400).json({message: 'Les champs doivent être des chaines de caractères et son olbigatoire'});
    }


   const book = new Book({
      ...bookObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
   
    });
    const clt = await Book.getCollection();
    const exist = await clt.findOne({ title: book.title, author: book.author });

    if (exist) {
        return res.status(400).json({message: 'Ce livre et deja publier'});
    }
    const result = await clt.insertOne(book);
    console.log(result);
    if (result) {
        return res.status(201).json({message: 'Livre crée avec succès'});
    } else {
        return res.status(500).json({message: 'Erreur lors de la création du livre'});
    }
   
}
exports.getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
   try {
       const clt = await Book.getCollection();
       const books = await clt.find().toArray();
       return res.status(200).json(books);
   } catch (error) {
       next(error);
   }
}
exports.getOneBook = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
   try {
      const clt = await Book.getCollection();
      const book = await clt.findOne({ _id: new ObjectId(req.params.id) });
      if (!book) {
         return res.status(404).json({ message: 'Livre non trouvé' });
      }
      return res.status(200).json(book);
   } catch (error) {
      next(error);
   }
}


exports.getBestRating = async (req: Request, res: Response, next: NextFunction): Promise<any> =>{
    
    try {
        const clt = await Book.getCollection();
        const books = await clt.find().sort({ averageRating: -1 }).limit(5).toArray();
        return res.status(200).json(books);
    } catch (error) {
        next(error);
    }
}
exports.deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const clt = await Book.getCollection();
        const book = await clt.findOne({ _id: new ObjectId(req.params.id) });
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        const result = await clt.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result) {
            return res.status(200).json({ message: 'Livre supprimé avec succès' });
        } else {
            return res.status(500).json({ message: 'Erreur lors de la suppression du livre' });
        }
    } catch (error) {
        next(error);
    }
}
exports.updateBook = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        let imageUrl = req.body.imageUrl;
        const bookObject = req.body;

        if (typeof bookObject.year !== 'string' || typeof bookObject.title !== 'string' || typeof bookObject.author !== 'string' || typeof bookObject.genre !== 'string') {
            return res.status(400).json({message: 'Les champs doivent être des chaines de caractères et son olbigatoire'});
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
        const result = await clt.updateOne({ _id: new ObjectId(req.params.id) }, { $set: book });
        if (result) {
            return res.status(200).json({ message: 'Livre modifié avec succès' });
        } else {
            return res.status(500).json({ message: 'Erreur lors de la modification du livre' });
        }
        
    } catch (error) {
        next(error);
    }
}
exports.addRating = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    try {
        const clt = await Book.getCollection();
        const book = await clt.findOne({ _id: new ObjectId(req.params.id) });
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        const userRating = book.ratings.find((rating) => rating.userId === req.body.userId);
        if (userRating) {
            return res.status(400).json({ message: 'Vous avez déjà voté pour ce livre' });
        }
        if (req.body.rating < 0 || req.body.rating > 5) {
            return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5' });
        }
        book.ratings.push({ userId: req.body.userId, grade: req.body.rating });
        const averageRating = (book.ratings.reduce((acc, rating) => acc + rating.grade, 0) / book.ratings.length).toFixed(1);
        const result = await clt.updateOne({ _id: new ObjectId(req.params.id) }, { $set: { ratings: book.ratings, averageRating: parseFloat(averageRating) } });
        if (result) {
            return res.status(200).json(book);
        } else {
            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement du vote' });
        }
    } catch (error) {
        next(error);
    }
    
}

