import { MongoClient, Db } from 'mongodb';
import Cfg from '../config/db.json'
import { Book } from './book.model';
import { Auth } from './auth.model';
import chalk from 'chalk';


class MongoDB {
    private static client: MongoClient;
    public static db: Db;
    private static bookModel: Book;
    private static AuthModel: Auth;

    static async createMongoDB(): Promise<void> {
        try {
            const uri = `mongodb+srv://${Cfg.userDatabase}:${Cfg.passwordDatabase}@${Cfg.adressDatabase}/?retryWrites=true&w=majority&appName=${Cfg.nameDatabase}`;
            MongoDB.client = new MongoClient(uri);
            await MongoDB.client.connect();
            MongoDB.db = MongoDB.client.db(Cfg.nameDatabase);


            console.log(chalk.green('[OK] Connexion à MongoDB réussie'));
        } catch (error) {
            console.error(chalk.red('[ERROR] Connexion à MongoDB échouée'));
            throw error;
        }
    }
    static disconnect(): void {
        MongoDB.client.close();
        console.log(chalk.green('[OK] Déconnexion de MongoDB réussie'));
    }
    static getDatabase(): Db {
        return MongoDB.db;
    }
  
}

export default MongoDB;
