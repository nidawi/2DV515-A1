// Todo: merge into other euclidean and make general
export default function (aMovieA, aMovieB) {
  let similarityScore = 0;
  let ratingMatches = 0;

  aMovieA.ratings.forEach((a) => {
    const match = aMovieB
      .ratings
      .find((b) => a.user._id === b.user._id);

    if (match) {
      similarityScore += (a._rating - match._rating) ** 2;
      ratingMatches++;
    }
  });

  return ratingMatches > 0
    ? 1 / (1 + similarityScore)
    : 0;
}
