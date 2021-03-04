import { DriverConfig } from "..";

export type ProducerParams = {
  key: string;
  destiny: string;
  data: any;
};

export interface Producer {
  setUp: (config: DriverConfig) => Promise<void>;
  produce: (params: ProducerParams) => Promise<void>;
}
