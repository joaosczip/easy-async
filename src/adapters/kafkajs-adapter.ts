import { CompressionTypes, Kafka } from "kafkajs";

import { DriverConfig } from "..";
import { Producer, ProducerParams } from "../protocols";

export class KafkaJsAdapter implements Producer {
  private client: Kafka;

  async setUp({ port, host }: DriverConfig): Promise<void> {
    try {
      this.client = new Kafka({
        brokers: [`${host}:${port}`],
      });
    } catch (error) {
      throw new Error(`Unable to connect: ${error.message}`);
    }
  }

  async produce({ key, destiny, data }: ProducerParams): Promise<void> {
    if (!this.client) {
      throw new Error("Please set up a connection first");
    }

    const producer = this.client.producer();
    await producer.connect();
    await producer.send({
      topic: destiny,
      messages: [
        {
          key,
          value: Buffer.from(data),
        },
      ],
      compression: CompressionTypes.GZIP,
    });
  }
}
