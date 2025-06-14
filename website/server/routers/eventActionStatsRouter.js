const express = require('express');
const router = express.Router();
const { getEventActionStats, getEventActionTotalPrice, getFunnelAnalysis, getAppActionStats,
    getAppActionActiveUsers, autoAnalyze } = require('../controllers/eventActionStats');

// GET /api/admin/event-action-stats
router.get('/admin/event-action-stats', getEventActionStats);
router.get('/admin/event-action-total-price', getEventActionTotalPrice);
router.get('/admin/funnel-analysis', getFunnelAnalysis);
router.get('/admin/app-action-stats', getAppActionStats);
router.get('/admin/app-action-active-users', getAppActionActiveUsers);
router.post('/admin/chatgpt', autoAnalyze)
module.exports = router;
