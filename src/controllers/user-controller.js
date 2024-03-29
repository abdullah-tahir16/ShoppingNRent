const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../services/emailer");

const createUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const { password } = req.body;
    const hashed_password = await bcrypt.hash(password, salt);

    const user_data = await User.create({
      ...req.body,
      promo_code: req.body.promoCode || "No promo code applied",
      password: hashed_password,
      member_since: Date.now(),
    });

    await sendMail(
      user_data.email,
      "Registration Successful",
      `Greetings, <br> <br>
      Your registration form has been successfully submitted. Thank you! <br> <br>
      We are very pleased that you are interested in beginning your journey with us. You will shortly receive an email from <b>shoppingNRent</b> that will guide you on the registration process. If you do not receive an email in a few minutes, check your “junk mail/spam” folder. For technical assistance, please do not hesitate to write to us at <b>support@shoppingnrent.com</b>. <br> <br>
      We shall be glad to get back to you.<br> <br>
      ShoppingNRent Team`
    );

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

const loginUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    }).lean();

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid credentials" });
    }

    const is_match = await bcrypt.compare(password, user.password);

    if (!is_match) {
      return res.status(404).json({ success: false, msg: "Invalid credentials" });
    }

    if (!user.approved) {
      return res.status(404).json({ success: false, msg: "Account pending approval." });
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
    return res.status(400).json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

const approveUser = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id || !req.body.is_approved) {
      return res.status(400).json({ success: false, msg: "Invalid record" });
    }
    
    const user = await User.findOneAndUpdate(
      { _id: id },
      { approved: req.body.is_approved },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid Request" });
    }

    return res.status(200).json({
      success: true,
      approval: req.body.is_approved,
      msg: "Account modified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ success: false, msg: "Invalid record" });
    }

    const user = await User.findOne(
      { _id: id },
      { password: false, _id: false, __v: false }
    ).lean();

    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid record" });
    }

    return res.status(200).json({
      success: true,
      msg: "User found",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id || !req.body) {
      return res.status(400).json({ success: false, msg: "Invalid record. Cannot modify." });
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid Request" });
    }

    return res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

const updateLanguage = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id || (req.body.language !== "english" && req.body.language !== "urdu")) {
      return res.status(400).json({ success: false, msg: "Invalid input" });
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      { language: req.body.language },
      { new: true }
    ).lean();

    if (!user) {
      return res.status(400).json({ success: false, msg: "Invalid Request" });
    }

    return res.status(200).json({
      success: true,
      msg: "Language updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

module.exports = {
  createUser,
  loginUser,
  approveUser,
  getUserById,
  updateUser,
  updateLanguage,
};
