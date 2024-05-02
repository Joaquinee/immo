
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/token";




export async function MiddleWareAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            return res.status(401).json({ error: 'Vous n\'êtes pas connecté' });
        }
        const token = bearerToken.split(' ')[1];
        const user = await verifyToken(token);
        if (!user) {
            return res.status(401).json({ error: 'Requête non authentifiée'});
        }
        if (req.body.userId && req.body.userId !== user.userId) {
            return res.status(401).json({ error: 'Utilisateur non valide' });
        } else {
            next();
        }
    } catch (error) {
        return res.status(401).json({ error: 'Requête non authentifiée' });
    }
}