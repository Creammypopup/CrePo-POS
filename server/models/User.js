const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Role'
  }
}, { timestamps: true });

// --- START OF EDIT ---
// Add a "pre-save hook" to automatically hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// --- END OF EDIT ---

module.exports = mongoose.model('User', userSchema);
