"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController = require("../controllers/auth.controller");
var AuthRouter = (0, express_1.Router)();
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
exports.default = AuthRouter;
