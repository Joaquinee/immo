import jwt from 'jsonwebtoken';
import other from '../config/other.json';

/*
* Generate a token
* @param {string} userId
* @return {string} token
*/
export const generateToken = (userId: string, payload: any = {}): string => {
    return jwt.sign({ ...payload, userId }, other.jwt_scret, { expiresIn: '360d' });
}

/*
* Verify a token
* @param {string} token
* @return {string} userId
* @throws {Error} if an error occurs
* @returns {string} userId
* @description Verify a token
*/
export const verifyToken = async (token: string): Promise<any> => {
    try {
        const decoded = jwt.verify(token, other.jwt_scret);
        return decoded;
    } catch (error) {
        console.error('Error verifying token:', error);
        throw error;
    }
    
}
