export interface Register<T> {
  registry: (provider: T, driver: string) => void;
  getProviders: () => { provider: T; driver: string }[];
}
