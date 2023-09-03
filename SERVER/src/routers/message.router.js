const express = require("express");
const messageRouter = express.Router();

messageRouter.get("/getmessages", getMessages);

