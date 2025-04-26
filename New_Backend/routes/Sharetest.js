const express = require("express");
const Sharecode = require("../controller/Sharetest.js/ShareTestUsingCode");
const authenticate = require("../middleware/Authmiddleware");
const fetchUserQuizzes = require("../controller/Sharetest.js/receivedQuiz");

const Sharetestrouter = express.Router();

Sharetestrouter.post("/sharecode/:quizCode",authenticate,Sharecode);
Sharetestrouter.get("/receivedquiz/",authenticate,fetchUserQuizzes);

module.exports = Sharetestrouter;