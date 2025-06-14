import re
import json

log = 'ecomerceshop    web     2025-05-27 16:59:12.164 2025-05-27 16:59:07.012 2025-05-27 16:59:06.792 unstruct        d42baab4-85e7-4f28-8b49-3aa589ecd75e             tracking_product        js-3.23.0       ssc-2.8.0-kafka snowplow-enrich-kafka-3.8.0              172.19.0.1              67340a4e-c523-413a-ab8e-507b304f28ee    15      2bd87ecc-abb2-466b-b2a2-eaf4dafaa15f                                                                                             http://localhost:3000/productDescription/5               http://localhost:3000/  http    localhost       3000    /productDescription/5           http     localhost       3000    /                                                                                       {"schema":"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1","data":[{"schema":"iglu:nana.shop/product_entity/jsonschema/1-0-0","data":{"id":"5","name":"Xiaomi Redmi Note 14 5G 8GB 256GB","price":10000,"currency":"VND","quantity":1,"category":"phone","size":"L"}},{"schema":"iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0","data":{"id":"06d77456-aefe-465f-8f07-ae68016d60a3"}},{"schema":"iglu:nana.shop/user_context/jsonschema/1-0-0","data":{"user_id":"undefined","user_name":"Bùi Đức Việt","phone_number":"366809157","email":"buiviet03756@gmail.com"}},{"schema":"iglu:nana.shop/user_context/jsonschema/1-0-0","data":{"user_id":"undefined","user_name":"Bùi Đức Việt","phone_number":"366809157","email":"buiviet03756@gmail.com"}}]}                                         {"schema":"iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1-0-0","data":{"schema":"iglu:nana.shop/product_action/jsonschema/1-0-0","data":{"action":"add_to_cart","productId":"5","userId":"user_1","timestamp":"2025-05-27T16:59:06.791Z"}}}                                      Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36          vi-VN                                                                            1       24      1280    631             1280     800     UTF-8   1272    1149                                                                                    2025-05-27 16:59:06.793                  {"schema":"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1","data":[{"schema":"iglu:nl.basjes/yauaa_context/jsonschema/1-0-4","data":{"deviceBrand":"Unknown","deviceName":"Desktop","operatingSystemVersionMajor":"??","layoutEngineNameVersion":"Blink 137","operatingSystemNameVersion":"Windows NT ??","agentInformationEmail":"Unknown","networkType":"Unknown","operatingSystemVersionBuild":"??","webviewAppNameVersionMajor":"Unknown ??","layoutEngineNameVersionMajor":"Blink 137","operatingSystemName":"Windows NT","agentVersionMajor":"137","layoutEngineVersionMajor":"137","webviewAppName":"Unknown","deviceClass":"Desktop","agentNameVersionMajor":"Chrome 137","operatingSystemNameVersionMajor":"Windows NT ??","deviceCpuBits":"64","webviewAppVersionMajor":"??","operatingSystemClass":"Desktop","webviewAppVersion":"??","layoutEngineName":"Blink","agentName":"Chrome","agentVersion":"137","layoutEngineClass":"Browser","agentNameVersion":"Chrome 137","operatingSystemVersion":"??","deviceCpu":"Intel x86_64","agentClass":"Browser","layoutEngineVersion":"137","agentInformationUrl":"Unknown"}}]}       61f3c286-d31c-4a6d-9c69-11d891b32451    2025-05-27 16:59:07.011  nana.shop       product_action  jsonschema      1-0-0'

# Regex lấy phần contexts (là JSON bắt đầu với "schema":"iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-1"
def extract_json_by_schema(log, schema_str):
    # Tìm vị trí schema trong log
    start = log.find(schema_str)
    if start == -1:
        return None

    # Lùi lại tìm dấu { đầu tiên trước schema
    brace_open_pos = log.rfind('{', 0, start)
    if brace_open_pos == -1:
        return None

    # Đếm ngoặc để tìm phần JSON đúng đóng
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

contexts_json_str = extract_json_by_schema(log, contexts_schema)
unstruct_json_str = extract_json_by_schema(log, unstruct_schema)

if contexts_json_str:
    try:
        contexts_json = json.loads(contexts_json_str)
        print("contexts:")
        print(json.dumps(contexts_json, indent=4, ensure_ascii=False))
    except Exception as e:
        print("Failed to parse contexts:", e)

if unstruct_json_str:
    try:
        unstruct_json = json.loads(unstruct_json_str)
        print("\nunstruct_event:")
        print(json.dumps(unstruct_json, indent=4, ensure_ascii=False))
    except Exception as e:
        print("Failed to parse unstruct_event:", e)