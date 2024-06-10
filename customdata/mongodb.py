import pymongo
import pprint

# Kết nối với MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["snowplow"]
collection = db["events"]

# Truy vấn tất cả các tài liệu trong collection
documents = collection.find()

# Hiển thị các tài liệu
for doc in documents:
    pprint.pprint(doc)
