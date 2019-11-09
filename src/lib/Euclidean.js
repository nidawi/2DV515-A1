import User from "../model/User"; // eslint-disable-line no-unused-vars

/**
 * awd
 * @export
 * @param {User} aUser1
 * @param {User} aUser2
 */
export default function (aUserA, aUserB) {
  let similarityScore = 0;
  let ratingMatches = 0;

  aUserA.ratings.forEach((a) => {
    const match = aUserB
      .ratings
      .find((b) => a.movie._id === b.movie._id);

    if (match) {
      similarityScore += (a._rating - match._rating) ** 2;
      ratingMatches++;
    }
  });

  return ratingMatches > 0
    ? 1 / (1 + similarityScore)
    : 0;
}
