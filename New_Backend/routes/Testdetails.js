const express = require("express");
const authenticate = require("../middleware/Authmiddleware");
const { getUserQuizCodes } = require("../controller/Testdetails/getalltestdetails");
const { getTestDetails } = require("../controller/Testdetails/gettestdetail");
const { getQuizDetailsById } = require("../controller/Testdetails/getdetailsofonetest");

const Testdetailsrouter = express.Router();

Testdetailsrouter.get("/getuserquizcodes",authenticate,getUserQuizCodes)
Testdetailsrouter.get("/getusertestdetails/:quizCode",authenticate,getTestDetails)
Testdetailsrouter.get("/getquizdetailsbyid/:id",authenticate,getQuizDetailsById)


    
module.exports = Testdetailsrouter;