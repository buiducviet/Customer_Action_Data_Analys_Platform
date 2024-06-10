import requests
import json
import csv
import pymongo

# URL để lấy dữ liệu
url = 'http://localhost:9090/micro/good'

# Gửi yêu cầu GET đến URL và lấy dữ liệu
response = requests.get(url)
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["snowplow"]
collection = db["events"]
# Kiểm tra mã trạng thái của phản hồi
if response.status_code == 200:
    data = response.json()
    
    # Xử lý từng sự kiện trong dữ liệu
    results = []
    for event in data:
        # Lấy các thông tin cần thiết từ raw event
        event_name = event['event']['event_name']
        timestamp = event['event']['etl_tstamp']
        contexts = event['event'].get('contexts', {}).get('data', [])
        action = event['event']['unstruct_event']['data']['data']['action']

        nana_shop_data = []
        for item in contexts:
            schema = item.get('schema', '')
            if schema.startswith('iglu:nana.shop'):
                schema_parts = schema.split('/')
                if len(schema_parts) > 1:
                    data_type = schema_parts[-3]  # Phần sau dấu `/`
                    nana_shop_data.append((data_type, item['data']))

        result = {
            "Event Name": event_name,
            "Timestamp": timestamp,
            "Action": action,
            "Nana Shop Data": nana_shop_data
        }
        
        results.append(result)
        collection.insert_one(result)


    # In kết quả
    for res in results:
        print(f"Event: {res['Event Name']}")
        print(f"Timestamp: {res['Timestamp']}")
        print(f"Action: {res['Action']}")
        print("Data with schema starting with 'iglu:nana.shop':")
        for data_type, data in res['Nana Shop Data']:
            print("Type:", data_type)
            print("Data:", data)
        print("\n")
        
    
    # Ghi kết quả vào tệp TSV
    with open('output.tsv', 'w', newline='') as file:
        writer = csv.writer(file, delimiter='\t')
        # Ghi tiêu đề
        writer.writerow(["Event Name", "Timestamp", "Action", "Data Type", "Data"])
        # Ghi từng dòng dữ liệu
        for res in results:
            for data_type, data in res['Nana Shop Data']:
                writer.writerow([res['Event Name'], res['Timestamp'], res['Action'], data_type, json.dumps(data)])
    
    print("Dữ liệu đã được ghi vào tệp output.tsv")
else:
    print(f"Request failed with status code {response.status_code}")
