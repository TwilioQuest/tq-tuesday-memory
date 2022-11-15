/**
 * Pulled this implementation of the "Fisher-Yates (aka Knuth) Shuffle"
 * https://stackoverflow.com/a/2450976
 */

function shuffle(array) {
  let shuffledArray = [...array];
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ];
  }

  return shuffledArray;
}

export default shuffle;
