import { Router } from "express";
import { ProtectRoute } from "../middleware/protectRoute.js";
import { getuserprofile, followUnfollowuser, getsuggestedUser, updateUser } from "../controllers/user.controller.js";


const UserRoutes = Router();

    UserRoutes.get("/profile/:username", ProtectRoute, getuserprofile);
    UserRoutes.post("/follow/:id", ProtectRoute, followUnfollowuser);
    UserRoutes.get("/suggested", ProtectRoute, getsuggestedUser);
    UserRoutes.post("/update", ProtectRoute, updateUser);

export default UserRoutes