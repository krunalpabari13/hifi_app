import mongoose from "mongoose";
export default function registerModel()
{
const registerSchema=    mongoose.Schema({
        username:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        avatar_url:String

    })
let registerModel;
try{
    registerModel=mongoose.model('registers');
}
catch(error)
{
    registerModel=new mongoose.model('registers',registerSchema);
}
return registerModel;
}