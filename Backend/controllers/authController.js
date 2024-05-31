import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import cookie from 'cookie'
import { generateToken } from "./adminController.js"

export const signup =  async(req,res)=>{
    try {
        const {email,username,password,confirmPassword,gender} = req.body

        console.log(req.body);

        if(!email || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({message:"Please enter valid details"})
        }
        
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        } 

        if(password !==confirmPassword){
            return res.status(400).json({message:"Password doesn't match"})
        }

        const user = await User.findOne({email:email})
        if(user){
            return res.status(400).json({message:'User already exist'})
        }

        const salt = await bcrypt.genSalt(10)
        
        const hashPassword = await bcrypt.hash(password,salt)
        

        const newUser = new User({
            email,
            username,
            password:hashPassword,
            gender, 
        })

      await newUser.save()
      res.status(200).json({success:true,message:"User sucessfully created"})

    }

 catch (error) {

        console.log(error.message);
        res.status(500).json({error:"Internal server Error"})


        
    }
}

export const login = async(req,res)=>{
    try {

        const{email,password} = req.body

        if(!email,!password){
            return res.status(400).json({message:"Please enter the email & password"})

        }

        const user = await User.findOne({email:email})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        const isPasswordCorrect = await bcrypt.compare(password,user?.password)

        if(!isPasswordCorrect){
            return res.status(400).json({status:false,message:"Password mismatch"});
        }

       

       const token =  generateToken(user)
       const {...rest} = user._doc
       const userId = user._id
       console.log(rest);
       

       res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 15, 
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    }));
       
        res.status(200).json({
           success:true,message:'Successfully login',token,data:{...rest},userId
        })

        
    } catch (error) {

        console.log(error.message);
        res.status(500).json({error:"Internal server Error"})

        
    }
}


export const logout = (req,res)=>{
   try {
    res.setHeader('Set-Cookie', cookie.serialize('jwt', '', {
        httpOnly: true,
        maxAge: 0,
        sameSite: 'strict'
    }));
    res.status(200).json({message:"Logged out sucessfully"});
   } catch (error) {
    console.log("Error in logout",error.message);
    res.status(500).json({error:"Internal server Error"})
   }
}