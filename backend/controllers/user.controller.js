import User from "../models/user.model.js"
import { StatusCode, ResponseMessage } from "../helpers/httpStatus.js";


export const getuserprofile = async (req, res) => {
    const {username} = req.params

    try {
        const user = await User.findOne({username}).select('-password');
        res.status(StatusCode.OK).json({
            message: ResponseMessage.Success,
            data: user
        })
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}

export const followUnfollowuser = async (req, res) => {
    
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentuser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(StatusCode.BAD_REQUEST).json({
                message: ResponseMessage.cantFollowYourself
            })
        }

        if (!userToModify || !currentuser) {
            return res.status(StatusCode.NOT_FOUND).json({
                message: ResponseMessage.UserNotFound
            })
        }

        const isFollowing = currentuser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(id, {
                $pull: { follower: req.user._id }
            })
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: id }
            })
            res.status(StatusCode.OK).json({
                message: ResponseMessage.Success
            })
        } else {
            await User.findByIdAndUpdate(id, {
                $push: { follower: req.user._id }
            })
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id }
            })
            res.status(StatusCode.OK).json({
                message: ResponseMessage.Success
            })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}