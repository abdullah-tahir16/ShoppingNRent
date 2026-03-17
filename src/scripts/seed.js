require("dotenv").config();

const bcrypt = require("bcryptjs");
const { connectDatabase, disconnectDatabase } = require("../config/database");
const Administrator = require("../models/administrator");
const User = require("../models/user");
const Product = require("../models/products");
const Order = require("../models/orders");

async function buildPasswordHash(password) {
  return bcrypt.hash(password, 10);
}

async function seedAdministrators() {
  const adminPassword = await buildPasswordHash("admin12345");

  const admin = await Administrator.findOneAndUpdate(
    { username: "superadmin" },
    {
      username: "superadmin",
      password: adminPassword,
      approved: true,
      timeLogs: [],
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return admin;
}

async function seedUsers() {
  const users = [
    {
      name: "Ali Buyer",
      cnic: "35202-1234567-1",
      city: "Lahore",
      contactNumber1: "+92-300-1111111",
      password: await buildPasswordHash("buyer12345"),
      contactAddressComm: "Model Town, Lahore",
      contactAddressPermanent: "Model Town, Lahore",
      email: "buyer@example.com",
      username: "buyer_one",
      active: true,
      approved: true,
      promoCode: "WELCOME10",
      role: "buyer",
      language: "english",
    },
    {
      name: "Sara Seller",
      cnic: "35202-1234567-2",
      city: "Karachi",
      contactNumber1: "+92-300-2222222",
      password: await buildPasswordHash("seller12345"),
      contactAddressComm: "Gulshan, Karachi",
      contactAddressPermanent: "Gulshan, Karachi",
      email: "seller@example.com",
      username: "seller_one",
      active: true,
      approved: true,
      promoCode: "SELLFAST",
      role: "seller",
      language: "english",
    },
    {
      name: "Hina Hybrid",
      cnic: "35202-1234567-3",
      city: "Islamabad",
      contactNumber1: "+92-300-3333333",
      password: await buildPasswordHash("hybrid12345"),
      contactAddressComm: "F-11, Islamabad",
      contactAddressPermanent: "F-11, Islamabad",
      email: "both@example.com",
      username: "both_one",
      active: true,
      approved: true,
      promoCode: "BOTH20",
      role: "both",
      language: "urdu",
    },
  ];

  const seededUsers = [];
  for (const user of users) {
    const seededUser = await User.findOneAndUpdate(
      { username: user.username },
      user,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    seededUsers.push(seededUser);
  }

  return seededUsers;
}

async function seedProducts(users) {
  const seller = users.find((user) => user.username === "seller_one");
  const hybridSeller = users.find((user) => user.username === "both_one");

  const products = [
    {
      name: "Canon DSLR Camera",
      price: 185000,
      city: "Karachi",
      description: "A well-maintained DSLR camera for rent or sale.",
      pictureLink: "https://example.com/images/camera.jpg",
      active: true,
      discount: 10,
      otherInformation: "Comes with two lenses and a carrying bag.",
      details: "Suitable for events, studio work, and travel shoots.",
      createdBy: seller._id,
      category: "electronics",
      condition: "used",
      make: "Canon",
      referenceId: "PRD-CAMERA-001",
    },
    {
      name: "Office Chair",
      price: 22000,
      city: "Islamabad",
      description: "Ergonomic mesh chair in excellent condition.",
      pictureLink: "https://example.com/images/chair.jpg",
      active: true,
      discount: 5,
      otherInformation: "Lumbar support and adjustable armrests.",
      details: "Ideal for home office and long work sessions.",
      createdBy: hybridSeller._id,
      category: "furniture",
      condition: "like-new",
      make: "IKEA",
      referenceId: "PRD-CHAIR-001",
    },
  ];

  const seededProducts = [];
  for (const product of products) {
    const seededProduct = await Product.findOneAndUpdate(
      { referenceId: product.referenceId },
      product,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    seededProducts.push(seededProduct);
  }

  return seededProducts;
}

async function seedOrders(users, products) {
  const buyer = users.find((user) => user.username === "buyer_one");
  const seller = users.find((user) => user.username === "seller_one");
  const hybridSeller = users.find((user) => user.username === "both_one");
  const camera = products.find((product) => product.referenceId === "PRD-CAMERA-001");
  const chair = products.find((product) => product.referenceId === "PRD-CHAIR-001");

  const orders = [
    {
      name: "Ali Buyer",
      address: "House 10, Model Town, Lahore",
      description: "Please deliver during office hours.",
      ordered_by: buyer._id,
      seller: seller._id,
      active: true,
      product: [camera._id],
      order_status: "approved",
      discount: 10,
      category: "sold",
      total_price: 166500,
    },
    {
      name: "Ali Buyer",
      address: "House 10, Model Town, Lahore",
      description: "Rental required for one week.",
      ordered_by: buyer._id,
      seller: hybridSeller._id,
      active: true,
      product: [chair._id],
      order_status: "dispatched",
      discount: 5,
      category: "rented",
      total_price: 20900,
    },
  ];

  const seededOrders = [];
  for (const order of orders) {
    const seededOrder = await Order.findOneAndUpdate(
      {
        ordered_by: order.ordered_by,
        seller: order.seller,
        total_price: order.total_price,
      },
      order,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
    seededOrders.push(seededOrder);
  }

  return seededOrders;
}

async function clearCollections() {
  await Promise.all([
    Order.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({}),
    Administrator.deleteMany({}),
  ]);
}

async function run() {
  const shouldReset = process.argv.includes("--reset");

  try {
    await connectDatabase(process.env.DATABASE);

    if (shouldReset) {
      await clearCollections();
    }

    const admin = await seedAdministrators();
    const users = await seedUsers();
    const products = await seedProducts(users);
    const orders = await seedOrders(users, products);

    console.log("Seed complete");
    console.log(
      JSON.stringify(
        {
          administrators: 1,
          users: users.length,
          products: products.length,
          orders: orders.length,
          adminUsername: admin.username,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

run();
