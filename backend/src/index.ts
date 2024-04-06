import express, {NextFunction, Request, Response}  from "express";
import cors from "cors";
import MongoDB from "./models/db.model";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
const port = 4000;
const app = express();
const auth = require('./controllers/auth.controller');
const book = require('./controllers/book.controller');

import { MiddleWareAuth } from "./middleware/Auth";
import { MiddlewareError } from "./middleware/error";


const ext: any = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/webp': 'webp'

};
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, 'src/images');
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('_');
        const filenameArray = filename.split('.');
        filenameArray.pop();
        const filenameWithoutExtension = filenameArray.join('.');
        const extension = ext[file.mimetype];
        cb(null, filenameWithoutExtension + '-' + Date.now() + '.' + extension);
    }
});
const upload = multer({ storage }).single('image');


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());


app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/images', express.static(path.join(__dirname, 'images')));


app.get('/api/books', book.getAllBooks);
app.get('/api/books/bestrating',book.getBestRating);
app.get('/api/books/:id', book.getOneBook);




app.post('/api/books/:id/rating', MiddleWareAuth, book.addRating);



app.post('/api/books', MiddleWareAuth, upload , book.createBook);
app.delete('/api/books/:id', MiddleWareAuth, book.deleteBook);
app.put('/api/books/:id', MiddleWareAuth, upload, book.updateBook);


app.post('/api/auth/signup', auth.Authregister);
app.post('/api/auth/login', auth.Authlogin);

app.use(MiddlewareError);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    MongoDB.createMongoDB();
});