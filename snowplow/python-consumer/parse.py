from kafka import KafkaConsumer
import json
from pymongo import MongoClient
import os

# MongoDB connection setup
mongo_host = os.environ.get("MONGO_HOST", "mongodb")
mongo_port = int(os.environ.get("MONGO_PORT", 27017))
mongo_db = os.environ.get("MONGO_DB", "snowplow")
mongo_collection = os.environ.get("MONGO_COLLECTION", "events")

client = MongoClient(host=mongo_host, port=mongo_port)
db = client[mongo_db]
collection = db[mongo_collection]

# Kafka consumer setup
consumer = KafkaConsumer(
    'enriched-events',
    bootstrap_servers=[os.environ.get('KAFKA_BOOTSTRAP_SERVERS', 'localhost:29092')],
    auto_offset_reset='earliest',
    enable_auto_commit=False,
    group_id='python-consumer-group',
    value_deserializer=lambda x: x.decode('utf-8')
)

def extract_json_by_schema(log, schema_str):
    start = log.find(schema_str)
    if start == -1:
        return None
    brace_open_pos = log.rfind('{', 0, start)
    if brace_open_pos == -1:
        return None
    count = 0
    end_pos = -1
    for i in range(brace_open_pos, len(log)):
        if log[i] == '{':
            count += 1
        elif log[i] == '}':
            count -= 1
            if count == 0:
                end_pos = i
                break
    if end_pos == -1:
        return None
    json_str = log[brace_open_pos:end_pos+1]
    return json_str

contexts_schema = 'iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1'
unstruct_schema = 'iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0'

print("Đang lắng nghe enriched-events từ Kafka và đẩy vào MongoDB...")

for message in consumer:
    raw_value = message.value
    contexts_json = None
    unstruct_json = None
    contexts_json_str = extract_json_by_schema(raw_value, contexts_schema)
    unstruct_json_str = extract_json_by_schema(raw_value, unstruct_schema)

    if contexts_json_str:
        try:
            contexts_json = json.loads(contexts_json_str)
        except Exception as e:
            print("Failed to parse contexts:", e)
    if unstruct_json_str:
        try:
            unstruct_json = json.loads(unstruct_json_str)
        except Exception as e:
            print("Failed to parse unstruct_event:", e)

    # Only insert if at least one part is present
    if contexts_json or unstruct_json:
        record = {
            "contexts": contexts_json,
            "unstruct_event": unstruct_json
        }
        collection.insert_one(record)
        print(f"Đã insert 1 record vào MongoDB: {record}")
    else:
        print("Không tìm thấy dữ liệu hợp lệ trong message.")