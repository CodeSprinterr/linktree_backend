const mongoose = require('mongoose');

const userProfileAppearanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bgColor: String,
  fontColor: String,
  color: String,
  selectedFont: String,
  selectedTheme: String,
  selectedLayout: String,
  selectedButton: String,
  selectedButtonColor: String,
  selectedButtonFontColor: String,
  urlData: Array,
}, { timestamps: true });

module.exports = mongoose.model('UserProfileAppearance', userProfileAppearanceSchema);
