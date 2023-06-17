import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import userRoute from './routes/user.js'
import eventRoute from './routes/event.js'
const app = express()


// morgan middleware
app.use(morgan("tiny"))

// regular middlewares
app.use(express.json({ limit: '10mb' }));
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// cookies and file middlewares
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

app.get('/',(req,res)=>{
    res.status(200).json({
        message : "Upshot API"
    })
})



// routes middleware
app.use("/api/v1",userRoute)
app.use("/api/v1",eventRoute)

export default app
