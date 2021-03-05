import { DriverConfig } from "../index";

export default [
  {
    driver: "kafka",
    host: "localhost",
    port: 9092,
    default: true,
  },
  {
    driver: "rabbitmq",
    host: "localhost",
    port: 5672,
  },
] as DriverConfig[];
