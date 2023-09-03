import React, { useState } from 'react'

import io from "socket.io-client";

const App = () => {
  const [messages, setMessages] = useState([])

  const socket = io.connect("http://localhost:4000");

  socket.on('id',(id)=>{
    console.log(id);
    socket.emit("sendid",id);
  })
  socket.on("data", async(data)=>{
    setMessages((pre)=>{
      return [...pre,data]
    });

    console.log(data)
    console.log(messages);
    socket.on('disconnected', function() {

  });
    
  })

  return (
    <div>{
      messages?.map((ce)=>(
        <h1>{ce.name}</h1>
      ))
      }</div>
  )
}

export default App