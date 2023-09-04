import React, { useEffect, useRef, useState } from 'react'
import "./App.css";

import io from "socket.io-client";
const third = "on";

const App = () => {
  const [messages, setMessages] = useState([])
  const mainRef = useRef(null);

    useEffect(()=>{
      //! Scroll to bottom ...
      mainRef.current?.scrollIntoView({ behavior: "smooth" })
    },[messages]);
  
  useEffect(()=> {
 
      //! Fetch Old data from DB...
      fetch("http://localhost:4000/api/v1/message/getmessages").then((data)=>{
         data.json().then((data)=>{
           setMessages(data?.data);
          //  console.log(data);

        })

      }).catch((err)=>{
        console.log(err);
      })
   


  }, [third])
  

  //! connect Socket....
  const socket = io.connect("http://localhost:4000");

  socket.on('id',(id)=>{
    // console.log(id);
    socket.emit("sendid",id);
  })
  socket.on("data", async(data)=>{
    setMessages((pre)=>{
      return [...pre,data]
    });

    // console.log(data)
    // console.log(messages);
    socket.on('disconnected', function() {

  });
    
  })

  return (
    <div className='container'>
      <div className="main" >

      {

      messages?.map((ce,n)=>(
        <div key={n} className="message">
          <h2>{ce.name}</h2>
          <div className="details">
            <div style={{display:"flex"}} className="origin">

            <span>From: </span>
            <h4>{ce.origin}</h4>

            </div>

            <div style={{display:"flex"}} className="destination">
            <span>To: </span>
            <h4>{ce.destination}</h4>

            </div>
          </div>

        </div>
      ))
      }
       <div ref={mainRef} />
      
      </div>
      </div>
  )
}

export default App