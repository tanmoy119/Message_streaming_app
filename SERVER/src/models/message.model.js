const {Schema, model } = require('mongoose');

const messageSchema = new Schema({
    name:{
        type:String,
        required:[true,"name is mandatory"]
    },
    origin:{
        type:String,
        required:[true,"origin is mandatory"]
    },
    destination:{
        type:String,
        required:[true,"destination is mandatory"]
    }
    
},{
    timeseries:true,
    timestamps:true
})

const message = new model("message",messageSchema);

module.exports = message;