import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";

import api from "../routes/api";

const app = express();
const server = http.createServer(app);

const setupApp = () => {
  // By default, this is a RESTFul service and therefore communicates using JSON.
  // There is also no "additional" security such as tokens, etc.
  app.use((req, res, next) => {
    res
      .type("application/json");

    next();
  });

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // helmet?

  app.use("/api", api);

  // Invalid route / Error
  app.use((req, res, next) => next(new Error(404)));
  app.use((err, req, res) => res.sendStatus(500));

  return app;
};

export default function createServer() {
  setupApp();

  return server;
}
