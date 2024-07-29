const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5000;
require("dotenv").config();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.bpokgog.mongodb.net/InputData?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

// Schema
const interactionSchema = new mongoose.Schema(
  {
    Title: String,
    Categories: String,
    SubCategories: String,
    InputContent: String,
  },
  { timestamps: true }
);

const Interaction = mongoose.model("Interaction", interactionSchema);

// Routes
app.post("/save", async (req, res) => {
  try {
    const interaction = new Interaction(req.body);
    await interaction.save();
    res.status(200).send("Data saved successfully");
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send(err.message);
  }
});

app.get("/interactions", async (req, res) => {
  try {
    const interactions = await Interaction.find({});
    res.status(200).json(interactions);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
