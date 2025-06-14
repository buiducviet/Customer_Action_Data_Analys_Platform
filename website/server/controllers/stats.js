const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGO_DB || 'snowplow';
const COLLECTION = process.env.MONGO_COLLECTION || 'events';

async function main() {
  const client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);
    const cursor = collection.find();
    const stats = {}; // product_action
    const appActionStats = {}; // app_action
    const appActionUserIds = new Set(); // userId trong app_action
    const appActionViewPageSet = new Set(); // Lưu cặp userId-timestamp cho view_page
    const contextStats = {};
    let recordCount = 0;
    for await (const doc of cursor) {
      const unstruct = doc.unstruct_event;
      let action = null;
      let unstructData = null;
      // Thống kê product_action
      if (
        unstruct &&
        unstruct.data &&
        unstruct.data.schema === 'iglu:nana.shop/product_action/jsonschema/1-0-0' &&
        unstruct.data.data && unstruct.data.data.action
      ) {
        action = unstruct.data.data.action;
        stats[action] = (stats[action] || 0) + 1;
        unstructData = unstruct.data.data;
      }
      // Thống kê app_action
      if (
        unstruct &&
        unstruct.data &&
        unstruct.data.schema === 'iglu:nana.shop/app_action/jsonschema/1-0-0' &&
        unstruct.data.data && unstruct.data.data.action
      ) {
        const appAction = unstruct.data.data.action;
        appActionStats[appAction] = (appActionStats[appAction] || 0) + 1;
        if (unstruct.data.data.userId) {
          appActionUserIds.add(unstruct.data.data.userId);
        }
        // Chỉ lấy duy nhất 1 view_page cho mỗi userId-timestamp
        if (appAction === 'view_page' && unstruct.data.data.userId && unstruct.data.data.timestamp) {
          const key = `${unstruct.data.data.userId}_${unstruct.data.data.timestamp}`;
          appActionViewPageSet.add(key);
        }
      }
      // Contexts
      const contexts = doc.contexts && doc.contexts.data ? doc.contexts.data : [];
      const contextTypes = [];
      const contextDetails = [];
      for (const ctx of contexts) {
        if (ctx && ctx.schema) {
          // Extract type from schema string
          const match = ctx.schema.match(/nana.shop\/(.*?)\//);
          const type = match ? match[1] : ctx.schema;
          contextTypes.push(type);
          contextStats[type] = (contextStats[type] || 0) + 1;
          contextDetails.push({ type, data: ctx.data });
        }
      }
      // Print details for each record
      if (action || contextTypes.length > 0) {
        recordCount++;
        console.log(`\n--- Record #${recordCount} ---`);
        if (action) console.log(`Action: ${action}`);
        if (unstructData) console.log('Unstruct Event Data:', JSON.stringify(unstructData, null, 2));
        if (contextDetails.length > 0) {
          console.log('Contexts:');
          for (const ctx of contextDetails) {
            console.log(`  - Type: ${ctx.type}`);
            console.log(`    Data: ${JSON.stringify(ctx.data, null, 2)}`);
          }
        }
      }
    }
    // Summary
    console.log('\nThống kê số lượng product_action:');
    for (const [action, count] of Object.entries(stats)) {
      console.log(`${action}: ${count}`);
    }
    console.log('\nThống kê số lượng app_action:');
    for (const [action, count] of Object.entries(appActionStats)) {
      console.log(`${action}: ${count}`);
    }
    console.log(`\nTổng số userId khác nhau trong app_action: ${appActionUserIds.size}`);
    console.log(`\nTổng số view_page duy nhất (userId-timestamp): ${appActionViewPageSet.size}`);
    console.log('\nThống kê số lượng context:');
    for (const [type, count] of Object.entries(contextStats)) {
      console.log(`${type}: ${count}`);
    }
  } catch (err) {
    console.error('Lỗi:', err);
  } finally {
    await client.close();
  }
}

main();