import DBConnect from "../DBConnect";
import getAllMessages from "../models/getAllMessages";
export default async function getMessageController(req,res)
{ 
    try{
      
        const {from, to}=req.body;

        const model=getAllMessages();
        const data= await  model.find({users:{$all:[from,to]}})
        res.status(200).json(data);
    }
        catch(err)
        {
            res.status(500).json({error:'internal server error'})
        }

}