
import bcrypt from 'bcrypt';
/*
* @params {string} password
* @returns {string} hashed password
*/
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

/*
* @params {string} password
* @params {string} hashed password
* @returns {boolean} true if password match, false otherwise
* @throws {Error} if an error occurs
*/
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}
