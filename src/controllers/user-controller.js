const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// Create API
exports.createUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const { password } = req.body;
    const hashed_password = await bcrypt.hash(password, salt); // Encrypting password before saving it in DB

    const user_data = await User.create({
      ...req.body,
      promo_code: req.body.promoCode || "No promo code applied",
      password: hashed_password,
      member_since: Date.now(),
    });
    return res.status(200).json({
      success: true,
      msg: `${user_data.role} created successfully`,
      id: user_data._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, msg: "Error creating user" });
  }
};

// Login API
exports.loginUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    }).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid credentials" });
    }

    const is_match = await bcrypt.compare(password, user.password); // Matching encrypted passwords
    if (!is_match) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid credentials" });
    }
    if (!user.approved) {
      return res
        .status(404)
        .json({ success: false, msg: "Account pending approval." });
    }
    if (user.suspended) {
      return res.status(401).json({
        success: false,
        msg: "Account has been suspended. Contact Administrator",
      });
    }
    const payload = {
      user: {
        id: user._id,
      },
    };
    return res.status(200).json({
      success: true,
      token: jwt.sign(payload, process.env.JWT_SECRET_USER, {
        expiresIn: "1h",
      }),
      id: user._id,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(400)
      .json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

// Approving User
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(404).json({ success: false, msg: "Invalid record" });
    }
    if (!req.body.is_approved) {
      console.error("is_approved key not valid");
      return res.status(404).json({ success: false, msg: "Invalid record" });
    }
    const user = await User.findOneAndUpdate(
      { _id: id },
      { approved: req.body.is_approved },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid Request" });
    }


    return res.status(200).json({
      success: true,
      approval: req.body.is_approved,
      msg: "Account modified successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

// User get by Id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ success: false, msg: "Invalid record" });
    }

    const user = await User.findOne(
      { _id: id },
      { password: false, member_id: false, _id: false, __v: false }
    ).lean();

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid record" });
    }
    return res.status(200).json({
      success: true,
      msg: "User found",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

// Update API
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(404).json({ success: false, msg: "Invalid record" });
    }
    if (!req.body) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid record. Cannot modify." });
    }
    const user = await User.findOneAndUpdate(
      id,
      { ...req.body },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid Request" });
    }
    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Service is down. Contact administrator" });
  }
};


exports.updateLanguage = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(404).json({ success: false, msg: "Invalid record" });
    }
    if (req.body.language !=="english") {
      if(req.body.language !=="urdu"){
        return res
        .status(400)
        .json({ success: false, msg: "Invalid input" });
      }
      
    }
    const user = await User.findOneAndUpdate(
      id,
      { language: req.body.language, },
      { new: true } 
    ).lean();

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid Request" });
    }
    return res.status(200).json({
      success: true,
      msg: "Langugae updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Service is down. Contact administrator" });
  }
};