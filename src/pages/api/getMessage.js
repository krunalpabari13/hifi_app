import DBConnect from "../../../DBConnect";
import getMessageController from "../../../controllers/getMessageController";

export default function getMessage(req,res)
{
    DBConnect();
    getMessageController(req,res);
}