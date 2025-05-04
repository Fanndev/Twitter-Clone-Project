import { ResponseMessage, StatusCode } from "../helpers/httpStatus.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(StatusCode.NOT_FOUND).json({
                message: ResponseMessage.UserNotFound
            });
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(StatusCode.UNAUTHORIZED).json({
                message: ResponseMessage.Wrongpass
            });
        }

        generateTokenAndSetCookie(res, user._id);

        return res.status(StatusCode.OK).json({
            message: ResponseMessage.LoginSuccess,
            user
        });

    } catch (error) {
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};

export const register = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        
        if (!emailRegex.test(email)) {
            return res.status(StatusCode.BAD_REQUEST).json({
                message: ResponseMessage.InvalidEmail,
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(StatusCode.CONFLICT).json({
                message: ResponseMessage.UsernameAlreadyExist
            });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(StatusCode.CONFLICT).json({
                message: ResponseMessage.EmailAlreadyExist
            });
        }

        if (password.length < 8) {
            return res.status(StatusCode.BAD_REQUEST).json({
                message: ResponseMessage.PasswordLength
            });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword
        });

        if (newUser) {
            generateTokenAndSetCookie(res, newUser._id);
            await newUser.save();

            return res.status(StatusCode.CREATED).json({
                message: ResponseMessage.SuksesRegistered,
                data: newUser
            });
        } else {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                message: ResponseMessage.FailRegistered
            });
        }
        
    } catch (error) {
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            stackL : error.stack
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(StatusCode.OK).json({
            message: ResponseMessage.Success
        });
    } catch (error) {
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
};