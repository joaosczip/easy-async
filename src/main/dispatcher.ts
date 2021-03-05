import { DriverConfig } from "..";
import { Producer, ProducerParams, Register } from "../protocols";
export class Dispatcher {
  private producer: Producer | undefined;

  constructor(
    private readonly register: Register<Producer>,
    private readonly configs: DriverConfig[]
  ) {
    this.setDefaultProducer();
  }

  private findProducer(driverName: string): Producer | undefined {
    const providers = this.register.getProviders();
    const producer = providers.find(({ driver }) => driver === driverName);
    return producer?.provider;
  }

  private setDefaultProducer(): void {
    const { driver } =
      this.configs.find((config) => config.default) || this.configs[0];
    this.producer = this.findProducer(driver);
  }

  private findDriverConfig(driverName: string): DriverConfig | undefined {
    return this.configs.find(({ driver }) => driver === driverName);
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
