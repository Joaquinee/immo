
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token";



export async function MiddleWareAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            console.log('Vous n\'êtes pas connecté')
            return res.status(401).json({ message: 'Vous n\'êtes pas connecté' });
        }
        const token = bearerToken.split(' ')[1];
        console.log('token', token)
        const user = await verifyToken(token);
        if (!user) {
            return res.status(401).json({ message: 'Requête non authentifiée' });
        }
        if (req.body.userId && req.body.userId !== user.userId) {
            return res.status(401).json({ message: 'Utilisateur non valide' });
        } else {
            console.log('Vous êtes connecté')
            next();
        }
    } catch (error) {
        return res.status(401).json({ message: 'Requête non authentifiée' });
    }
}