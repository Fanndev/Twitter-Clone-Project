import User from "../models/user.model.js"
import { StatusCode, ResponseMessage } from "../helpers/httpStatus.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";


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
                message: ResponseMessage.unfollowed
            })
        } else {
            await User.findByIdAndUpdate(id, {
                $push: { follower: req.user._id }
            })
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id }
            })
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })
            await newNotification.save();

        res.status(StatusCode.OK).json({
            message: ResponseMessage.followed
        })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message
        });
    }
}


export const getsuggestedUser = async(req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select("following");

        const user = await User.aggregate([
        {
            $match: {
                _id: { $ne: userId },
            }
        },
        {
           $sample: {size:10}
        }
    ])

    const filteredUsers = user.filter((user) => !usersFollowedByMe.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null))

    res.status(StatusCode.OK).json({
        message: ResponseMessage.Success,
        data: suggestedUsers
    })
    } catch (error) {
        console.log(error.message);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

export const updateUser = async(req, res) => {

    const {fullname, username, email, currentPassword, newPassword, bio, link} = req.body;
        let { profileimg, coverimg } = req.body;

        const userId = req.user._id;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCode.NOT_FOUND).json({
                message: ResponseMessage.UserNotFound
            })
        }

        if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(StatusCode.BAD_REQUEST).json({
                message: ResponseMessage.PasswordRequired
            })
        }
        
        if(currentPassword && newPassword) {
            const IsMatch = await bcrypt.compare(currentPassword, user.password);
            if (!IsMatch) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    message: ResponseMessage.Wrongpass
                })
            }
            if (newPassword.length < 8) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    message: ResponseMessage.PasswordLength
                })
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if(profileimg) {
            if(user.profileimg) {
                await cloudinary.uploader.destroy(user.profileimg.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileimg)
            profileimg = uploadedResponse.secure_url;
        }
        if(coverimg) {
            const uploadedResponse = await cloudinary.uploader.upload(coverimg)
            coverimg = uploadedResponse.secure_url;
        }

        user.fullname = fullname || user.fullname;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileimg = profileimg || user.profileimg;
        user.coverimg = coverimg || user.coverimg;

        user = await user.save()
        
        res.status(StatusCode.OK).json({
            message: ResponseMessage.Success,
            data: user
        })
    } catch (error) {
        console.log(error.message);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}