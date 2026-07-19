import pinoHttp from "pino-http";
import logger from "../utils/logger";

const httpLogger = pinoHttp({
  logger,

  genReqId(req) {
    return req.headers["x-request-id"]?.toString() ?? crypto.randomUUID();
  },

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },

  customErrorMessage(req, res) {
    return `${req.method} ${req.url} failed with ${res.statusCode}`;
  },
});

export default httpLogger;
