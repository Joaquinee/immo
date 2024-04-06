import { Collection, ObjectId } from "mongodb";
import MongoDB from "./db.model";


export class Auth {
    email: string;
    password: string;
    

    constructor(data: Partial<Auth>) {
        Object.assign(this, data);
    }
    

    static async getCollection(): Promise<Collection<Auth>> {
   
        // Récupération de la collection
        const collection: Collection<Auth> = MongoDB.db.collection('Auth');
        return collection;
    }
  


}