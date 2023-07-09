import jwt from'jsonwebtoken'
export default async function getCookie(req,res)
{
    const cookie=req.headers.cookie;
  
    if(cookie){
        const token=cookie.trim().split('=')[1];
    await jwt.verify(token,"mychatapplication",(err,done)=>{
        if(done)
        {
            res.status(200).json({currentUser:done})
        }
        else if (done)
        {
            res.status(500).json({error:'some internal server error'})
        }


    })}
    else{

        res.status(200).json({message:'Please Register or Login'})
    }
    res.end();
}