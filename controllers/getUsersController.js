import DBConnect from "../DBConnect";
import registerModel from "../models/registerModel";

export default async function getUsersController(req,res){
    try{   
        const {username}=req.body;
        const model=    registerModel();
        const users=await model.find({});
        res.status(200).json(users);
}
    catch(err)
    {
        res.status(500).json({errro:'some internal server error'})
    }
}