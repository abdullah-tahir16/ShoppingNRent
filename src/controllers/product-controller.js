const Product = require("../models/products");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { sendMail } = require("../services/emailer");


exports.createProduct = async (req, res) => {
  try {
    const { userId } = req.body;
    let product ; 

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, msg: "Please Provide UserId" });
    }

    const user = await User.findOne(
      { _id: userId },
      { password: false, __v: false }
    ).lean();

    if (!user) {
      return res.status(404).json({ success: false, msg: "Invalid userid" });
    } else {
      product = await Product.create({
        name: req.body.name,
        city: req.body.city,
        description: req.body.description,
        picture_link: req.body.pictureLink,
        active: req.body.active,
        discount: req.body.discount,
        other_information: req.body.otherInfo || "Blank field",
        created_at: Date.now(),
        details: req.body.details,
        price: req.body.price,
        // reference_id: req.body.referenceId,
        category: req.body.category,
        condition: req.body.condition,
        make: req.body.make,
        created_by: user,
      });
      // product.parseSequence();
    }
    await sendMail(
      user.email,
      "Your Product has been added Successfully",
      `${req.body.name} <br> put your additional html here 
      ShoppingNRent Team`
    );

    return res.status(200).json({
      success: true,
      msg: "Product created successfully",
      data: req.body,
      id: product._id,
      referenceId: product.reference_id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Error creating Product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(404).json({ success: false, msg: "Invalid record" });
    }

    let updateObject = {};

    if (req.body.name) {
      updateObject.name = req.body.name;
    }
    if (req.body.details) {
      updateObject.details = req.body.details;
    }
    if (req.body.city) {
      updateObject.city = req.body.city;
    }
    if (req.body.description) {
      updateObject.description = req.body.description;
    }
    if (req.body.pictureLink) {
      updateObject.picture_link = req.body.pictureLink;
    }
    if (req.body.otherInfo) {
      updateObject.other_information = req.body.otherInfo;
    }
    if (req.body.condition) {
      updateObject.condition = req.body.condition;
    }
    if (req.body.price) {
      updateObject.condition = req.body.price;
    }
    if (req.body.make) {
      updateObject.make = req.body.make;
    }
    if (req.body.active) {
      updateObject.active = req.body.active;
    }
    if (req.body.category) {
      updateObject.category = req.body.category;
    }
    if (req.body.discount) {
      updateObject.discount = req.body.discount;
    }

    const updateSingleProduct = await Product.findOneAndUpdate(
      { _id: id },
      {
        ...updateObject,
      }
    ).lean();

    

    return res.status(200).json({
      success: true,
      msg: "Product updated successfully",
      data: req.body,
      id: updateSingleProduct._id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Error while updating Product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { product } = req.body;

    if (product.length < 1) {
      return res
        .status(404)
        .json({ success: false, msg: "Empty array cannot be deleted" });
    }

    await Product.updateMany(
      { _id: { $in: product } },
      { $set: { deleted: true } }
    );

    return res.status(200).json({
      success: true,
      msg: "product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ success: false, msg: "Service is down. Contact administrator" });
  }
};

exports.getProductByCity = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid search query" });
    }

    const productByCity = await Product.find({
      city: { $regex: new RegExp("^" + city, "i") },
      deleted: false,
    }).lean();

    if (productByCity && productByCity.length === 0) {
      return res.status(200).json({
        success: true,
        message: "no records found",
      });
    } else {
      return res.status(200).json({ success: true, data: productByCity });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};


exports.getProductBySeller = async (req, res) => {
  try {
    const { created_by } = req.body;

    if (!created_by) {
      return res
        .status(404)
        .json({ success: false, msg: "Invalid search query" });
    }

    const productBySeller = await Product.find({
      created_by: created_by,
      deleted: false,
    }).lean();

    if (productBySeller && productBySeller.length === 0) {
      return res.status(200).json({
        success: true,
        message: "no records found",
      });
    } else {
      return res.status(200).json({ success: true, data: productBySeller });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
}