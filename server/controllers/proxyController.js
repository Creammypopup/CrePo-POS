    // server/controllers/proxyController.js
    const asyncHandler = require('express-async-handler');
    const axios = require('axios');

    // @desc    Proxy for Wanpra API
    // @route   GET /api/proxy/wanpra/:year
    // @access  Private
    const getWanpraData = asyncHandler(async (req, res) => {
        try {
            const year = req.params.year;
            const response = await axios.get(`https://wanpra.vercel.app/api/v2/${year}`);
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error fetching Wanpra data:', error.message);
            // ส่ง response ที่เป็น array ว่างกลับไปแทนที่จะเป็น error
            // เพื่อให้หน้าบ้านไม่พัง แม้ API ปลายทางจะล่มหรือไม่มี่ข้อมูล
            res.status(200).json([]); 
        }
    });

    // @desc    Proxy for Public Holidays API
    // @route   GET /api/proxy/holidays/:year
    // @access  Private
    const getPublicHolidays = asyncHandler(async (req, res) => {
        try {
            const year = req.params.year;
            const response = await axios.get(`https://date.nager.at/api/v3/PublicHolidays/${year}/TH`);
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error fetching public holidays:', error.message);
            res.status(200).json([]);
        }
    });

    module.exports = {
        getWanpraData,
        getPublicHolidays,
    };
    