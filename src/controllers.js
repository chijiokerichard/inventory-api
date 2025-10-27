const { Person, Products, ProductCateory } = require("./models/models");

const signUpUser = async (req, res) => {
  try {
    const user = await Person.create(req.body);
    res.status(201).json({
      message: `account created successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
      },
    });
  } catch (err) {
    res.status(500).json({ message: `error occured ${err.message}` });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user)
      return res.status(401).json({ message: "User not authenticated" });
    const userObj = user.toObject();
    delete userObj.password;
    const token = generateToken(userObj);
    return res.status(200).json({
      user: userObj,
      token,
      message: "Login successfull",
    });
  } catch (err) {
    return res.status(500).json({ message: `error occure ${err.message}` });
  }
};

const createCategory = async (req, res) => {
  try {
    const {category_name} = req.body;
    if (!category_name)
      return res.status(400).json({ message: `category required`});
    const conflict = await ProductCateory.findOne({category_name:category_name});
    if (conflict)
      return res.status(409).json({ message: "category already existed" });
    await ProductCateory.create(req.body);
    return res
      .status(201)
      .json({ message: `${category_name} category created successfully` });
  } catch (err) {
    return res.status(500).json({ message: `error occured ${err.message}` });
  }
};

const allCategory = async (req, res) => {
  try {
    const categorys = await ProductCateory.find();
    if(!categorys) return res.status(204).json({message:"Your category is empty"});
    return res
      .status(200)
      .json({categorys});
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
    return res.status(503).json({ message: `check your connection ${err.message}` })
    }else{
      return res.status(500).json({ message: `error occured ${err.message}` })
    }

  }
};


const createProduct = async (req, res) => {
  try {
    console.log("Incoming product:", req.body);
    const { name, price, stock } = req.body;
    console.log(req.body)

    if (!name || !price || !stock) {
      return res
        .status(400)
        .json({ message: `price, name, stock are required` });
    }
    const conflict = await Products.findOne({ name });
    if (conflict) {
      return res.status(409).json({ message: "product already existed" });
    }

    await Products.create(req.body);
    return res.status(201).json({ message: "product created successfully" });
  } catch (err) {
    return res.status(500).json({ message: `error occured ${err.message}` });
  }
};

const allProduct = async (req, res) => {
  try {
    const products = await Products.find();
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ message: `error occured ${err.message}` });
  }
};

const allUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (user.id !== id)
      return res.status(401).json({ message: "not authenticated" });
    // const AmdinUser = await Person.findById(id).populate("isAdmin")// on if referenced on schema
    const AmdinUser = await Person.findById(id);
    if (!AmdinUser.isAdmin)
      return res.status(401).json({ message: "Access denied" });
    const users = await Person.find().select("-password");
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ message: `error occured ${err.message}` });
  }
};

module.exports = {
  allUser,
  signUpUser,
  loginUser,
  createProduct,
  allProduct,
  createCategory,
  allCategory
};
