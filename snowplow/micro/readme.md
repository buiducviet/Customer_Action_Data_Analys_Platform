B1: tạo một thư mục mới tên micro trong folder code của bạn, rồi đặt tất cả các file này trong folder đó

B2: chạy lệnh
docker run -p 9090:9090 \
  --mount type=bind,source={path to shemas folder} \
  snowplow/snowplow-micro:2.0.0
