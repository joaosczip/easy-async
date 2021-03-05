import { path } from "app-root-path";
import { readFileSync } from "fs";

import { DriverConfig } from "..";
import { Producer, ProducerParams, Register } from "../protocols";

const providers = JSON.parse(
  readFileSync(`${path}/asynconfig.json`).toString()
) as DriverConfig[];

export class Dispatcher {
  private producer: Producer | undefined;

  constructor(private readonly register: Register<Producer>) {}

  private findProducer(driverName: string): Producer | undefined {
    const providers = this.register.getProviders();
    const producer = providers.find(({ driver }) => driver === driverName);
    return producer?.provider;
  }

  private findDriverConfig(driverName: string): DriverConfig | undefined {
    return providers.find(({ driver }) => driver === driverName);
  }

  usingDriver(driver: string): Dispatcher {
    const config = this.findDriverConfig(driver);

    if (!config) {
      throw new Error(`No config was found for the given driver`);
    }

    this.producer = this.findProducer(driver);

    if (!this.producer) {
      throw new Error(`No provider for the driver ${driver} was found`);
    }

    return this;
  }

  async produce(params: ProducerParams): Promise<void> {
    await this.producer?.produce(params);
  }
}
