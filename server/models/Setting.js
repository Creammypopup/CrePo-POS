    // server/models/Setting.js
    const mongoose = require('mongoose');

    const settingSchema = new mongoose.Schema({
      // Using a fixed ID to ensure there's only one settings document
      singleton: {
        type: String,
        default: 'main_settings',
        unique: true,
      },
      companyName: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      taxId: {
        type: String,
        trim: true,
      },
      logoUrl: {
        type: String,
      },
    }, {
      timestamps: true,
    });

    module.exports = mongoose.model('Setting', settingSchema);
    