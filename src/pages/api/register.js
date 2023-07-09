import bycrpt from 'bcrypt'
import DBConnect from '../../../DBConnect';
import registerController from '../../../controllers/registerController';
export default function register(req,res){
    const {username,email,password}=req.body;
    DBConnect();
    registerController(req,res);
}