
import { NextFunction, Request, Response } from "express";
import { Auth } from "../models/auth.model"
import MongoDB from "../models/db.model";
import bcrypt from 'bcrypt';
import { comparePassword, hashPassword } from "../utils/hash";
import { eq } from "cheerio/lib/api/traversing";
import { generateToken } from "../utils/token";
import c from "config";
import { logger } from "../utils/logger";


/*
* @params {Request} req
* @params {Response} res
* @params {NextFunction} next
* @returns {Promise<void>}
* @throws {Error}
* @description Création d'un utilisateur
*/
exports.Authregister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.body !== 'object' || req.body === null) {
            return next(new Error('Le corps de la requête est vide ou invalide'));
        }
        if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
            return res.status(400).json({ message: 'Les champs email et password sont requis' });
        }

        const hashedPassword = await hashPassword(req.body.password);
        const userData = new Auth({ email: req.body.email, password: hashedPassword }); 
        const clt = await Auth.getCollection();
        const exist = await clt.findOne({
            email: userData.email
        });
        if (exist) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        const result = await clt.insertOne(userData);
        if (result) {
            logger.info(`Nouveau compte : ${userData.email}`)
            return res.status(200).json({ message: 'Compte crée' });
        } else {
            return res.status(500).json({ message: 'Erreur lors de la création du compte' });
        }
    } catch (error) {
        next(error);      
    }
}
/*
* @params {Request} req
* @params {Response} res
* @params {NextFunction} next
* @returns {Promise<void>}
* @throws {Error}
* @description Authentification d'un utilisateur
*/
exports.Authlogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clt = await Auth.getCollection();
        const data = new Auth({ email: req.body.email, password: req.body.password }); 
        clt.findOne({
            email: data.email
        }).then(async (user) => {
            if (!user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }
            let equals = await comparePassword(data.password, user.password);
            if(!equals){
                return res.status(401).json({ message: 'Mot de passe incorrect' });
            }
            const token = generateToken(user._id.toString());
            return res.status(200).json({
                userId: user._id,
                token: token
            });
        })
    } catch (error) {
        next(error);
    }
}