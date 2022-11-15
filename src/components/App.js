import styled, { ThemeProvider } from "styled-components";
import React, { useEffect, useState } from "react";
import Grid from "./Grid";
import {
  compareLocations,
  constructMatrix,
  getLocation,
} from "functional-game-utils";
import characters from "../data/characters";
import shield from "../../assets/images/shield.png";
import shuffle from "../utils/shuffle";
import wait from "../utils/wait";

const theme = {
  tileSize: 128,
  imageSize: 72,
};

const charKeys = Object.keys(characters).filter(
  (characterKey) => characterKey !== "fredric"
);

let cards = [];
for (let charKey of charKeys) {
  cards.push(charKey);
  cards.push(charKey);
}

cards.push("fredric");

const shuffledCards = shuffle(cards);

const dimensions = {
  width: 5,
  height: 5,
};
const initialTiles = constructMatrix((location) => {
  const index = location.row * dimensions.width + location.col;

  return { icon: ".", character: shuffledCards[index] };
}, dimensions);

const Tile = styled.div`
  border: 1px solid black;
  padding: 1rem;
`;

const Card = styled.img`
  width: ${(props) => `${props.theme.imageSize}px`};
  height: ${(props) => `${props.theme.imageSize}px`};
  image-rendering: pixelated;
`;

const UNSELECTED = {
  row: -1,
  col: -1,
};

const App = () => {
  const [tiles, setTiles] = useState(initialTiles);
  const [firstClickedLocation, setFirstClickedLocation] = useState(UNSELECTED);
  const [secondClickedLocation, setSecondClickedLocation] =
    useState(UNSELECTED);
  const [revealed, setRevealed] = useState([]);

  useEffect(() => {
    const areBothLocationsClicked =
      firstClickedLocation.row !== -1 && secondClickedLocation.row !== -1;

    if (areBothLocationsClicked) {
      const evaluate = async () => {
        const firstValue = getLocation(tiles, firstClickedLocation);
        const secondValue = getLocation(tiles, secondClickedLocation);
        const areLocationsSame = firstValue.character === secondValue.character;

        if (areLocationsSame) {
          revealed.push(firstClickedLocation);
          revealed.push(secondClickedLocation);
        } else {
        }

        await wait(500);

        setFirstClickedLocation(UNSELECTED);
        setSecondClickedLocation(UNSELECTED);
      };

      setTimeout(evaluate, 500);
    }
  }, [firstClickedLocation, secondClickedLocation]);

  return (
    <ThemeProvider theme={theme}>
      <h1>SurlyDev's TQ Character Match-a-thon</h1>
      <Grid
        tiles={tiles}
        renderTile={(tile, location) => {
          const isRevealed =
            compareLocations(firstClickedLocation, location) ||
            compareLocations(secondClickedLocation, location) ||
            revealed.some((revealedLocation) =>
              compareLocations(revealedLocation, location)
            );
          const cardSrc = isRevealed ? characters[tile.character] : shield;

          return (
            <Tile
              key={JSON.stringify(location)}
              onClick={() => {
                if (firstClickedLocation.row === -1) {
                  setFirstClickedLocation(location);
                } else if (secondClickedLocation.row === -1) {
                  setSecondClickedLocation(location);
                }
              }}
            >
              <Card src={cardSrc} />
            </Tile>
          );
        }}
      />
    </ThemeProvider>
  );
};

export default App;
