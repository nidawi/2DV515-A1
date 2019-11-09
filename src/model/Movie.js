import Rating from "./Rating"; // eslint-disable-line no-unused-vars

export default class Movie {
  constructor(aId, aTitle, aYear) {
    this._id = aId;
    this._title = aTitle;
    this._year = aYear;
    this._score = undefined;
    this._sim = 0;

    /**
     * @type {{similarity:number, movie:Movie}[]}
     */
    this.similarMovies = undefined;
    /**
     * @type {Rating[]}
     */
    this.ratings = undefined;
    /**
     * @type {number}
     */
    this.id = undefined;
    /**
     * @type {string}
     */
    this.title = undefined;

    Object.defineProperties(this, {
      id: { get: () => this._id },
      title: { get: () => this._title }
    });
  }

  setRatings(aRatings) {
    this.ratings = aRatings;
  }

  getSimilarityFor(aMovie) {
    return this.similarMovies.find(a => a.movie === aMovie).similarity;
  }

  getSimilarity(aMovie) {
    return this.similarMovies.find(a => a.movie === aMovie);
  }

  getTotalWeightedScore() {
    return this.ratings.reduce((a, b) => a + b.getWeightedScore(), 0);
  }

  getTotalSimilarity() {
    return this.ratings.reduce((a, b) => a + b.user._sim, 0);
  }

  calculateMovieScore() {
    const result = this.getTotalWeightedScore() / this.getTotalSimilarity();

    return (this._score = result);
  }

  jsonify() {
    return {
      id: this.id,
      title: this._title,
      year: this._year,
      score: this._score.toFixed(4)
    };
  }
}
