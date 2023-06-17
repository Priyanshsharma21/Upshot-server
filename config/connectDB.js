import mongoose from 'mongoose'

const connectDB = async(url)=>{
    try {
        mongoose.set("strictQuery", true)
        mongoose.connect(url,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        }).then(()=>console.log("Connected to database")).catch((err)=>console.log("Failed to connect to database"))
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


export default connectDB