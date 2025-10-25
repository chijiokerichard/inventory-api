
 function allUser(req,res){
    const users=[
        {
            name:"chijioke",
            number:"08028391376",
            age:3
        }
    ]
    return res.status(200).json({users})

}

module.exports={allUser}