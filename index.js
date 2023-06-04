const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Connect to MongoDB using Mongoose
mongoose
  .connect(
    "mongodb+srv://vinitha:6nEye3eS1xaCOyvI@cluster0.28ve347.mongodb.net/db?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

// Create a schema for the address model
const addressBookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true, unique: true, minlength: 10 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const corsOptions = {
  origin: "http://localhost:4200",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

// Create a address model based on the schema
const AddressBook = mongoose.model(
  "AddressBook",
  addressBookSchema,
  "addressBook"
);

// Create the Express app
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Define the routes

// Get all address
app.get("/address", async (req, res) => {
  try {
    const address = await AddressBook.find();
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

// Get a specific address by ID
app.get("/address/:id", async (req, res) => {
  try {
    const address = await AddressBook.findById(req.params.id);
    if (!address) {
      res.status(404).json({ error: "Address not found" });
    } else {
      res.json(address);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch address" });
  }
});

// Create a new address
app.post("/address", async (req, res) => {
  try {
    const address = new AddressBook(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: "Failed to create address" });
  }
});

// Update a address
app.put("/address/:id", async (req, res) => {
  try {
    const address = await AddressBook.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!address) {
      res.status(404).json({ error: "Address not found" });
    } else {
      res.json(address);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update address" });
  }
});

// Delete a address
app.delete("/address/:id", async (req, res) => {
  try {
    const address = await AddressBook.findByIdAndDelete(req.params.id);
    if (!address) {
      res.status(404).json({ error: "Address not found" });
    } else {
      res.json({ message: "Address deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete address" });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
