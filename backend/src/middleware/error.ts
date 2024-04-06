import { NextFunction, Request, Response } from "express";



/*
*MiddleError il vas permttre de gerer les erreurs et d'envoyez mes erreurs au front
*
*/
export async function MiddlewareError(err: any, req: Request, res: Response, next: NextFunction): Promise<any> {
    console.log("Middleware Error Handling");
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}