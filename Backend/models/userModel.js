import  mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
    type:String,
    required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    gender:{
        type:String,
        required:true,
    },
})


export default mongoose.model("User",userSchema);