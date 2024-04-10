import { Router } from "express";
const authController = require("../controllers/auth.controller");
const AuthRouter = Router();

/**
* Register a new user.
* @route POST /api/auth/register
*/
AuthRouter.post("/signup", authController.Authregister);
/**
* Login a user.
* @route POST /api/auth/login
*/
AuthRouter.post("/login", authController.Authlogin);


export default AuthRouter;