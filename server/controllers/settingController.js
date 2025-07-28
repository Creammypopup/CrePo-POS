    // server/controllers/settingController.js
    const asyncHandler = require('express-async-handler');
    const Setting = require('../models/Setting');

    // @desc    Get settings
    // @route   GET /api/settings
    // @access  Private
    const getSettings = asyncHandler(async (req, res) => {
      // Find the single settings document, or create it if it doesn't exist
      let settings = await Setting.findOne({ singleton: 'main_settings' });
      if (!settings) {
        settings = await Setting.create({});
      }
      res.status(200).json(settings);
    });

    // @desc    Update settings
    // @route   PUT /api/settings
    // @access  Private (Admin/Manager)
    const updateSettings = asyncHandler(async (req, res) => {
      const { companyName, address, phone, taxId, logoUrl } = req.body;

      // Find the single settings document, or create it if it doesn't exist
      let settings = await Setting.findOne({ singleton: 'main_settings' });
      if (!settings) {
        settings = await Setting.create({ companyName, address, phone, taxId, logoUrl });
      } else {
        settings.companyName = companyName || settings.companyName;
        settings.address = address || settings.address;
        settings.phone = phone || settings.phone;
        settings.taxId = taxId || settings.taxId;
        settings.logoUrl = logoUrl || settings.logoUrl;
        await settings.save();
      }

      res.status(200).json(settings);
    });

    module.exports = {
      getSettings,
      updateSettings,
    };
    