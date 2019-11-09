import express from "express";
import * as controller from "../controller/ApiController";

const router = express.Router();
// API routes.

router.route("/users")
  .get(async (req, res, next) => {
    try {
      const userResults = controller.doGetUsers();

      return res.send(JSON.stringify(userResults));
    } catch (err) {
      return next(err);
    }
  });

router.route("/metrics")
  .get(async (req, res) => (res.send(JSON.stringify(["euclidean", "pearson"]))));

router.route("/matches/:forUser")
  .get(async (req, res, next) => {
    try {
      const { forUser } = req.params;
      const { metric, limit } = req.query;
      const userResults = controller.doGetUsersFor(forUser, metric, limit);

      return res.send(JSON.stringify(userResults));
    } catch (err) {
      return next(err);
    }
  });

router.route("/movies/:forUser")
  .get(async (req, res, next) => {
    try {
      const { forUser } = req.params;
      const { metric, limit } = req.query;
      const movieResults = controller.doGetMoviesFor(forUser, metric, limit);

      return res.send(JSON.stringify(movieResults));
    } catch (err) {
      return next(err);
    }
  });

export default router;
