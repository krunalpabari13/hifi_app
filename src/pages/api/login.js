import DBConnect from "../../../DBConnect";
import loginController from "../../../controllers/loginController";

export default function loginHandler(req,res)
{   DBConnect();
    loginController(req,res);
}