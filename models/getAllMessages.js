import mongoose, { Schema, mongo } from "mongoose";
let Model;
  function getAllMessages(){
   const schema=new mongoose.Schema({
    users:[{type:Schema.Types.ObjectId}],
    text:String,
    sender:Schema.Types.ObjectId
   })
   let Model;
   try{
    Model=mongoose.model('messages')
   }
   catch(e)
   {
    Model=new mongoose.model('messages',schema)
   }
return Model;

}
export default getAllMessages;