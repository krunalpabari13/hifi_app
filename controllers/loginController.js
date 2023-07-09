import registerModel from "../models/registerModel";
import bycrpt from 'bcrypt'
import { serialize } from "cookie";
import jwt from 'jsonwebtoken'
import DBConnect from "../DBConnect";
export default async function loginController(req,res)
{     
    const model=    registerModel();
    const {username,password}=req.body;
   const response= await model.find({username:username});

   if(response.length==1){
    bycrpt.compare(password,response[0].password,async(err,done)=>{

        if(done){
                const currentUser={
                    id:response[0]._id.toString(),
                    username:response[0].username,
                    avatar_url:response[0].avatar_url
                }
                const token=await jwt.sign(currentUser,"mychatapplication");
                const hostname=req.headers.host;
                
                console.log("inside logincontroller"+hostname)
                const cookieSearialize=serialize('jwt',token,{
                    httpOnly:true,
                    secure:true,
                    maxAge:86400,
                    domain:hostname,
                    path:'/'
                })
                res.setHeader('Set-Cookie',cookieSearialize)
            res.status(200).json({success:'Logged In'});}
       else if(err){

            res.status(500).json({error:'Internal Server Error'})
            }
        else{
            res.status(400).json({error:'Username or Password invalid'});
        }
        })
    }
    else{
        res.status(400).json({error:'Username or Password invalid'});
    }

}