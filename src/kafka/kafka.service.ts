import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IngestionService } from '../ingestion/ingestion.service';
import { IngestionStatus } from '../ingestion/ingestion.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const { KAFKA_BROKER, KAFKA_CLIENT_ID } = process.env;

/**
 * Service for producing messages to Kafka topics.
 * Manages connection to a Kafka broker and sends messages using the kafkajs library.
 */
@Injectable()
export class KafkaService {
  private readonly producer: Producer;
  private readonly kafka: Kafka;
  private readonly ingestionService: IngestionService;

  /**
   * Initializes the Kafka client and producer with configuration from environment variables.
   * @param configService - Service to access environment variables.
   */
  constructor() {
    // Retrieve Kafka configuration from environment variables or use defaults.
    this.kafka = new Kafka({
      clientId: KAFKA_CLIENT_ID,
      brokers: [KAFKA_BROKER],
      retry: {
        maxRetryTime: 30000,
        initialRetryTime: 1000,
        retries: 5,
      },
    });
    // Create Kafka producer instance.
    this.producer = this.kafka.producer();
    // Initiate connection to Kafka broker.
    this.connect();
  }

  /**
   * Establishes connection to the Kafka broker.
   * Called during service initialization.
   */
  private async connect() {
    // Connect the producer to the Kafka broker.
    await this.producer.connect();
  }

  /**
   * Sends a message to a specified Kafka topic.
   *
   * @param topic - The Kafka topic to send the message to.
   * @param message - The message payload to send (serialized to JSON).
   * @returns A Promise that resolves when the message is sent.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async send(topic: string, message: any) {
    // Send the message to the specified topic, serializing the payload to JSON.
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log('Message sent successfully =======>');
  }

  @MessagePattern('document.ingest.status')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handleStatusMessage(@Payload() message: any) {
    const value = message.value;

    const ingestionId = value.ingestionId;
    const status = value.status as IngestionStatus;
    const log = value.log || '';

    console.log(`[Kafka] Status update for ${ingestionId}: ${status}`);

    await this.ingestionService.updateIngestionStatus(ingestionId, status, log);
  }
}
