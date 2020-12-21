import { Avatar } from '@material-ui/core'
import React from 'react'
import './SidebarChat.css'
import axios from './../axios';
import {Link} from 'react-router-dom';

function SidebarChat({addNewChat,key,id,name,DP,message}) {

    const createChat = async () => {
        const roomName = prompt('Please Enter room name for chat');
        const roomDP = prompt('Please Enter URL for DP');

        if(roomName && roomDP) {
            await axios.post('/rooms/new', {
                "roomName": roomName,
                "DP" : roomDP            
            })
        }

    };

    return !addNewChat ? (

        <Link to = {`/rooms/${id}`} >
        <div className = 'sidebarChat'>
            <Avatar src = {DP}/>
            <div className="sidebarChat__info">
                <h2>{name}</h2>
                <p>{message}</p>
            </div>

        </div>
        </Link>
    ) : (
        <div onClick = {createChat}
        className = 'sidebarChat'>
            <h3>Add new Chat</h3>

        </div>
    );
}

export default SidebarChat
