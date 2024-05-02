import { Collection, ObjectId } from "mongodb";
import MongoDB from "./db.model";

export class Book {

    userId: string;
    title: string;
    author: string;
    imageUrl: string;
    year: number;
    genre: string;
    ratings: {
        userId: String;
        grade: number;
    }[];
    averageRating: number;

    constructor(data: Partial<Book>) {
        Object.assign(this, data);
    }

    static async getCollection(): Promise<Collection<Book>> {
   
        // Récupération de la collection
        const collection: Collection<Book> = MongoDB.db.collection('Book');
        return collection;
    }
   
    static async getImageUrl(bookId: string): Promise<string> {
        const clt = await Book.getCollection();
        const book = await clt.findOne({ _id: new ObjectId(bookId) });
        return book.imageUrl;
    }
    
    static async validateBook(data: Partial<Book>): Promise<any> {

        const errors = [];
        if (!data.title) {
            errors.push('Le titre est obligatoire');
        }
        if (!data.author) {
            errors.push('L\'auteur est obligatoire');
        }
        if (!data.genre) {
            errors.push('Le genre est obligatoire');
        }
        if (!data.imageUrl) {
            errors.push('L\'image est obligatoire');
        }
        if (!data.year) {
            errors.push('L\'année est obligatoire');
        }
        if (isNaN(data.year)) {
            errors.push('L\'année doit être un nombre');
        }
        if (data.year < 1200 || data.year > new Date().getFullYear()) {
            errors.push('L\'année doit être comprise entre 1200 et ' + new Date().getFullYear());
        }
        if (errors.length > 0) {
            return errors;
        }
        return [];
    }


}