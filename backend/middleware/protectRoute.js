import { StatusCode, ResponseMessage } from "../helpers/httpStatus.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const ProtectRoute = async(req, res, next) => {

    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(StatusCode.UNAUTHORIZED).json({
                message: ResponseMessage.Unauthorized
            });
        }
        const decode = jwt.verify(token, process.env.SECRET);
        if (!decode) {
            return res.status(StatusCode.UNAUTHORIZED).json({
                message: ResponseMessage.Unauthorized
            });
        }
        const user = await User.findById(decode.userId).select("-password");

        if (!user) {
            return res.status(StatusCode.NOT_FOUND).json({
                message: ResponseMessage.UserNotFound
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}