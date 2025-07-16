import mongoose from 'mongoose';

export const mongoConnect = async () =>{
    try{
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
    }catch(e){
        console.error("MongoDB connection error ",e);
    }
}