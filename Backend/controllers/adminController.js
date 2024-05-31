import Admin from '../models/adminModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import cookie from 'cookie'

dotenv.config()

export const generateToken = (user)=>{
    return jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:'15d',
    })
}

export const Adminregister = async(req,res)=>{
    const {email,password} = req.body

    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        let admin = new Admin({
            email,
            password:hashPassword,

        })
        await admin.save()

        console.log('admin',admin);

        res.status(200).json({success:true, message:'Admin successfully created'})
    } catch (error) {
        res.status(500).json({success:false, message:'Admin Internal server error Try again'})

    }
}

export const AdminLogin = async(req,res)=>{

    const {email} = req.body

    try {
        let user = null
        const admin = await Admin.findOne({email})

        if(admin){
            user = admin
        }

        if(!user){
            return res.status(404).json({message:'Admin not found'})
        }

        const isPasswordMatch =  await bcrypt.compare(req.body.password,user.password)

        if(!isPasswordMatch){
            return res.status(400).json({status:false,message:"Invalid credentials"});
        }

        if(isPasswordMatch === true){

            const token = generateToken(user)

            const{...rest} = user._doc

            res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 15, 
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            }));

            res.status(200).json({status: true, message:"Successfully login", token, data:{...rest}});
        }

    } catch (error) {

        console.log(error);
        res.status(500).json({status:false,message:'Failed to login'});

    }
}

export const Adminlogout = (req, res) => {
    try {
        res.setHeader('Set-Cookie', cookie.serialize('jwt', '', {
            httpOnly: true,
            maxAge: 0,
            sameSite: 'strict'
        }));
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout", error.message);
        res.status(500).json({error: "Internal server Error"});
    }
}

