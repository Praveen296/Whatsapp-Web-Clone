//importing
const express = require('express');
const mongoose = require('mongoose');
const {WhatsappRoom} = require('./dbmessages');
const Cors = require('cors');
const Pusher = require('pusher');


//app config
const app = express();
const port = process.env.port || 9000;
const connection_url = 'mongodb+srv://admin:t1Y4Ulqh9jXOkPaF@cluster0.dfpad.mongodb.net/whatsappDb?retryWrites=true&w=majority';

const pusher = new Pusher({
    appId: "1117181",
    key: "fb6865a25711942398ec",
    secret: "31a6c1133f8aac01a7e2",
    cluster: "ap2",
    useTLS: true
  });

//middleware
app.use(express.json());
app.use(Cors());



//DB config
mongoose.connect(connection_url, {
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology : true,
});

const db = mongoose.connection;

db.once('open', () => {
    console.log('DB connected');
    const messageCollection = db.collection('messagecontents');

    const changeStream = messageCollection.watch();

    changeStream.on('change',(change) => {
        console.log('change is: ',change);

        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;

            pusher.trigger('messages','inserted',{
                /*name : messageDetails.name,
                message : messageDetails.message,
                timestamp : messageDetails.timestamp,
                received : messageDetails.received*/
                _id : messageDetails._id,
                roomName : messageDetails.roomName,
                DP : messageDetails.DP,
                messages : messageDetails.messages                
            });
        } 
        else if(change.operationType === 'update') {
            let num = change.updateDescription.updatedFields.__v;
            console.log(num);
            let newMessage;
            if(num == 1) {
                newMessage = change.updateDescription.updatedFields.messages[0];    
            }
            else {
                num = num - 1;
                newMessage = change.updateDescription.updatedFields['messages.' + num];
            }
            console.log(newMessage);
            
            pusher.trigger('messages','updated',{
                /*name : messageDetails.name,
                message : messageDetails.message,
                timestamp : messageDetails.timestamp,
                received : messageDetails.received*/
                messageText : newMessage.messageText,
                author : newMessage.author,
                timestamp : newMessage.timestamp
            });

        }
        else if(change.operationType === 'delete') {
            console.log(change);

        }
        
            else{
            console.log('Error triggering Pusher');
        }
    })
});


app.get('/rooms/sync',(req,res) => {
    WhatsappRoom.find((err,data) => {
        if(err) {
            res.status(500).send(err);
        }
        else {
            res.status(200).send(data);
        }
    })
});

app.post('/messages/new',(req,res) => {
    const dbMessage = req.body;

    WhatsappRoom.create(dbMessage, (err,data) => {
        if(err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data);
        }
    })
})


app.post('/rooms/new',async (req,res) => {
    

    try{
        const room = req.body;

    let newRoom = new WhatsappRoom(
        room
    );

    newRoom = await newRoom.save();
    res.status(200).send("Room added");
    }
    catch(err) {
        console.log(err);
    }

    /*Messages.create(room, (err,data) => {
        if(err) {
            res.status(500).send(err);
        }
        else {
            res.status(201).send(data);
        }
    })*/
})

app.put('/rooms/:id/messages/new',async (req,res) => {
    try {
        let chat = await WhatsappRoom.findById(req.params.id);
    
        const message = {
        messageText : req.body.messageText,
        author : req.body.author
        };

        console.log(chat);

        chat.messages.push(message); 

        await chat.save();

        res.status(200).send("Message added");
    
    }catch(err) {
        console.log(err);
    }

})

app.get('/rooms/:id/messages/',async (req,res) => {
    try {
        let chat = await WhatsappRoom.findById(req.params.id);
    
        res.status(200).send(chat.messages);
    
    }catch(err) {
        console.log(err);
    }

})

app.get('/rooms/:id/',async (req,res) => {
    try {
        let chat = await WhatsappRoom.findById(req.params.id);
    
        res.status(200).send(chat);
    
    }catch(err) {
        console.log(err);
    }

})



//listen
app.listen(port,() => {
    console.log(`Listening on port: ${port}`);
})