const express = require("express");
const { Userregister, Userlogin } = require("../controller/auth/auth");
const authenticate = require("../middleware/Authmiddleware");
const userDetails = require("../controller/auth/userDetails");
const Authrouter = express.Router();

Authrouter.post("/register",Userregister);
Authrouter.post("/login", Userlogin);
Authrouter.get("/userDetails",authenticate, userDetails);


module.exports = Authrouter;