const  message = require("../models/message.model");


const getMessages = async (req,res,next)=>{
    try {
        const messages = await message.find({});
        if(messages){
            return res.status(200).json({error:false,message:"messages found successfully.",data:messages});
        }

        res.status(404).json({error:true,message:"No message found.."});
        
    } catch (error) {
        next(error);
    }
}

module.exports={
    getMessages
};