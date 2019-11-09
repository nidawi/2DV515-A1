import Rating from "./Rating"; // eslint-disable-line no-unused-vars

export default class User {
  /**
   * Creates an instance of User.
   * @param {number} aId
   * @param {string} aName
   * @memberof User
   */
  constructor(aId, aName) {
    this._id = aId;
    this._name = aName;
    this._sim = 0;

    /**
     * @type {Rating[]}
     */
    this.ratings = undefined;
  }

  setRatings(aRatings) {
    this.ratings = aRatings;
  }

  getMovies() {
    return this.ratings
      .map(a => a.movie);
  }

  hasRated(aMovie) {
    return this.ratings.find(a => a.movie === aMovie);
  }

  getRatings(aExcludedMovies) {
    const result = (aExcludedMovies)
      ? this.ratings.filter((b) => !aExcludedMovies.find((a) => a === b.movie))
      : this.ratings;

    return result;
  }

  jsonify() {
    return {
      name: this._name,
      id: this._id,
      similarity: this._sim.toFixed(3)
    };
  }
}
