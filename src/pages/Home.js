import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "@/Redux/reducers";
import { useRouter } from "next/router";
import { current } from "@reduxjs/toolkit";
import EmojiPicker from "emoji-picker-react";
import LoadingBar from 'react-top-loading-bar';


export const getServerSideProps = async ({req}) => {
  const hostname=req.headers.host
  console.log("inside serversideprops"+hostname)
  const data = await fetch(`https://${hostname}/api/getUsers`);
  const jsondata = await data.json();
  return {
    props: {
      jsondata
    },
  };
};

const Home = ({ jsondata }) => {
  const data = useSelector((state) => state.states.online);
  const value=useSelector((state)=>state.states.value)
  const showdata=useSelector((state)=>state.states.showData)
  const currentUser=useSelector((state)=>state.states.currentUser)
  const otherUser=useSelector((state)=>state.states.otherUser)
  const chatdata=useSelector((state)=>state.states.chats)
  const [datachanged,setdatachanged]=useState(false);
  const logout=useSelector((state)=>state.states.logout)
  const progress=useSelector((state)=>state.states.progress)
  const chatcontainer=useRef()

  const dispatch = useDispatch();
  const [socket,setSocket]=useState(null);
  const [picker,setPicker]=useState(false);

  const router=useRouter();
  useEffect(() => {
    const tempsocket = io(undefined, {
      path: "/api/hello",

    }); // Connect to the Socket.IO server
    setSocket(tempsocket);

  }, []);
  useEffect(()=>{
    if(socket){
    socket.on("connect", () => {

    });
    if(currentUser)
    {   
      socket.emit("add-user",currentUser)
    }

    // return () => {
    //   socket.disconnect();
    // };
  }
  },[socket,currentUser]);
  useEffect(()=>{
    console.log("socket value"+socket);
    if(socket){
    socket.on("receive", (msg) => {
      const receivemessage={

        text:msg.text,
        users:[msg.from,msg.to],
        sender:msg.from
      }
      const updatedarray=[...chatdata,receivemessage]

      dispatch(actions.setChat(updatedarray))
      // setdatachanged(!datachanged)
    
    });
  }
  },[chatdata])

  const checkUser=async()=>{
    dispatch(actions.setProgress(30))
    const data=await fetch('/api/getCookie');
    const cookiedata=await data.json();
    dispatch(actions.setProgress(60))
    if(cookiedata.currentUser)
    {
      dispatch(actions.setProgress(100))
      dispatch(actions.setCurrentUser(cookiedata));
      dispatch(actions.setShowData())
      dispatch(actions.setLogout(false))
      dispatch(actions.setOtherUser(null));

    }
    else{
      dispatch(actions.setProgress(100))
      router.push('/');
    }
  }
  useEffect(()=>{
    checkUser();
  },[logout]);

  const fetchMessages = async () => {
    if (otherUser) {
      const ids = {
        from: currentUser.id,
        to: otherUser._id
      };
  
      const chat = await fetch("/api/getMessage", {
        method: 'POST',
        body: JSON.stringify(ids),
        headers: {
          'Content-type': 'application/json'
        }
      });
  
      const betweenchat = await chat.json();

      dispatch(actions.setChat(betweenchat));
  
    
    }
  };
  
  useEffect(()=>{

    fetchMessages();
  },[otherUser])

  useEffect(() => {
    if (chatcontainer.current && chatcontainer.current.lastElementChild) {
      chatcontainer.current.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatdata, otherUser]);
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    document.getElementById('messageinput').value=''
    dispatch(actions.setValue(null))
    try {
        const toPass={
          text:value,
          from:currentUser.id,
          to:otherUser._id
        }
      await fetch('/api/sendMessage',{
       body:JSON.stringify(toPass),
       method:'POST',
        headers:{
          'Content-Type': 'application/json'
        }
      });

      if(socket)  { 
      socket.emit("input-change",toPass) }
      else
      console.log('not sent')
    } catch (error) {
      console.log(error);
    }
    const sendmessage={
      users:[currentUser.id,otherUser._id],
      text:value,
      sender:currentUser.id
    }
    const updatedarray=[...chatdata]
    updatedarray.push(sendmessage)
    dispatch(actions.setChat(updatedarray))
    // setdatachanged(!datachanged)
     

  };
  const handleChange = (e) => {
    dispatch(actions.setValue(e.target.value))

  };
  const handleSelect=(selectedUser)=>{
      dispatch(actions.setProgress(30))
      dispatch(actions.setProgress(50))
      dispatch(actions.setProgress(70))

      dispatch(actions.setOtherUser(selectedUser))  

       dispatch(actions.setProgress(100))
  } 
  const handleLogout=async()=>{
    socket.disconnect();
    const response=await fetch('/api/deleteCookie');
    const value=await response.json();
    const obj={
      currentUser:null
    }
    dispatch(actions.setLogout(true));
    alert(value.success);
  }
  const showPicker=()=>{
    setPicker(!picker)
  }
  const handleEmoji=(emojiObject,event)=>{
    document.getElementById('messageinput').value+=emojiObject.emoji
    
    if(value)
    dispatch(actions.setValue(value+emojiObject.emoji));
    else
    dispatch(actions.setValue(emojiObject.emoji))
  }
  return (
    <>
 <LoadingBar
        height={4}
        color='#cf7d18df'
        progress={progress}
        onLoaderFinished={()=>dispatch(actions.setProgress(0))}
        />
  {showdata && <div className="container mt-2 ">
      <div className="d-flex">
      <div className="mb-1 ">
      <img src="hifi.png"  height={30}></img>     
      </div> 
      <div className="mb-1 ms-auto " >
      <img src={currentUser.avatar_url} className="mb-2 me-2" height={28}></img>
        <span style={{color:'#6bc7d3',fontWeight:550,fontSize:'2rem'}} className="me-2 ">{currentUser.username}</span>

      </div>
      </div>
      <div className=" container  position-relative " >
        <div className="row" style={{height:'90vh'}}>
          <div className="col-4">
          <div className=" userContainer ">
            {jsondata.map((users) => {          
           return users.username !== currentUser.username && ( <div onClick={()=>{handleSelect(users)}} className="box d-flex pt-3 ps-3 text-dark " key={users.id}>
               <div>
                <img
                  src={users.avatar_url}
                  alt=""
                  className="rounded-circle me-3"
                  id="image"
                  style={{ height: "4rem" }}
                ></img>
                </div>
                <div className="" style={{textAlign:'left'}}>
               <span className=" "  > {users.username}</span>
              </div>
              </div>)
              })}
          </div>

          </div>
       {otherUser ? ( <div className="col-8 position-relative bg-dark">
             
            <div >
             <div className="container  ms-1 pt-2 d-flex align-items-center">
              <div className="">
              <img src={otherUser.avatar_url} className="rounded-circle" style={{height:'3rem'}}></img>
              <span className="text-white ms-2" style={{fontWeight:700,fontSize:12}}>{otherUser.username}</span>
              </div>  
                <div className="ms-auto me-1" style={{textAlign:'right',cursor:'pointer'}} onClick={handleLogout}>
                  <span className="me-3 text-white"style={{fontWeight:700,fontSize:12}} >Logout</span>
                  <img src='exit.png' height={19}></img>
                </div> 
              </div>
            </div>
          <div className=" chatContainer " ref={chatcontainer}>
          {chatdata.map((chats) => (
  chats.sender === `${currentUser.id}` ? (
    <div className=" col-5 ms-auto  mt-5 " key={chats._id} style={{textAlign:'right'}}>
      <div className="  text-white chat-message chat-message-right " style={{borderRadius:'2rem 0rem 2rem 2rem',textAlign:'left'}}>
      <span > {chats.text}</span>
      </div>
    </div>
  ) : (
    <div className="me-auto col-4  mt-5" key={chats._id}>
      <div className=" text-white chat-message chat-message-left" style={{borderRadius:'0rem 2rem 2rem 2rem'}}>
        {chats.text}
      </div>
    </div>
  )
))}
  </div>
          <div className="" >
           <div >
            <form className="  position-absolute bottom-0 d-flex align-items-center  container" onSubmit={handleSubmit} >
              <div className=" ">
                <span className="emoji-picker-container" >
                {picker && <EmojiPicker previewConfig={null} searchDisabled searchPlaceHolder="" height="40rem" width="20rem"  theme="dark" onEmojiClick={handleEmoji} ></EmojiPicker>}
                </span>
              <button type="button" className="btn" onClick={showPicker}><img src="cool.png" style={{height:'3rem',width:'3rem'}}></img></button>
              </div>
              <div className="container ms-auto me-auto">
            <input type="text " id="messageinput" className="rounded-pill form-control textbar " onChange={handleChange} placeholder="Message..."></input>
            </div>
            <div className="ms-auto   " style={{textAlign:'right'}}>
            <input type="submit" className="btn sender" value="" style={{width:'3rem',height:'3rem'}}  ></input>
            </div>
            </form>
          </div>
          </div>
          </div>):(
          <div className="bg-dark col-8" >
          <div
    style={{
      paddingBottom: "50%",
      position: "relative",

    }}
  >
    <iframe
      src="https://giphy.com/embed/iigp4VDyf5dCLRlGkm"
      width="100%"
      height='100%'
      style={{ position: "absolute"}}
      frameBorder={0}
      className="giphy-embed"
      allowFullScreen=""
      
    />
    
  </div>

            <div className="text-white text-center" style={{fontSize:'2rem',fontWeight:'700',fontFamily:'sans-serif'}}>
              <div className="container">
              Ready to connect? Pick a chat buddy!
              </div>
            </div>

          </div>)}
        </div>
      </div>
    </div>}
    </>
  );
};
export default Home
