import User from '../models/user.js'
import BigPromise from '../middlewares/bigPromise.js'
import CustomError from '../utils/customError.js'

import { cookieToken } from '../utils/cookieToken.js'
import * as dotenv from 'dotenv'
import crypto from 'crypto'
import { v2 as cloudinary } from 'cloudinary'
dotenv.config()
// import mailHelper from '../utils/emailHelper.js'


export const signUp = BigPromise(async(req,res,next)=>{
    const { name, email, password, photo,role } = req.body;

    const photoUrl = await cloudinary.uploader.upload(photo,{
        folder : "users",
        width : 150,
        crop : "scale",
    })

    
    if(!email || !name || !password || !role){
        return next(new CustomError('Name Email & Password are required fields', 400))
    }

    // const alreadyUserOrNot = await User.findOne({email})



    const user = await User.create({
        name,
        email,
        password,
        role,
        photo : {
            id : photoUrl.public_id,
            secure_url : photoUrl.secure_url
        }
    })

    cookieToken(res,user)

})


export const login = BigPromise(async(req,res,next)=>{
    const { email, password } = req.body;

    if(!email || !password) return next(new CustomError('Please Provide Email & Password', 400))

    const user = await User.findOne({email}).select('+password')

    if(!user) return next(new CustomError('You are not registered', 400))

    const isUserValidated = user.isValidatedPassword(password)

    
    if(!isUserValidated) return next(new CustomError('Invailed Password', 400))

    cookieToken(res,user)

})


export const logout = BigPromise(async(req,res,next)=>{
    res.cookie('token',null,{
        expires : new Date(Date.now()),
        httpOnly : true
    })

    res.status(200).json({success:true, message : "Logout Success"})
})


// manager can see only user data.
export const adminUpdateAnyUser = BigPromise(async(req,res,next)=>{

    const {name,email,photo,role} = req.body;

    const id = req.params.id
    if(!name || !email || !photo || !role) return next(new CustomError('Name, email o photo missing', 404))


    const updateUser = {name,email,photo,role}



    if(photo !==""){
        // if photo exist then destroy prev one from cloudinary and update it with new one
        const user = await User.findById(id)

        const imageId = user.photo.id

        await cloudinary.uploader.destroy(imageId)

        const photoUrl = await cloudinary.uploader.upload(photo,{
            folder : "users",
            width : 150,
            crop : "scale",
        })

        updateUser.photo = {
            id : photoUrl.public_id,
            secure_url : photoUrl.secure_url
        }
    }

    console.log({id,name,email,photo,role})


    const user = await User.findByIdAndUpdate(id, updateUser,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    });


    res.status(200).json({
        success : true,
        user
    })
})  



export const adminDeleteUser = BigPromise(async(req,res,next)=>{
    const {id} = req.params;

    const user = await User.findById(id);

    if(!user) return next(new CustomError("User Not Found", 400))

    const deletedUser = await User.findByIdAndDelete(id)

    res.status(200).json({success:true, message : "User Deleted Successfully", deletedUser})
})

export const adminGetOneUser = BigPromise(async(req,res,next)=>{
    const {id} = req.params;

    const user = await User.findById(id);

    if(!user) return next(new CustomError("User Not Found", 400))


    res.status(200).json({success:true, user})
})



export const getAllUsers = BigPromise(async(req,res,next)=>{

    const user = await User.find();

    res.status(200).json({success:true, user})
})



export const getLoggedInUserDetails = BigPromise(async(req,res,next)=>{
    const user = await User.findById(req.user.id)

    res.status(200).json({success:true, user})
})



export const updateUserDetails = BigPromise(async(req,res,next)=>{
    const userId = req.user.id
    const {name,email,photo} = req.body
    if(!name || !email || !photo) return next(new CustomError('Name, email o photo missing', 404))
    const updatedUserData = {name,email}

    if(photo !==""){

        const user = await User.findById(userId)

        const imageId = user.photo.id

        await cloudinary.uploader.destroy(imageId)

        const photoUrl = await cloudinary.uploader.upload(photo,{
            folder : "users",
            width : 150,
            crop : "scale",
        })

        updatedUserData.photo = {
            id : photoUrl.public_id,
            secure_url : photoUrl.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(userId, updatedUserData,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    });


    res.status(200).json({success:true, user})
})



export const organizerAllUsers = BigPromise(async(req,res,next)=>{
    const users = await User.find({role : "student"})

    res.status(200).json({
        success : true,
        users : users
    })
})