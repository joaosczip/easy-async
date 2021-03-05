import "module-alias/register";

import { AMQPLibAdapter, KafkaJsAdapter } from "../adapters";
import configs from "../config/providers";
import { ProducerRegister } from "../main/producer-register";
import { Dispatcher } from "../main/dispatcher";

const producerRegister = new ProducerRegister();
producerRegister.registry(new KafkaJsAdapter(), "kafka");
producerRegister.registry(new AMQPLibAdapter(), "rabbitmq");

const bootstrap = () => {
  return async () => {
    for (const { provider, driver } of producerRegister.getProviders()) {
      const config = configs.find((config) => config.driver === driver);
      if (config) {
        await provider.setUp(config);
      }
    }

    const dispatcher = new Dispatcher(producerRegister);
    return dispatcher;
  };
};

export default bootstrap();
