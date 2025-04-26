const express = require("express");
const { updateQuiz, uploadfilecreatetest, deleteQuiz } = require("../controller/Createtest/Uploadfilecreatetest");
const authenticate = require("../middleware/Authmiddleware");
const getquizs = require("../controller/Createtest/Getquiz");
const updateNavigateStatus = require("../controller/Createtest/Changenavigate");
const getQuizDetails = require("../controller/Createtest/getQuizDetails");

const Createtestrouter = express.Router();


Createtestrouter.post("/uploadfilecreate",authenticate,uploadfilecreatetest)
Createtestrouter.put("/updatequiz/:_id",authenticate,updateQuiz)
Createtestrouter.delete("/deletequiz/:_id",authenticate,deleteQuiz)
Createtestrouter.get("/getquizs/",authenticate,getquizs)
Createtestrouter.put("/updatenavigatestatus/:_id",authenticate,updateNavigateStatus)
Createtestrouter.get("/getquizdetails/:_id",authenticate,getQuizDetails)



module.exports = Createtestrouter;
