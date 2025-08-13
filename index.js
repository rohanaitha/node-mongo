const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const jsonwebtoken = require("jsonwebtoken");
dotenv.config();

app.use(
  cors({
    method: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.listen(5000, () => {
  console.log("server started");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongo connected"))
  .catch((err) => {
    console.log("mongo err:", err);
    process.exit(1);
  });

const accountSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const Account = mongoose.model("Account", accountSchema);

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const account = new Account({ name, email });
    await account.save();
    res.status(200).send(account);
  } catch (error) {
    console.log("error in account:", error);
    res.status(500).send({ error: "Failed to create account" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const user = await Account.find();
    res.status(200).send(user);
  } catch {
    res.status(500).send("error occured");
  }
});

const authenticatMiddleware = async (req, res, next) => {
  const { name, email, password } = req.body;
  const userDetails = await Account.find({ name });
  if (userDetails === undefined) {
    const payload = {
      name: name,
      email: email,
      password: password,
    };
    const token = jwt.sign(payload, "MY_SECRET_CODE");
    res.send({
      jwttoken: token,
    });
  } else {
    res.send("user registered");
  }
};

app.post("/register", authenticatMiddleware, (req, res) => {});

module.exports = app;
