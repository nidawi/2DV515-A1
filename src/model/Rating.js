export default class Rating {
  constructor(aUserId, aMovieId, aRating) {
    this._userId = aUserId;
    this._movieId = aMovieId;
    this._rating = aRating;

    this.user = undefined;
    this.movie = undefined;
  }

  setMovie(aMovie) {
    this.movie = aMovie;
  }

  setUser(aUser) {
    this.user = aUser;
  }

  getWeightedScore() {
    return (this._rating || 0) * (this.user._sim || 0);
  }
}
