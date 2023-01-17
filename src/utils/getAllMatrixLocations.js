import { getDimensions } from "functional-game-utils";

function getAllMatrixLocations(matrix) {
  const dimensions = getDimensions(matrix);

  const locations = [];

  for (let row = 0; row < dimensions.height; row += 1) {
    for (let col = 0; col < dimensions.width; col += 1) {
      locations.push({ row, col });
    }
  }

  return locations;
}

export default getAllMatrixLocations;
