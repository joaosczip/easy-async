import { AMQPLibAdapter, KafkaJsAdapter } from "@/adapters";
import configs from "@/config/providers";
import { ProducerRegister } from "@/main/producer-register";
import { Dispatcher } from "@/main/dispatcher";

const producerRegister = new ProducerRegister();
producerRegister.registry(new KafkaJsAdapter(), "kafka");
producerRegister.registry(new AMQPLibAdapter(), "rabbitmq");

for (const { provider, driver } of producerRegister.getProviders()) {
  const config = configs.find((config) => config.driver === driver);
  if (config) {
    provider.setUp(config);
  }
}

const dispatcher = new Dispatcher(producerRegister);
export { dispatcher };
