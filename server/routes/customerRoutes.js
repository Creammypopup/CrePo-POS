// D:\CrePo-POS\server\routes\customerRoutes.js
const express = require('express');
const { getCustomers, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');

const router = express.Router();

router.get('/', getCustomers);
router.post('/', createCustomer);
router.put('/:id', updateCustomer); // Use customer ID from URL for update
router.delete('/:id', deleteCustomer); // Use customer ID from URL for delete

module.exports = router;
