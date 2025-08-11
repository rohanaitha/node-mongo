const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

app.use(express.json());

app.listen(5000, () => {
  console.log("server started");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
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


module.exports = app;