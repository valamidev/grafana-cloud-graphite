require("dotenv").config();

import { GraphiteMetrics } from "../src/handlers/metricsHandler";

const Metrics = new GraphiteMetrics({
  userId: process.env.GC_USER as string,
  token: process.env.GC_ACCESS_TOKEN as string,
  ingestEndpointURL: process.env.GC_GRAPHITE_INGEST as string,
  namespace: "e2e",
});

const start = async () => {
  Metrics.on("error", (err) => {
    console.error(err);
  });

  const stepper = Metrics.registerCounter("server1.stepper", 5000);

  const counter = Metrics.registerCounter("server1.counter", 5000);

  const stepper2 = Metrics.registerCounter("server2.stepper", 5000);

  const counter2 = Metrics.registerCounter("server2.counter", 5000);

  setInterval(() => {
    stepper.inc();
  }, 1000);

  setInterval(() => {
    counter.inc(10);
  }, 1000);

  setInterval(() => {
    stepper2.inc(3);
  }, 1000);

  setInterval(() => {
    counter2.inc(15);
  }, 1000);
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
