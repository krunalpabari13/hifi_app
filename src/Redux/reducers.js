import {createSlice} from '@reduxjs/toolkit'
export const globalreducers=createSlice({
    name:"states",
    initialState:{
        online:false,
        allUsers:null,
        value:null,
        currentUser:null,
        showData:false,
        otherUser:null,
        chats:[],
        logout:false,
        progress:0

    },
    reducers:{
        makeonline:(state,payload)=>
        {   
            state.online=true;
            return state;
        },
        makeoffline:(state,payload)=>{
            state.online=false;
            return state;    
        },
        getAllUsers:(state,payload)=>{
            state.allUsers=payload.data;
            return state;
        },
        setValue:(state,payload)=>{
            
            state.value=payload.payload;
            return state;
        },
        setCurrentUser:(state,payload)=>
        {   
            state.currentUser=payload.payload.currentUser;  
            return state;
        },
        setShowData:(state,payload)=>{
            state.showData=true;
            return state;
        },
        setOtherUser:(state,payload)=>{

            state.otherUser=payload.payload;
            return state;
        },
        setChat:(state,payload)=>{

            state.chats=payload.payload;
            return state;
        },
        setLogout:(state,payload)=>{
            state.logout=payload.payload;
            return state;
        },
        setProgress:(state,payload)=>{
            state.progress=payload.payload;
            return state;
        }

    }
})
export const actions=globalreducers.actions;