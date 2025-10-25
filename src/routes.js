const { allUser } =  require("./controllers")

const express = require("express")


const router = express.Router()

router.get("/users",allUser)

module.exports={router}