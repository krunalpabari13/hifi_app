import mongoose from "mongoose";
export default function DBConnect(){
    try{
    const db=mongoose.connect("mongodb+srv://krunal:krunal%40%40%40123@chatapp.dxfszo8.mongodb.net/hifi");
    }
    catch(error)
    {
        console.log("error in mongodb connection");
    }
}