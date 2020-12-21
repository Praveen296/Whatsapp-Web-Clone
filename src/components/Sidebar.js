import React, { useEffect,useState } from 'react';
import './Sidebar.css';
import ChatIcon from '@material-ui/icons/Chat';
import {Avatar,IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import MoreVert from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from './SidebarChat';
import Pusher from 'pusher-js';
import axios from './../axios';


function Sidebar() {

    /*const [rooms,setRooms] = useState([]);

    useEffect(()=> {
        axios.get('/rooms/sync').then(response => {
          setRooms(response.data);
        }) 
      },[]);
    
      /*useEffect(() => {
        const pusher = new Pusher('fb6865a25711942398ec', {
          cluster: 'ap2'
        });
    
        const channel = pusher.subscribe('rooms');
        channel.bind('inserted', (newRoom) => {
          //alert(JSON.stringify(newMessage));
          setRooms([...rooms,newRoom]);
        });
    
        return () => {
          channel.unbind_all();
          channel.unsubscribe();
        }
      }, [rooms]);*/


      const [rooms,setRooms] = useState([]);

      useEffect(()=> {
        axios.get('/rooms/sync').then(response => {
          setRooms(response.data);
        }) 
      },[]);
    
      
      useEffect(() => {
        const pusher = new Pusher('fb6865a25711942398ec', {
          cluster: 'ap2'
        });
    
        const channel = pusher.subscribe('messages');
        channel.bind('inserted', (newRoom) => {
          //alert(JSON.stringify(newMessage));
          setRooms([...rooms,newRoom]);
        });

        /*channel.bind('updated',(newMessage) => {
            rooms.sort((a,b) => a.messages[a.messages.length-1].timestamp >= b.messages[b.messages.length-1].timestamp ? 1 : 0);
            setRooms(rooms);
        });*/
    
        return () => {
          channel.unbind_all();
          channel.unsubscribe();
        }
      }, [rooms]);
    
      console.log(rooms);
      

    return (
        <div className = 'sidebar'>
            <div className = 'sidebar__header'>
                <Avatar src = 'https://pbs.twimg.com/media/DYTiKj2XUAAB1rL.jpg' />
                <div className = 'sidebar__headerRight'>
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className='sidebar__search'>
                <div className='sidebar__searchContainer'>
                    <SearchOutlined />
                    <input placeholder='Search or start a new chat' type='text' />
                </div>

            </div>

            <div className="sidebar__chats">
                <SidebarChat addNewChat/>
                
                {rooms.map(room => (
                    <SidebarChat key = {room._id} id = {room._id} name = {room.roomName} DP = {room.DP} message = {room.messages.length === 0 ? '' : room.messages[room.messages.length - 1].messageText}/>
                ))}
            </div>

        </div>

    )
}

export default Sidebar
