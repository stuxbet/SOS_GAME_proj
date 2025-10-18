import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, FormControlLabel, MenuItem, Radio, RadioGroup, Select, Typography} from '@mui/material';
import type {SelectChangeEvent} from '@mui/material/Select';
import type {SosMark, SosGameMode} from './features/models';
import {GameController, type PlayerId} from './features/gameController';

export const Gui: React.FC = () => {
  const controllerRef = useRef(new GameController(3));
  const lastWinnerRef = useRef<PlayerId | null>(null);
  const [gameState, setGameState] = useState(() => controllerRef.current.getState());
  const syncState = () => setGameState(controllerRef.current.getState());

  const handleSizeChange = (event: SelectChangeEvent) => {
    const size = Number(event.target.value);
    if (!Number.isInteger(size)) {
      return;
    }
    controllerRef.current.reset(size);
    syncState();
  };

  const handlePlayerMarkChange = (player: PlayerId, mark: SosMark) => {
    controllerRef.current.setPlayerMark(player, mark);
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
      const winnerLabel = gameState.winner === 'playerOne' ? 'Player One' : 'Player Two';
      window.alert(`${winnerLabel} wins!`);
    }
    lastWinnerRef.current = gameState.winner ?? null;
  }, [gameState.winner]);

  return (
    <Box sx={{p: 4, maxWidth: 720, width: '100%', mx: 'auto'}}>
      <Typography variant="h4" gutterBottom>Sprint 0 Simple GUI</Typography>
      <hr />

      <RadioGroup name="Game Mode" value={gameState.mode} onChange={handleModeChange}>
        <FormControlLabel value="simple" control={<Radio />} label="Simple" />
        <FormControlLabel value="general" control={<Radio />} label="General" />
      </RadioGroup>

      <Box display="flex" justifyContent="center" gap={6} mt={2}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>Player One</Typography>
          <RadioGroup
            row
            name="player-one-mark"
            value={gameState.playerMarks.playerOne}
            onChange={(event) => handlePlayerMarkChange('playerOne', event.target.value as SosMark)}
          >
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="O" control={<Radio />} label="O" />
          </RadioGroup>
        </Box>
        <Box>
          <Typography variant="subtitle1" gutterBottom>Player Two</Typography>
          <RadioGroup
            row
            name="player-two-mark"
            value={gameState.playerMarks.playerTwo}
            onChange={(event) => handlePlayerMarkChange('playerTwo', event.target.value as SosMark)}
          >
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="O" control={<Radio />} label="O" />
          </RadioGroup>
        </Box>
      </Box>

      <Box sx={{maxWidth: 50, mt: 2}}>
        <Select fullWidth value={String(gameState.size)} onChange={handleSizeChange}>
          {[3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
            <MenuItem key={size} value={String(size)}>{`${size}`}</MenuItem>
          ))}
        </Select>
      </Box>

      <Typography variant="subtitle1" align="center" mt={3}>
        Current turn: {gameState.currentPlayer === 'playerOne' ? 'Player One' : 'Player Two'}
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
              disabled={Boolean(cell) || Boolean(gameState.winner)}
              onClick={() => handleMove(r, c)}
              sx={{minWidth: 0, width: '100%', height: '100%'}}
            >
              {cell ?? ''}
            </Button>
          )),
        )}
      </Box>
    </Box>
  );
};
