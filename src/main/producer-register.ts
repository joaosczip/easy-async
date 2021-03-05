import { Producer, Register } from "../protocols";

export class ProducerRegister implements Register<Producer> {
  private providers: {
    provider: Producer;
    driver: string;
  }[] = [];

  getProviders(): {
    provider: Producer;
    driver: string;
  }[] {
    return this.providers;
  }

  registry(provider: Producer, driver: string): void {
    this.providers.push({ provider, driver });
  }
}
