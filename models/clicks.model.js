const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    clickType: { type: String, required: true }, 
    buttonName: { type: String, required: true }, 
    deviceType: { type: String, required: true },
    clickCount: { type: Number, default: 1 }, 
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Click", clickSchema);
