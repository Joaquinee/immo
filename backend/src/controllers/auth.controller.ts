
import { NextFunction, Request, Response } from "express";
import { Auth } from "../models/auth.model"
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/token";


/**
 * Register a new user.
 * @route POST /api/auth/register
 * @group Auth - Operations about authentication
 * @param {string} email.body.required - email of the user
 * @param {string} password.body.required - password of the user
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */

exports.Authregister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.body !== 'object' || req.body === null) {
            return res.status(400).json({ error: 'Le corps de la requête est vide ou invalide'});
        }
        if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
            return res.status(400).json({ error: 'Les champs doivent être des chaines de caractères'});
        }

        const hashedPassword = await hashPassword(req.body.password);
        const userData = new Auth({ email: req.body.email, password: hashedPassword }); 
        const clt = await Auth.getCollection();
        const exist = await clt.findOne({
            email: userData.email
        });
        if (exist) {
            return res.status(400).json({ message: 'Ce compte existe deja' });
        }
        const result = await clt.insertOne(userData);
        if (result) {
            return res.status(200).json({ message: 'Compte crée' });
        } else {
            return res.status(500).json({ error: 'Erreur lors de la création du compte'});
        }
    } catch (error) {
        next(error);      
    }
}
/**
 * Login a user.
 * @route POST /api/auth/login
 * @group Auth - Operations about authentication
 * @param {string} email.body.required - email of the user
 * @param {string} password.body.required - password of the user
 * @returns {object} 200 - A successful response
 * @returns {Error}  default - Unexpected error
 */
exports.Authlogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clt = await Auth.getCollection();
        const data = new Auth({ email: req.body.email, password: req.body.password }); 
        clt.findOne({
            email: data.email
        }).then(async (user) => {
            if (!user) {
                return res.status(400).json({ error: 'Utilisateur non trouvé' });
            }
            let equals = await comparePassword(data.password, user.password);
            if(!equals){
                return res.status(400).json({ error: 'Les informations saisie sont incorrect' });
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