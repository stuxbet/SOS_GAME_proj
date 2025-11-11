import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import type {
  Computer,
  PlayerId,
  SosMark,
  SosGameMode,
  WinnerId,
} from "./features/models";
import { GameController } from "./features/gameController";

export const Gui: React.FC = () => {
  const controllerRef = useRef(new GameController(3));
  const lastWinnerRef = useRef<WinnerId>(null);
  const MIN_BOARD_SIZE = 3;
  const MAX_BOARD_SIZE = 10;
  const [gameState, setGameState] = useState(() =>
    controllerRef.current.getState()
  );
  const syncState = () => setGameState(controllerRef.current.getState());
  const isComputerTurn = gameState.playerComputer[gameState.currentPlayer];

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!Number.isFinite(value)) {
      return;
    }
    const clamped = Math.min(
      MAX_BOARD_SIZE,
      Math.max(MIN_BOARD_SIZE, Math.round(value))
    );
    controllerRef.current.reset(clamped);
    syncState();
  };

  const handlePlayerMarkChange = (player: PlayerId, mark: SosMark) => {
    controllerRef.current.setPlayerMark(player, mark);
    syncState();
  };

  const handlePlayerComputerChange = (
    player: PlayerId,
    isComputer: Computer
  ) => {
    controllerRef.current.setPlayerComputer(player, isComputer);
    syncState();
  };

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const mode = event.target.value as SosGameMode;
    controllerRef.current.setMode(mode);
    syncState();
  };

  const handleMove = (row: number, col: number) => {
    try {
      controllerRef.current.makeMove(row, col);
      syncState();
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    if (gameState.winner && lastWinnerRef.current !== gameState.winner) {
      let message: string;
      if (gameState.winner === "draw") {
        message = "Game ends in a draw.";
      } else {
        const winnerLabel =
          gameState.winner === "playerOne" ? "Player One" : "Player Two";
        message = `${winnerLabel} wins!`;
      }
      window.alert(message);
    }
    lastWinnerRef.current = gameState.winner ?? null;
  }, [gameState.winner]);

  useEffect(() => {
    if (!isComputerTurn || gameState.winner) {
      return;
    }
    try {
      controllerRef.current.makeComputerMove();
      setGameState(controllerRef.current.getState());
    } catch (error) {
      console.warn(error);
    }
  }, [isComputerTurn, gameState.winner]);

  return (
    <Box sx={{ p: 4, maxWidth: 720, width: "100%", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Sprint 0 Simple GUI
      </Typography>
      <hr />

      <RadioGroup
        name="Game Mode"
        value={gameState.mode}
        onChange={handleModeChange}
      >
        <FormControlLabel value="simple" control={<Radio />} label="Simple" />
        <FormControlLabel value="general" control={<Radio />} label="General" />
      </RadioGroup>

      <Box display="flex" justifyContent="center" gap={6} mt={2}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Player One
          </Typography>
          <RadioGroup
            name="player-one-type"
            value={gameState.playerComputer.playerOne ? "computer" : "human"}
            onChange={(event) =>
              handlePlayerComputerChange(
                "playerOne",
                event.target.value === "computer"
              )
            }
          >
            <FormControlLabel value="human" control={<Radio />} label="Human" />
            <FormControlLabel
              value="computer"
              control={<Radio />}
              label="Computer"
            />
          </RadioGroup>
          <RadioGroup
            row
            name="player-one-mark"
            value={gameState.playerMarks.playerOne}
            onChange={(event) =>
              handlePlayerMarkChange("playerOne", event.target.value as SosMark)
            }
          >
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="O" control={<Radio />} label="O" />
          </RadioGroup>
        </Box>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Player Two
          </Typography>
          <RadioGroup
            name="player-two-type"
            value={gameState.playerComputer.playerTwo ? "computer" : "human"}
            onChange={(event) =>
              handlePlayerComputerChange(
                "playerTwo",
                event.target.value === "computer"
              )
            }
          >
            <FormControlLabel value="human" control={<Radio />} label="Human" />
            <FormControlLabel
              value="computer"
              control={<Radio />}
              label="Computer"
            />
          </RadioGroup>
          <RadioGroup
            row
            name="player-two-mark"
            value={gameState.playerMarks.playerTwo}
            onChange={(event) =>
              handlePlayerMarkChange("playerTwo", event.target.value as SosMark)
            }
          >
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="O" control={<Radio />} label="O" />
          </RadioGroup>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 80, mt: 2 }}>
        <TextField
          fullWidth
          label="Board Size"
          type="number"
          value={gameState.size}
          onChange={handleSizeChange}
          inputProps={{ min: MIN_BOARD_SIZE, max: MAX_BOARD_SIZE }}
        />
      </Box>

      <Typography variant="subtitle1" align="center" mt={3}>
        {`Current turn: ${
          gameState.currentPlayer === "playerOne" ? "Player One" : "Player Two"
        }`}
      </Typography>
      <Typography variant="subtitle2" align="center" mt={1}>
        {`Scores — Player One: ${gameState.scores.playerOne} | Player Two: ${gameState.scores.playerTwo}`}
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={`repeat(${gameState.size}, 4rem)`}
        gridAutoRows="4rem"
        gap={1.5}
        justifyContent="center"
        mt={3}
      >
        {gameState.board.flatMap((row, r) =>
          row.map((cell, c) => (
            <Button
              key={`${r}-${c}`}
              variant="outlined"
              disabled={
                Boolean(cell) || Boolean(gameState.winner) || isComputerTurn
              }
              onClick={() => handleMove(r, c)}
              sx={{ minWidth: 0, width: "100%", height: "100%" }}
            >
              {cell ?? ""}
            </Button>
          ))
        )}
      </Box>
    </Box>
  );
};
