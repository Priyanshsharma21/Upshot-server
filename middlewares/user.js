import User from '../models/user.js'
import BigPromise from './bigPromise.js'
import CustomError from '../utils/customError.js'
import jwt from 'jsonwebtoken'



export const isLoggedIn = BigPromise(async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization.split(" ")[1] || req.header("Authorization")?.replace("Bearer ", " ") 
    // const token = req.headers.authorization.split(" ")[1];
    console.log(token)

    
    if(!token) return next(new CustomError("Login first to access this page", 401))

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)


    const thisIsThatUser = await User.findById(decoded.id)

    // injucting new field(user) in req
    req.user = thisIsThatUser

    next()
})



// we are sending the string but to use array methods we are converting it to array
export const customRole = (...role)=>{

    return (req,res,next)=>{
        if(!role.includes(req.user.role)) return next(new CustomError("Not allowed to access this route", 401))
        next()
    }

}

export const eventCustomRole =  (roles) => {
    
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new CustomError("Not allowed to access this route", 401));
      }
      next();
    };

};