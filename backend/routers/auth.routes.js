import { Router } from "express";
import { login, logout, register, getme } from "../controllers/auth.controller.js";
import { ProtectRoute } from "../middleware/protectRoute.js";
const AuthRoutes = Router();

    AuthRoutes.get("/me", ProtectRoute, getme);
    AuthRoutes.post("/register", register);
    AuthRoutes.post("/login", login);
    AuthRoutes.post("/logout", logout);

export default AuthRoutes