import React from 'react'
import {io} from 'socket.io-client';

// tạo đối tượng client cho FE
const socket = io("ws://localhost:8080");

socket.on("send-new-number", (data) => {
    // data: number
    document.getElementById("noiDung").innerHTML = data
})

export default function Socket() {
  return (
    <div className='text-white'>
        <button onClick={() => {
            socket.emit("send-click", "")
        }}>Click</button>
        <p id='noiDung'>0</p>
        <button
            id="reduceNumber"
            onClick={() => {
                // B1: client bắn event cho server
                socket.emit("reduce-number", "");
            }}
        >reduce number</button>
    </div>
  )
}
