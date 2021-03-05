import { Channel, connect } from "amqplib";

import { DriverConfig } from "..";
import { Producer, ProducerParams } from "../protocols";

export class AMQPLibAdapter implements Producer {
  private channel: Channel;

  async setUp({ host, port }: DriverConfig): Promise<void> {
    try {
      const connection = await connect({
        hostname: host,
        port,
      });
      this.channel = await connection.createChannel();
    } catch (error) {
      throw new Error(`Unable to connect: ${error.message}`);
    }
  }

  async produce({ key, destiny, data }: ProducerParams): Promise<void> {
    if (!this.channel) {
      throw new Error("Please set up a connection first");
    }

    await this.channel.assertExchange(destiny, "topic", {
      durable: true,
    });
    this.channel.publish(destiny, key, Buffer.from(data));
  }
}
