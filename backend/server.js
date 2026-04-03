const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ENV
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
const APP_NAME = process.env.APP_NAME;

// Connect DB
mongoose.connect(DB_URL)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Schema
const CalcSchema = new mongoose.Schema({
    a: Number,
    b: Number,
    operator: String,
    result: Number
});

const Calc = mongoose.model("Calc", CalcSchema);

// GET history
app.get("/history", async (req, res) => {
    const data = await Calc.find();
    res.json(data);
});

// POST calculate (+ - * /)
app.post("/calculate", async (req, res) => {
    const { a, b, operator } = req.body;

    let result;

    switch (operator) {
        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "*": result = a * b; break;
        case "/":
            if (b === 0) {
                return res.status(400).json({ error: "Cannot divide by zero" });
            }
            result = a / b;
            break;
        default:
            return res.status(400).json({ error: "Invalid operator" });
    }

    const newCalc = new Calc({ a, b, operator, result });
    await newCalc.save();

    res.json({ result });
});

// ABOUT
app.get("/about", (req, res) => {
    res.json({
        name: "Nguyen Tien Dat",
        studentId: "2251220022",
        class: "22CT1"
    });
});

// HEALTH
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`${APP_NAME} running on port ${PORT}`);
});