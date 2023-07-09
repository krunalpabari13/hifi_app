import Link from 'next/link'
import React, { useEffect } from 'react'
import Login from './Login'
import { useRouter } from 'next/router'
import LoadingBar from 'react-top-loading-bar';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '@/Redux/reducers';
export default function Signup() {
    const router=useRouter();
    const dispatch=useDispatch();
    const progress=useSelector((state)=>state.states.progress)
    const checkUser=async()=>{
        dispatch(actions.setProgress(30))
        const data=await fetch('/api/getCookie');
        const jsondata= await data.json();
        dispatch(actions.setProgress(50))
        if(jsondata.currentUser)
        {           dispatch(actions.setProgress(100))
            router.push('/Home');
        }
        dispatch(actions.setProgress(100))
    }
    useEffect(()=>{
        checkUser();
    },[])
    const handleSubmit=async()=>{
        const username=document.getElementById('username').value;
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
        const confirmpassword=document.getElementById('confirmpassword').value;
        dispatch(actions.setProgress(30))
        if(password!=confirmpassword)
        {
            alert("Passwords must be matched");
            dispatch(actions.setProgress(100))
            return;
        }
        if(!username)
        {
            alert("please enter username");
            dispatch(actions.setProgress(100))
            return;
        }
        if(!email)
        {
            alert("Please enter email");
            dispatch(actions.setProgress(100))
            return ;

        }
        if(!password)
        {
            alert("please enter password");
            dispatch(actions.setProgress(100))
            return;

        }
        const avatar_url=(`https://api.multiavatar.com/${username}.png`)

        const data={
            username:username,
            email:email,
            password:password,
            avatar_url:avatar_url
        }
      const response=await  fetch('/api/register',{
            headers:{
                'Content-Type': 'application/json'
            },
            method:'POST',
            body:JSON.stringify(data),

        })
           const result=await response.json(); 
           dispatch(actions.setProgress(80))
        if(result.success){
            dispatch(actions.setProgress(100))
            alert("Signup Successful. Please Login Again...");
            router.push('/Login')

        }
        else{

            alert(`${result.error}`);
        }
        dispatch(actions.setProgress(100))
    }
  return (
    <>
    <LoadingBar
        height={4}
        color='#cf7d18df'
        progress={progress}
        onLoaderFinished={()=>dispatch(actions.setProgress(0))}
        />

    <div className='align-items-center justify-content-center d-flex ' style={{height:'100vh'}}>
       <div className="card " style={{width: '80rem'}}>
        <div className='d-flex container mt-5'>
            <div className=' container'  style={{fontWeight:700, fontSize:'2.4rem',textAlign:'center'}}>Create Account</div>
            <div className='ms-auto mt-3 container' style={{fontWeight:600, fontSize:'1.3rem',textAlign:'center'}}>Already have an account? <span className='text-primary'><Link href='/Login'>Sign In</Link></span></div>
        </div>
     
        <div className='row'>
            <div className='container col   mt-5 ms-2'>
            <input required type="text" id='username' style={{background:'#F7F8FA',color:'#8A8A8A',fontSize:'1.5rem',fontWeight:500 ,width:'32rem',height:'4.6rem'}}aria-label="First name" placeholder='Username' class="form-control container "/>
            <input required type="email" id='email' style={{background:'#F7F8FA',color:'#8A8A8A',fontSize:'1.5rem',fontWeight:500 ,width:'32rem',height:'4.6rem'}}aria-label="First name" placeholder='Email' class="form-control container "/>
            <input required type="password" id='password' style={{background:'#F7F8FA',color:'#8A8A8A',fontSize:'1.5rem',fontWeight:500 ,width:'32rem',height:'4.6rem'}}aria-label="First name" placeholder='Password' class="form-control container "/>
            <input required type="password" id='confirmpassword' style={{background:'#F7F8FA',color:'#8A8A8A',fontSize:'1.5rem',fontWeight:500 ,width:'32rem',height:'4.6rem'}}aria-label="First name" placeholder='Confirm Password' class="form-control container "/>
            
            <div className=' mt-5 mb-5 col container'>
                <button className='btn btn-primary rounded-pill btn-lg container' onClick={handleSubmit}>Create Account</button>
            </div>

            </div>
            
            <div className=' container col 'style={{textAlign:'center'}}>
                <img src='loginimg.png' className='img-fluid'></img>
                <div className='ms-5 ms-auto mb-5'  >By signing up, you agree to our Terms & conditions, Privacy policy{Signup}</div>
            </div>


           
        </div>
        
     </div>
     
    </div>
    </>
  )
}
