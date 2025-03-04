const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userUrlsSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        applications: [{
            type: String,
        }],
        activeButton: {
            type: String,
            enum: ["link", "shop"],
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("UserUrls", userUrlsSchema);
