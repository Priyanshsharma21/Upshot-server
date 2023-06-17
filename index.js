import app from './app.js'
import connectDB from './config/connectDB.js'
import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
dotenv.config()

const {MONGODB_URL, PORT,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET} = process.env

cloudinary.config({
    cloud_name : CLOUDINARY_CLOUD_NAME,
    api_key : CLOUDINARY_API_KEY,
    api_secret : CLOUDINARY_API_SECRET,
})



const startServer = async()=>{
    try {
        connectDB(MONGODB_URL)
        app.listen(PORT,()=>{
            console.log(`Running up the hill at ${PORT}km/hr`)
        })
    } catch (error) {
        console.log(error)
    }
}
startServer()