import { Router } from "express";
import { ProtectRoute } from "../middleware/protectRoute.js";
import { getuserprofile, followUnfollowuser } from "../controllers/user.controller.js";


const UserRoutes = Router();

    UserRoutes.get("/profile/:username", ProtectRoute, getuserprofile);
    UserRoutes.post("/follow/:id", ProtectRoute, followUnfollowuser);

export default UserRoutes