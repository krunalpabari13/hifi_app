import DBConnect from "../DBConnect";
import getAllMessages from "../models/getAllMessages";

export default function sendMessageController(req,res){
   
 const model=   getAllMessages();   
 const {text,from,to}=req.body;
 try{
 new model({
    users:[from,to],
    text:text,
    sender:from
 }).save();
 res.status(200).json({success:"data entered successfuly"});
}
catch(error)
{
    res.status(500).json({error:'some internal error'})
}

}