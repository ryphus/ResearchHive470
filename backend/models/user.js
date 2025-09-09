const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  interests: { type: String, default: '' },
  publications: { type: String, default: '' },
  projects: { type: String, default: '' },
  affiliations: { type: String, default: '' },
  contact: { type: String, default: '' },
  //photo: { type: String, default: '' } // <-- Add this line if missing
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password comparison method
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Avoid overwriting existing model
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
