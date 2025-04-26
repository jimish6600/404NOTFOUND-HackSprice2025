const express = require("express");
const authenticate = require("../middleware/Authmiddleware");
const copyQuizData = require("../controller/Runquiz/Runquiz");
const handleQuizUpdate = require("../controller/Runquiz/handlequizupdate");
const getBasicinfomation = require("../controller/Runquiz/getbasicinfomation");

const Runtestrouter = express.Router();

Runtestrouter.get("/start/:quizCode",authenticate,copyQuizData)
Runtestrouter.post("/handlequizupdate/:_id",authenticate,handleQuizUpdate)
Runtestrouter.get("/getBasicinfomation/:_id",authenticate,getBasicinfomation)

module.exports = Runtestrouter;