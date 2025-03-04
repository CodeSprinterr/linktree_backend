const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            default: null,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        },
        password: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            default: null,
            sparse: true,
            trim: true,
        },
        category: {
            type: String,
            default: null,
        },
        image: { 
            data: { type: Buffer, default: null },
            contentType: { type: String, default: null },
        },
        bio: {
            type: String,
            default: "",
            trim: true,
        },
        bannerColor: {
            type: String,
            default: "#342B26",
        },
        urls: [{
            type: Schema.Types.ObjectId,
            ref: "UserUrls"
        }]
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model("User", userSchema);
