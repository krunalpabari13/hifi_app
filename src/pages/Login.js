import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { headers } from '../../next.config';
import { useRouter } from 'next/router';
import LoadingBar from 'react-top-loading-bar';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '@/Redux/reducers';
export default  function Login() {
   const progress=useSelector((state)=>state.states.progress);
   const dispatch=useDispatch();
    const router =useRouter();
   const checkUser=async()=>{
    dispatch(actions.setProgress(30))
    const data=await fetch('/api/getCookie');
    const jsondata=await data.json();
    dispatch(actions.setProgress(50))
    if(jsondata.currentUser)
    {       dispatch(actions.setProgress(100))
        router.push('/Home')
       
    }
    dispatch(actions.setProgress(100))
   }
    useEffect(()=>{
        checkUser();
    },[])
    const handleSubmit=async()=>{
        const username=document.getElementById('username').value;
        const password=document.getElementById('password').value;
        dispatch(actions.setProgress(30))
        if(!username)
        {
            alert("Username required");
            return;
        }
        if(!password)
        {
            alert("Password required");
            return;
        }
        dispatch(actions.setProgress(40))
        const data={
            username:username,
            password:password
        }
      const response= await fetch('/api/login',{
            body:JSON.stringify(data),
            method:'POST',
            headers:{
                'Content-type':'application/json'
            }
        })
        const result=await response.json();
        dispatch(actions.setProgress(70))
    if(result.success)
    {           dispatch(actions.setProgress(100))    
        router.push('/Home');
    }
    else{
        alert(`${result.error}`);
    }
    dispatch(actions.setProgress(100))

    }
  return (<>
        <LoadingBar
        height={4}
        color='#cf7d18df'
        progress={progress}
        onLoaderFinished={()=>dispatch(actions.setProgress(0))}
        
        
        />
    <div className='  align-items-center justify-content-center d-flex' style={{height:'100vh'}}>
       <div class="card " style={{width: '80rem'}}>
        <div className='row container mt-5' style={{textAlign:'center'}}>
            <div className='col ' style={{fontWeight:700, fontSize:'2.4rem'}}>Sign In</div>
            <div className='col mt-3 ms-5 ' style={{fontWeight:600, fontSize:'1.3rem'}}>Don't Have an account yet? <span className='text-primary'><Link href='/Signup'>Create new for free</Link></span></div>
        </div>
     
        <div className='row'>
            <div className='col container mt-5 ms-2 ' style={{textAlign:'center'}}>
           
           <div className=''  style={{textAlign:'center'}}>
            <input required type="text" id='username' style={{background:'#F7F8FA',color:'#8A8A8A',fontSize:'1.5rem',fontWeight:500 ,width:'32rem',height:'4.6rem'}}aria-label="First name" placeholder='Username' class="form-control container"/>
            <input required type="password" id='password' style={{background:'#F7F8FA',color:'#8A8A8A',fontSize:'1.5rem',fontWeight:500 ,width:'32rem',height:'4.6rem'}}aria-label="First name" placeholder='Password' class="form-control container"/>
            </div>
            <div className='col mt-5'>
                <button className='btn btn-primary rounded-pill btn-lg container  ' onClick={handleSubmit}>Sign In</button>
            </div>
       
            </div>
            
            <div className='col container' style={{textAlign:'center'}}>
                <img src='loginimg.png' className='img-fluid'></img>
                <div className=' mb-5 '>By signing up, you agree to our Terms & conditions, Privacy policy</div>
            </div>


           
        </div>
        
     </div>
     
    </div>
    </>
  )
}
