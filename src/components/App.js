import styled, { ThemeProvider } from "styled-components";
import React, { useEffect, useState } from "react";
import Grid from "./Grid";
import {
  compareLocations,
  constructMatrix,
  getLocation,
  updateMatrix,
} from "functional-game-utils";
import characters from "../data/characters";
import shield from "../../assets/images/shield.png";
import shuffle from "../utils/shuffle";
import wait from "../utils/wait";
import usePrevious from "../utils/usePrevious";
import getAllMatrixLocations from "../utils/getAllMatrixLocations";

const fredricShufflePenalty = false;

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
  object-fit: contain;
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
  const prevRevealed = usePrevious(revealed);

  useEffect(() => {
    const evaluate = async () => {
      const isFirstClicked = firstClickedLocation.row !== -1;
      const isSecondClicked = secondClickedLocation.row !== -1;
      const areBothLocationsClicked = isFirstClicked && isSecondClicked;

      let firstValue;
      let secondValue;

      if (isFirstClicked) {
        firstValue = getLocation(tiles, firstClickedLocation);
      }

      if (isSecondClicked) {
        secondValue = getLocation(tiles, secondClickedLocation);
      }

      if (
        firstValue?.character === "fredric" ||
        secondValue?.character === "fredric"
      ) {
        await wait(500);

        alert("hHhahahah!");
        setFirstClickedLocation(UNSELECTED);
        setSecondClickedLocation(UNSELECTED);

        const endIndex = revealed.length - 2;
        if (endIndex >= 0) {
          setRevealed(revealed.slice(0, endIndex));
        }
        return;
      }

      if (areBothLocationsClicked) {
        await wait(500);

        const areLocationsSame = firstValue.character === secondValue.character;

        if (areLocationsSame) {
          setRevealed([
            ...revealed,
            firstClickedLocation,
            secondClickedLocation,
          ]);
        } else {
        }

        await wait(500);

        setFirstClickedLocation(UNSELECTED);
        setSecondClickedLocation(UNSELECTED);
      }
    };

    evaluate();
  }, [firstClickedLocation, secondClickedLocation]);

  useEffect(() => {
    if (!fredricShufflePenalty) {
      return;
    }

    if (prevRevealed.length > revealed.length) {
      const allMatrixLocations = getAllMatrixLocations(tiles);

      const doesRevealedContainLocation = (matrixLocation) =>
        revealed.some((revealedLocation) =>
          compareLocations(revealedLocation, matrixLocation)
        );

      const unRevealedLocations = allMatrixLocations.filter(
        (matrixLocation) => !doesRevealedContainLocation(matrixLocation)
      );

      const unRevealedValues = unRevealedLocations.map((location) =>
        getLocation(tiles, location)
      );
      const shuffledValues = shuffle(unRevealedValues);

      let newTiles = JSON.parse(JSON.stringify(tiles));
      unRevealedLocations.forEach((location, index) => {
        newTiles = updateMatrix(location, shuffledValues[index], newTiles);
      });

      setTiles(newTiles);
    }
  }, [revealed]);

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
