from kafka import KafkaConsumer, KafkaProducer
from PIL import Image
from moviepy.editor import VideoFileClip
import os
import json

print("[🚀] Starting Python ingestion service...")

# Directories
UPLOAD_DIR = './uploads'
PROCESSED_DIR = './processed'

print(f"[📁] Setting up directories...")
os.makedirs(PROCESSED_DIR, exist_ok=True)
print(f"[✅] Uploads directory: {UPLOAD_DIR}")
print(f"[✅] Processed directory: {PROCESSED_DIR}")

# Supported file types
IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.bmp']
VIDEO_EXT = ['.mp4', '.mov', '.avi', '.mkv']

# Helper functions
def is_image(file_path):
    return any(file_path.lower().endswith(ext) for ext in IMAGE_EXT)

def is_video(file_path):
    return any(file_path.lower().endswith(ext) for ext in VIDEO_EXT)

def process_image(file_path, output_path):
    try:
        with Image.open(file_path) as img:
            resized = img.resize((640, 480))
            resized.save(output_path)
            print(f"[✔] Resized image saved to: {output_path}")
    except Exception as e:
        raise Exception(f"Image processing failed: {e}")

def process_video(file_path, output_path):
    try:
        clip = VideoFileClip(file_path)
        resized_clip = clip.resize(height=480)  # Keep aspect ratio
        resized_clip.write_videofile(output_path, codec='libx264', logger=None)
        print(f"[✔] Resized video saved to: {output_path}")
    except Exception as e:
        raise Exception(f"Video processing failed: {e}")

# Kafka setup
print("[🔌] Connecting to Kafka broker at comdockerdocker-kafka-1:9092...")

producer = KafkaProducer(
    bootstrap_servers='comdockerdocker-kafka-1:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)
print("[✅] Kafka producer initialized.")

def send_kafka_message(ingestion_id, status, log):
    producer.send('status-topic', {
        "ingestionId": ingestion_id,
        "status": status,
        "log": log
    })
    print(f"[📤] Status sent to Kafka: {status} - {log}")

print("[🧲] Subscribing to Kafka topic 'documents-topic'...")

consumer = KafkaConsumer(
    'documents-topic',
    bootstrap_servers='comdockerdocker-kafka-1:9092',
    group_id='media-processor-v3',
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

print("[🎧] Python ingestion service is listening to Kafka topic 'documents-topic'...")
print("[🔍] Available topics:", consumer.topics())

for msg in consumer:
    print("[📥] Message received from Kafka topic.")

    data = msg.value
    print(f"[🧾] Raw message content: {data}")

    file_path = data.get('filePath')
    document_id = data.get('documentId')
    ingestion_id = data.get('ingestionId')

    if not file_path or not document_id:
        print("[⚠️] Skipping message: Missing filePath or documentId")
        continue

    filename = os.path.basename(file_path)
    full_input_path = os.path.join(UPLOAD_DIR, filename)
    output_path = os.path.join(PROCESSED_DIR, f"resized_{filename}")

    print(f"[📂] Looking for file: {full_input_path}")
    print(f"[📦] Processing file: {filename} for documentId: {document_id}")

    if not os.path.exists(full_input_path):
        log = f"File does not exist: {full_input_path}"
        print(f"[❌] {log}")
        send_kafka_message(document_id, "FAILED", log)
        continue

    try:
        if is_image(file_path):
            process_image(full_input_path, output_path)
        elif is_video(file_path):
            process_video(full_input_path, output_path)
        else:
            raise ValueError(f"Unsupported file type: {file_path}")

        send_kafka_message(document_id, "COMPLETED", "File processed and saved successfully.")
    except Exception as e:
        error_log = str(e)
        print(f"[✘] {error_log}")
        send_kafka_message(document_id, "FAILED", error_log)
