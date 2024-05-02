import express, {urlencoded, json, Request, Response, NextFunction} from "express";
import cors from "cors";
import bookRouter from "./routes/book.routes";
import AuthRouter from "./routes/auth.routes";
import path from "path";

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', bookRouter)
app.use('/api/auth', AuthRouter)


export default app;