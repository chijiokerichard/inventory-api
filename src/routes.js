const { allUser, signUpUser, loginUser, createProduct, allProduct, createCategory } =  require("./controllers")

const express = require("express")
const { validateUserSignUp, validateUserLogin } = require("./middleware/validateUser")
const authMiddleware = require("./middleware/authMiddleware")


const router = express.Router()

router.post("/signup",validateUserSignUp,signUpUser)
router.post("/login",validateUserLogin,loginUser)
router.get("/users",allUser)
router.post("/create_product",createProduct)
router.get("/products",allProduct)
router.post("/create_category",createCategory)

module.exports={router}