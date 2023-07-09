import DBConnect from "../../../DBConnect";
import getUsersController from "../../../controllers/getUsersController";

export default function getUsers(req,res){
    DBConnect();
    getUsersController(req,res);
}