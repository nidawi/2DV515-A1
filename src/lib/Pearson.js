export default function (aUserA, aUserB) {
  let sumA = 0;
  let sumB = 0;
  let sumAsq = 0;
  let sumBsq = 0;
  let pSum = 0;

  let ratingMatches = 0;

  aUserA.ratings.forEach((a) => {
    const match = aUserB
      .ratings
      .find((b) => a.movie._id === b.movie._id);

    if (match) {
      sumA += a._rating;
      sumB += match._rating;
      sumAsq += a._rating ** 2;
      sumBsq += match._rating ** 2;
      pSum += a._rating * match._rating;

      ratingMatches++;
    }
  });

  if (ratingMatches === 0) return 0;

  const num = pSum - (sumA * sumB / ratingMatches);
  const den = Math.sqrt(
    (sumAsq - sumA ** 2 / ratingMatches) * (sumBsq - sumB ** 2 / ratingMatches)
  );

  if (num < 0) return 0; // I don't know why this is necessary.

  return num / den;
}
