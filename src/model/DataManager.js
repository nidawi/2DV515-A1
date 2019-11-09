import parse from "csv-parse";
import { createReadStream } from "fs";
import { EventEmitter } from "events";
import User from "./User";
import Movie from "./Movie";
import Rating from "./Rating";
import EuclideanMovie from "../lib/EuclideanMovie";

export default class DataManager extends EventEmitter {
  /**
   * Creates an instance of DataManager.
   * @param {string} usersPath
   * @param {string} ratingsPath
   * @param {string} moviesPath
   * @memberof DataManager
   */
  constructor(aUsersPath, aRatingsPath, aMoviesPath) {
    super();

    // Define class properties
    /**
     * @type {Map<number, User}
     */
    this._users = new Map();
    /**
     * @type {Rating[]}
     */
    this.ratings = undefined;
    /**
     * @type {Map<number, Movie>}
     */
    this._movies = new Map();

    // Start async loading of all files and fire an event once done.
    this._loadFilesAsync(aUsersPath, aRatingsPath, aMoviesPath);
  }

  /**
   * Returns the user with the provided id.
   * @param {number} aUserId
   * @returns {User}
   * @memberof DataManager
   */
  getUser(aUserId) {
    return this._users
      .get(aUserId);
  }

  /**
   * Returns all users.
   * @returns {User[]}
   * @memberof DataManager
   */
  getUsers() {
    return [...this._users.values()];
  }

  /**
   * Returns a list of users relevant for the provided user, aUser.
   * Allows sorting based on a provided metric function, such as Euclidean distance.
   * Metric function is provided with aUser as parameter 1,
   * and another user to compare to as parameter 2. See example.
   * The calculated similarity will attached to each user object as _sim.
   * @example aMetricFunc(aUser, aOtherUser) => similarity value
   * @todo refactor !!!
   * @param {User} aUser User to fetch relevant users for.
   * @param {Function} aMetricFunc A metric function.
   * @returns An array of relevant users.
   * @memberof DataManager
   */
  getUsersFor(aUser, aMetricFunc) {
    const users = [...this._users.values()]
      .filter(a => a !== aUser);

    users.forEach(a => {
      a._sim = aMetricFunc(aUser, a);
    });

    return users
      .sort((a, b) => b._sim - a._sim);
  }

  /**
   * Returns a list of movie recommendations for the provided user, aUser.
   * Allows sorting based on a provided metric function, such as Euclidean distance.
   * Metric function is provided with aUser as parameter 1,
   * and another user to compare to as parameter 2. See example.
   * Assigns the resulting score to each movie object as _score.
   * @example aMetricFunc(aUser, aOtherUser) => similarity value
   * @param {User} aUser
   * @param {Function} aMetricFunc
   * @param {number} [aLimit=3]
   * @returns {Movie[]}
   * @memberof DataManager
   */
  getMoviesFor(aUser, aMetricFunc, aLimit = 3) {
    const users = this.getUsersFor(aUser, aMetricFunc);
    const movies = [...new Set(
      users
        .map(a => a.ratings)
        .reduce((a, b) => [...a, ...b])
        .map(a => a.movie)
        .filter(a => !aUser.ratings.find(b => b._movieId === a._id))
    )];
    movies.forEach(a => a.calculateMovieScore());

    return movies
      .sort((a, b) => b._score - a._score)
      .slice(0, aLimit);
  }

  /**
   * Returns a list of matching movies for the provided movie, aMovie.
   * Euclidean Distance is the metric used to measure similarity.
   * The calculated similarity will attached to each movie object as _sim.
   * @param {Movie} aMovie
   * @returns
   * @memberof DataManager
   */
  getMatchingMoviesFor(aMovie) {
    const movies = [...this._movies.values()]
      .filter(a => a !== aMovie);

    movies.forEach(a => {
      a._sim = EuclideanMovie(aMovie, a);
    });

    return movies
      .sort((a, b) => b._sim - a._sim);
  }

  /**
   * Returns a list of movie recommendations for the provided user, aUser.
   * Recommendations are generated using item-based collaborative filtering,
   * with Euclidean distance as the similarity metric.
   * Assigns the resulting score to each movie object as _score.
   * @param {User} aUser
   * @param {number} [aLimit=3]
   * @returns {Movie[]}
   * @memberof DataManager
   */
  getItemBasedMoviesFor(aUser, aLimit = 3) {
    const movies = [...this._movies.values()] // get potential recommendations
      .filter(a => !aUser.hasRated(a))
      .map(a => ({
        movie: a,
        totalSim: 0,
        totalWR: 0,
        score: 0
      }));

    movies.forEach(a => {
      aUser.ratings.forEach(b => {
        const sim = a.movie.getSimilarityFor(b.movie);
        a.totalSim += sim;
        a.totalWR += (sim * b._rating);
      });
      a.movie._score = (a.totalWR / a.totalSim);
    });

    return movies
      .sort((a, b) => b.movie._score - a.movie._score)
      .map(a => a.movie)
      .slice(0, aLimit);
  }

  async _loadFilesAsync(aUsersPath, aRatingsPath, aMoviesPath) {
    const loadedFiles = await Promise.all([
      this._getFileData(aUsersPath),
      this._getFileData(aRatingsPath),
      this._getFileData(aMoviesPath)
    ]);

    // parse and add file data.
    // I guess that this part has a few rather brave assumptions.
    this.ratings = loadedFiles[1]
      .slice(1)
      .map((a) => new Rating(parseInt(a[0]), parseInt(a[1]), parseFloat(a[2])));

    loadedFiles[0]
      .slice(1)
      .map((a) => new User(parseInt(a[0]), a[1]))
      .forEach((a) => {
        // attach user-specific ratings to each user object
        a.setRatings(this.ratings.filter((b) => b._userId === a._id));
        this._users.set(a._id, a);
      });

    loadedFiles[2]
      .slice(1)
      .map((a) => new Movie(parseInt(a[0]), a[1], a[2]))
      .forEach((a) => {
        // attach movie-specific ratings to each movie object
        a.setRatings(this.ratings.filter(b => b._movieId === a._id));
        this._movies.set(a._id, a);
      });

    this._mergeObjects();
    this._transposeDataset();
    this.emit("done");
  }

  _getFileData(aFilePath) {
    return new Promise((resolve, reject) => {
      try {
        // define our parser
        const parser = parse({ delimiter: ';' }, (err, data) => {
          resolve(data);
        });

        // create a read stream and pipe the csv parser
        createReadStream(aFilePath).pipe(parser);
      } catch (err) {
        reject(err);
      }
    });
  }

  _mergeObjects() {
    // Merge objects into rating objects
    this.ratings
      .forEach((a) => {
        a.setMovie(this._movies.get(a._movieId));
        a.setUser(this._users.get(a._userId));
      });
  }

  _transposeDataset() {
    [...this._movies.values()]
      .forEach(a => {
        const matches = this.getMatchingMoviesFor(a);
        a.similarMovies = matches.map(b => ({
          similarity: parseFloat(b._sim.toFixed(4)),
          movie: b
        }));
      });
  }
}
