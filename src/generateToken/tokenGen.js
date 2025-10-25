const jwt = require("jsonwebtoken")

function generateToken(user){
    return jwt.sign(
        {id:user._id || user.id,email:user.email},
        process.env.JWT_SECRET_KEY||"supersecret",
        { expiresIn: "1h" }

    )
}
module.exports = generateToken