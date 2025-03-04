// user.controller.js
const userModel = require("../models/user.model");
const userUrls = require("../models/userUrl.model");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
}).single('image');

exports.setusername = async (req, res, next) => {
    try {
        const {
            username,
            category,
        } = req.body;

        const user = await userModel.findById(req.user.id);

        user.username = username;
        user.category = category;
        await user.save();

        res.json({
            success: true,
            message: "Username set successfully"
        }).status(200);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }
        next(err);
    }
};

exports.fetchUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id);
        res.json({
            success: true,
            user : user
        }).status(200);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Invalid Token"
            });
        }
        next(err);
    }
};

exports.uploadDP = (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Image upload failed. Please try again.",
                error: err.message,
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded.",
            });
        }

        try {
            const user = await userModel.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found.",
                });
            }

            user.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };

            await user.save();

            res.status(200).json({
                success: true,
                message: "Profile image uploaded successfully.",
                user,
            });
        } catch (err) {
            next(err);
        }
    });
};

exports.removeImage = async (req, res, next) => {
    try {
        // Find the user by their ID
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Check if the user already has an image
        if (!user.image) {
            return res.status(400).json({
                success: false,
                message: "No profile image to remove.",
            });
        }

        // Remove the image data by setting it to null
        user.image = null;

        // Save the updated user
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile image removed successfully.",
            user, // Send back the updated user object (without the image)
        });
    } catch (err) {
        next(err);
    }
};

exports.saveDataPage1 = async (req, res) => {
    try {
        const { bio, bannerColor, links } = req.body;
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update User data
        user.bio = bio || user.bio;
        user.bannerColor = bannerColor || user.bannerColor;

        await user.save();

        // Filter valid links (title & url must not be empty)
        const validLinks = links.filter(link => link.title.trim() !== "" && link.url.trim() !== "");

        if (validLinks.length > 0) {
            const newLinks = validLinks.map(link => ({
                userId,
                title: link.title,
                url: link.url,
                applications: link.applications || [],
                activeButton: link.type
            }));
            await userUrls.insertMany(newLinks);
        }

        return res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getUrls = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id);
        const userLinks = await userUrls.find({ userId: req.user.id });

        if (!userLinks || userLinks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No URLs found for this user.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User URLs fetched successfully.",
            links: userLinks,
            user
        });
    } catch (err) {
        next(err);
    }
};

