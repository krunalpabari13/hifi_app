import DBConnect from "../../../DBConnect";
import getMessageController from "../../../controllers/getMessageController";
import sendMessageController from "../../../controllers/sendMessageController";

export default function sendMessage(req,res){
    DBConnect();
    sendMessageController(req,res);
}