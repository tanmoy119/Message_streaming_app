const express = require("express");
const { getMessages } = require("../controllers/message.controller");
const messageRouter = express.Router();


//! get message ... 
messageRouter.get("/getmessages", getMessages);

module.exports= messageRouter;
