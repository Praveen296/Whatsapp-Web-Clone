import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import React,{useState,useEffect} from 'react';
import './Chat.css';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic';
import {useParams} from 'react-router-dom';
import Pusher from 'pusher-js';
import axios from './../axios';

function Chat() {

    const [input,setInput] = useState('');
    const [roomName,setRoomName] = useState('');
    const [roomDP,setRoomDP] = useState('');
    const [messages,setMessages] = useState([]);
    const [room,setRoom] = useState({});


    const {roomId} = useParams();


    useEffect(() => {
        if(roomId) {
            axios.get('/rooms/' + roomId).then(response => {
                //setRoomName(response.data.room);
                //setRoomDP(response.data.DP);
                setMessages(response.data.messages);
                setRoom(response.data);
                
            });

            
        }
    }, [roomId]);

    useEffect(() => {
        const pusher = new Pusher('fb6865a25711942398ec', {
            cluster: 'ap2'
          });
      
          const channel = pusher.subscribe('messages');
          
          channel.bind('updated',(newMessage) => {
            console.log(newMessage);  
            setMessages([...room.messages,newMessage]);
            room.messages.push(newMessage);
            setRoom(room);
            
              
          });
      
          return () => {
            channel.unbind_all();
            channel.unsubscribe();
          }
    }, [room]);


    const sendMessage = async (e) => {
        e.preventDefault();

        const newMessage = {
            messageText: input,
            author : 'Praveen'
            //timestamp: '11:49'
    
        }
        console.log(newMessage);
        const resp = await axios.put('/rooms/' + roomId + '/messages/new',newMessage);
        console.log(resp);

        setInput('');
    };
    return (
        <div className = 'chat'>
            <div className="chat__header">
                <Avatar src = {room.DP}/>

                <div className="chat__headerInfo">
                    <h3>{room.roomName}</h3>
                    <p>Online</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile/>
                    </IconButton>
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                </div>

            </div>

            <div className="chat__body">

                {messages.map(message => (
                    <p className={`chat__message ${message.author !== 'Praveen' ? "" : "chat__receiver"}`} >
                        <span className="chat__name">{message.author}</span>
                        {message.messageText}
                        <span className="chat__timestamp">
                        {message.timestamp.substr(0,16)}
                        </span>                    
                    </p>
                ))}

                
                </div>
                <div className="chat__footer">
                    <InsertEmoticonIcon />
                    <form>
                        <input value= {input} onChange= {e => setInput(e.target.value)} placeholder='Type a message' 
                        type="text"/>
                        <button onClick={sendMessage}
                        type='submit'>
                            Send a message
                            
                        </button>
                    </form>
                    <MicIcon />

                </div>            
        </div>
    )
}

export default Chat
