import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    fullname : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        minLength : 8
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    follower : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }],
    following : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : []
    }],
    profileimg : {
        type : String,
        default : ""
    },
    coverimg : {
        type : String,
        default : ""
    },
    bio : {
        type : String,
        default : ""
    },
    link : {
        type : String,
        default : ""
    }

}, { timestamps : true })

const User = mongoose.model('User', UserSchema)
export default User