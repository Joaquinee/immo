import { Collection } from "mongodb";
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
   


}