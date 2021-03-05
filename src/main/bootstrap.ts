import "module-alias/register";
import { path } from "app-root-path";
import { readFileSync } from "fs";

import { AMQPLibAdapter, KafkaJsAdapter } from "../adapters";
import { ProducerRegister } from "../main/producer-register";
import { Dispatcher } from "../main/dispatcher";
import { DriverConfig } from "..";

const configs = JSON.parse(
  readFileSync(`${path}/asynconfig.json`).toString()
) as DriverConfig[];

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

    return new Dispatcher(producerRegister, configs);
  };
};

export const initDispatcher = bootstrap();
