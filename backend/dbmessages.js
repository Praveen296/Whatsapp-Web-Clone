const mongoose = require('mongoose');


const whatsappSchema = mongoose.Schema({
    /*message : String,
    name : String,
    timestamp : String,
    received : Boolean*/

    roomName : String,
    DP : String,
    messages : [{
        messageText : String,
        author : String,
        timestamp : { type : Date, default: Date.now },
    }]
});

const WhatsappRoom = mongoose.model('messagecontents',whatsappSchema);

exports.WhatsappRoom = WhatsappRoom;