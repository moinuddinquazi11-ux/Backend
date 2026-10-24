import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
     lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    age:{
        type:Number,
        required: true
    },
    passWord:{
        type: String,
        required: true
    },
    profileImage:{
        type: String,
        required: false
    }
    
},{timestamps:true})

const userModel = mongoose.model("InstaUsers", userSchema)

export default userModel