FROM python:3.10-slim

WORKDIR /app

COPY parse.py . 

RUN pip install flask kafka-python pandas psycopg2-binary
RUN pip install kafka-python pandas pymongo
EXPOSE 5000

CMD ["python", "parse.py"]