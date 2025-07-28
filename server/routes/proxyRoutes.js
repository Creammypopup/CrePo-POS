    // server/routes/proxyRoutes.js
    const express = require('express');
    const router = express.Router();
    const { getWanpraData, getPublicHolidays } = require('../controllers/proxyController');
    const { protect } = require('../middleware/authMiddleware');

    // ใช้ protect middleware เพื่อให้แน่ใจว่าเฉพาะผู้ใช้ที่ล็อกอินแล้วเท่านั้นที่สามารถเข้าถึงได้
    router.use(protect);

    // Route สำหรับดึงข้อมูลวันพระ
    router.get('/wanpra/:year', getWanpraData);

    // Route สำหรับดึงข้อมูลวันหยุดราชการ
    router.get('/holidays/:year', getPublicHolidays);

    module.exports = router;
    