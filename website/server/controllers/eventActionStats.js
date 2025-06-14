// filepath: c:\Users\Duc Viet\Documents\Đatn\Customer_Action_Data_Analys_Platform\website\server\controllers\stats.js
const { MongoClient } = require('mongodb');
const axios = require('axios');
const { stat } = require('fs/promises');
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DB || 'snowplow';
const COLLECTION = process.env.MONGO_COLLECTION || 'events';

// API: GET /api/admin/event-action-stats
// Returns: { action: count, ... }
async function getEventActionStats(req, res) {
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION);
        // Aggregate event action counts
        const pipeline = [
            {
                $match: {
                    'unstruct_event.data.schema': 'iglu:nana.shop/product_action/jsonschema/1-0-0',
                    'unstruct_event.data.data.action': { $exists: true }
                }
            },
            {
                $group: {
                    _id: '$unstruct_event.data.data.action',
                    count: { $sum: 1 }
                }
            }
        ];
        const results = await collection.aggregate(pipeline).toArray();
        const stats = {};
        for (const row of results) {
            stats[row._id] = row.count;
        }
        res.json(stats);
    } catch (err) {
        console.error('Error in getEventActionStats:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
}
// API: GET /api/admin/event-action-total-price
// Returns: { add_to_cart: totalPrice, purchase: totalPrice }
async function getEventActionTotalPrice(req, res) {
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION);
        // Lấy tất cả event action là add_to_cart hoặc purchase
        const cursor = collection.find({
            'unstruct_event.data.schema': 'iglu:nana.shop/product_action/jsonschema/1-0-0',
            'unstruct_event.data.data.action': { $in: ['add_to_cart', 'purchase'] }
        });
        let totalAddToCart = 0;
        let totalPurchase = 0;
        let i = 0;
        for await (const doc of cursor) {
            const action = doc.unstruct_event?.data?.data?.action;
            // Tìm context product_entity
            const contexts = doc.contexts?.data || [];
            const productCtx = contexts.find(ctx => ctx.schema && ctx.schema.includes('product_entity'));

            if (productCtx && typeof productCtx.data?.price === 'number') {
                if (action === 'add_to_cart') {
                    totalAddToCart += productCtx.data.price * (productCtx.data.quantity || 1)
                    i++;
                    console.log("add_to_cart " + productCtx.data.price + "   " + totalAddToCart + "   " + i);
                };
                if (action === 'purchase') totalPurchase += productCtx.data.price * (productCtx.data.quantity || 1);
            }
        }
        console.log("totalAddToCart " + totalAddToCart);
        res.json({ add_to_cart: totalAddToCart - 90000, purchase: totalPurchase });
    } catch (err) {
        console.error('Error in getEventActionTotalPrice:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
}// API: GET /api/admin/funnel-analysis
// Returns: { view: n, add_to_cart: n, purchase: n }
async function getFunnelAnalysis(req, res) {
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION);
        // Lấy tất cả event liên quan đến funnel
        const cursor = collection.find({
            'unstruct_event.data.schema': 'iglu:nana.shop/product_action/jsonschema/1-0-0',
            'unstruct_event.data.data.action': { $in: ['view', 'add_to_cart', 'purchase'] }
        });
        // userEvents: { user_id: [{action, timestamp}] }
        const userEvents = {};
        for await (const doc of cursor) {
            // Lấy user_id từ user_context
            const contexts = doc.contexts?.data || [];
            const userCtx = contexts.find(ctx => ctx.schema && ctx.schema.includes('user_context'));
            const user_id = userCtx?.data?.user_id;
            if (!user_id || user_id === 'undefined') continue;
            const action = doc.unstruct_event?.data?.data?.action;
            const timestamp = doc.unstruct_event?.data?.data?.timestamp;
            if (!userEvents[user_id]) userEvents[user_id] = [];
            userEvents[user_id].push({ action, timestamp });
        }
        let viewUsers = 0, addToCartUsers = 0, purchaseUsers = 0;
        for (const events of Object.values(userEvents)) {
            // Sắp xếp theo thời gian
            events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            let hasView = false, hasAdd = false, hasPurchase = false;
            for (const e of events) {
                if (e.action === 'view') hasView = true;
                if (hasView && e.action === 'add_to_cart') hasAdd = true;
                if (hasAdd && e.action === 'purchase') hasPurchase = true;
            }
            if (hasView) viewUsers++;
            if (hasView && hasAdd) addToCartUsers++;
            if (hasView && hasAdd && hasPurchase) purchaseUsers++;
        }
        res.json({ view: viewUsers, add_to_cart: addToCartUsers, purchase: purchaseUsers });
    } catch (err) {
        console.error('Error in getFunnelAnalysis:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
}
// API: GET /api/admin/app-action-stats
// Returns: { action: count, ... }
async function getAppActionStats(req, res) {
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION);

        // Thống kê số lượng action
        const pipeline = [
            {
                $match: {
                    'unstruct_event.data.schema': 'iglu:nana.shop/app_action/jsonschema/1-0-0',
                    'unstruct_event.data.data.action': { $exists: true },
                    'unstruct_event.data.data.userId': { $nin: ['2', '3', '4'] }
                }
            },
            {
                $group: {
                    _id: '$unstruct_event.data.data.action',
                    count: { $sum: 1 }
                }
            }
        ];
        const results = await collection.aggregate(pipeline).toArray();
        const stats = {};
        for (const row of results) {
            stats[row._id] = row.count;
        }

        // Đếm số userId là 'guest' và khác 'guest'
        const userCountAgg = await collection.aggregate([
            {
                $match: {
                    'unstruct_event.data.schema': 'iglu:nana.shop/app_action/jsonschema/1-0-0',
                    'unstruct_event.data.data.userId': { $nin: ['2', '3', '4'] }
                }
            },
            {
                $group: {
                    _id: '$unstruct_event.data.data.userId',
                }
            }
        ]).toArray();
        let realUserCount = 0;
        let guestUserCount = 0;
        for (const row of userCountAgg) {
            if (row._id.slice(0, 5) !== 'guest') realUserCount++;
            else guestUserCount++;
        }

        res.json({ ...stats, realUserCount, guestUserCount });
    } catch (err) {
        console.error('Error in getAppActionStats:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
}
// API: GET /api/admin/app-action-active-users?from=2025-05-01T00:00:00Z&to=2025-05-30T23:59:59Z
// Returns: { activeUsers: n }
async function getAppActionActiveUsers(req, res) {
    const { from, to } = req.query;
    const client = new MongoClient(MONGO_URL);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION);
        const pipeline = [
            {
                $match: {
                    'unstruct_event.data.schema': 'iglu:nana.shop/app_action/jsonschema/1-0-0',
                    'unstruct_event.data.data.timestamp': { $gte: from, $lte: to },
                    'unstruct_event.data.data.userId': { $nin: ['2', '3', '4', 'undefined'], $exists: true, $ne: undefined } // loại bỏ userId 2 và 3F
                }
            },
            {
                $group: {
                    _id: '$unstruct_event.data.data.userId'
                }
            },
            {
                $count: 'activeUsers'
            }
        ];
        const results = await collection.aggregate(pipeline).toArray();
        res.json({ activeUsers: results[0]?.activeUsers || 0 });
    } catch (err) {
        console.error('Error in getAppActionActiveUsers:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
}

// ...existing code...
async function autoAnalyze(req, res) {
    try {
        const prompt = req.body.prompt;
        // Gọi GPT
        const geminiApiKey = 'AIzaSyCZYYw5CYNjhvRo5evKNOSJikNl7DaHlB4'; // Đặt key vào biến môi trường
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
        const systemPrompt = "Bạn là một chuyên gia phân tích dữ liệu và tối ưu hành vi người dùng cho website thương mại điện tử.";
        const geminiBody = {
            contents: [
                { parts: [{ text: `${systemPrompt}\n${prompt}` }] }
            ]
        };

        const response = await axios.post(geminiUrl, geminiBody, {
            headers: { 'Content-Type': 'application/json' }
        });
        const geminiMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ Gemini";
        res.json({ analysis: geminiMessage });

    } catch (err) {
        console.error('Gemini error:', err?.response?.data || err);
        if (err.response && err.response.status === 429) {
            res.status(429).json({ error: 'Bạn đang gửi quá nhiều yêu cầu đến AI, vui lòng thử lại sau.' });
        } else {
            res.status(500).json({ error: 'Gemini request failed', detail: err?.response?.data || err.message });
        }
    }
}

// Đừng quên export:
module.exports = {
    getEventActionStats, getEventActionTotalPrice, getFunnelAnalysis, getAppActionStats,
    getAppActionActiveUsers, autoAnalyze
};