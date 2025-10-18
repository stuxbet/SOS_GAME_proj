import React, {useRef, useState} from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import type {SelectChangeEvent} from '@mui/material/Select';
import {SosGame, type SosMark} from './features/models';

const cloneBoard = (game: SosGame) => game.board.map((row) => [...row]);
type PlayerId = 'playerOne' | 'playerTwo';

export const Gui: React.FC = () => {
  const gameRef = useRef(new SosGame(3));
  const [boardSize, setBoardSize] = useState(3);
  const [boardSnapshot, setBoardSnapshot] = useState(() => cloneBoard(gameRef.current));
  const [playerOneMark, setPlayerOneMark] = useState<SosMark>('S');
  const [playerTwoMark, setPlayerTwoMark] = useState<SosMark>('O');
  const [currentPlayer, setCurrentPlayer] = useState<PlayerId>('playerOne');
  const [moveLog, setMoveLog] = useState<Array<{player: PlayerId; mark: SosMark; row: number; col: number}>>([]);

  const handleSizeChange = (event: SelectChangeEvent) => {
    const size = Number(event.target.value);
    setBoardSize(size);
    gameRef.current.reset(size);
    setBoardSnapshot(cloneBoard(gameRef.current));
    setMoveLog([]);
    setCurrentPlayer('playerOne');
  };

  const recordMove = (player: PlayerId, row: number, col: number, mark: SosMark) => {
    setMoveLog((prev) => [...prev, {player, row, col, mark}]);
  };

  const handleMove = (row: number, col: number) => {
    const mark: SosMark = currentPlayer === 'playerOne' ? playerOneMark : playerTwoMark;
    try {
      gameRef.current.place(row, col, mark);
      setBoardSnapshot(cloneBoard(gameRef.current));
      recordMove(currentPlayer, row, col, mark);
      setCurrentPlayer((prev) => (prev === 'playerOne' ? 'playerTwo' : 'playerOne'));
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <Box sx={{p: 4, maxWidth: 720, width: '100%', mx: 'auto'}}>
      <Typography variant="h4" gutterBottom>Sprint 0 Simple GUI</Typography>
      <hr />

      <RadioGroup name="Game Mode">
        <FormControlLabel value="simple" control={<Radio />} label="Simple" />
        <FormControlLabel value="general" control={<Radio />} label="General" />
      </RadioGroup>

      <Box display="flex" justifyContent="center" gap={6} mt={2}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>Player One</Typography>
          <RadioGroup
            row
            name="player-one-mark"
            value={playerOneMark}
            onChange={(event) => setPlayerOneMark(event.target.value as SosMark)}
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
            value={playerTwoMark}
            onChange={(event) => setPlayerTwoMark(event.target.value as SosMark)}
          >
            <FormControlLabel value="S" control={<Radio />} label="S" />
            <FormControlLabel value="O" control={<Radio />} label="O" />
          </RadioGroup>
        </Box>
      </Box>

      <Box sx={{maxWidth: 50, mt: 2}}>
        <Select fullWidth value={boardSize} onChange={handleSizeChange}>
          {[3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
            <MenuItem key={size} value={size}>{`${size}`}</MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={`repeat(${boardSize}, 4rem)`}
        gridAutoRows="4rem"
        gap={1.5}
        justifyContent="center"
        mt={3}
      >
        {boardSnapshot.flatMap((row, r) =>
          row.map((cell, c) => (
            <Button
              key={`${r}-${c}`}
              variant="outlined"
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
