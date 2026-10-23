const express = require('express');
const { getAllLinks,createLink,getStats,deleteLink,getLinkByCode } = require('../controllers/linkController');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const createLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  message: { error: 'Too many requests, please try again later' },
});

router.get('/', getAllLinks);
router.post('/', createLimiter, createLink);
router.get('/:shortCode/stats', getStats);
router.delete('/:id', deleteLink);
router.get('/:shortCode', getLinkByCode);
module.exports = router;