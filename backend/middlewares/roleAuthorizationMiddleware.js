import AppError from "../utils/AppError.js"


export const roleAuthorizationMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes((req.user.role))){
            next(new AppError("You dont have permission to do this operation", 403));
        }
        next();
    }
}