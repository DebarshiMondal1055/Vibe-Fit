import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    bio:{
        type:String,
        default:""
    },
    avatar:{
        type:String,
        default:""
    },
    location:{
        type:String,
        default:""
    },
    humor:[
        {
            type:String,
            enum:["Absurd",
                    "Dark",
                    "Irony",
                    "Deprecating",
                    "Nostalgic",
                    "Social",
                    "Fast-Paced", 
                    "Ephemeral",
                    "Punny",
                    "Deadpan",
                    "Twisted",
                    "Cynical",
                    "Cringe",
                    "Chaotic",
                    "Culture",
                    "Gentle"]
        }
    ],
    isOnBoarded:{
        type:Boolean,
        default:false
    },

    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    refreshToken:{
        type:String
    },


},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id: this.id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema);        // should be exported after all the middlewares have been defined and applied