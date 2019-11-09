import Euclidean from "../lib/Euclidean";
import Pearson from "../lib/Pearson";
import DataManager from "../model/DataManager"; // eslint-disable-line

const controllerVars = {
  /**
   * @type {DataManager}
   */
  dataManager: undefined
};

const getMetricFor = query => {
  switch ((query || "").toLowerCase()) {
    case "euclidean":
      return Euclidean;
    case "pearson":
      return Pearson;
    default:
      throw new Error(401);
  }
};

export function setDataManager(aDataManager) {
  controllerVars.dataManager = aDataManager;
}

export function doGetUsers() {
  return controllerVars.dataManager
    .getUsers()
    .map(a => a.jsonify());
}

export function doGetUsersFor(aUser, aMetric, aLimit) {
  const user = controllerVars.dataManager
    .getUser(parseInt(aUser));

  return controllerVars.dataManager
    .getUsersFor(user, getMetricFor(aMetric))
    .map(a => a.jsonify())
    .slice(0, aLimit <= 0 ? undefined : aLimit);
}

const doGetMoviesForUserBased = (aUser, aMetric, aLimit) => {
  const user = controllerVars.dataManager
    .getUser(parseInt(aUser));

  return controllerVars.dataManager
    .getMoviesFor(user, getMetricFor(aMetric), aLimit)
    .map(a => a.jsonify());
};

const doGetMoviesForItemBased = (aUser, aLimit) => {
  const user = controllerVars.dataManager
    .getUser(parseInt(aUser));

  return controllerVars.dataManager
    .getItemBasedMoviesFor(user, aLimit)
    .map(a => a.jsonify());
};

export function doGetMoviesFor(aUser, aMetric, aLimit) {
  return aMetric === "ib"
    ? doGetMoviesForItemBased(aUser, aLimit <= 0 ? undefined : aLimit)
    : doGetMoviesForUserBased(aUser, aMetric, aLimit <= 0 ? undefined : aLimit);
}
