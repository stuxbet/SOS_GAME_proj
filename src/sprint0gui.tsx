import React, {useRef, useState} from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import type {SelectChangeEvent} from '@mui/material/Select';
import {SosGame} from './features/models';

const cloneBoard = (game: SosGame) => game.board.map((row) => [...row]);

export const Gui: React.FC = () => {
  const gameRef = useRef(new SosGame(3));
  const [boardSize, setBoardSize] = useState(3);
  const [boardSnapshot, setBoardSnapshot] = useState(() => cloneBoard(gameRef.current));


  const handleSizeChange = (event: SelectChangeEvent) => {
    const size = Number(event.target.value);
    setBoardSize(size);
    gameRef.current.reset(size);
    setBoardSnapshot(cloneBoard(gameRef.current));
  };

  return (
    <Box sx={{p: 4, maxWidth: 720, width: '100%', mx: 'auto'}}>
      <Typography variant="h4" gutterBottom>Sprint 0 Simple GUI</Typography>
      <hr />
      <FormControlLabel control={<Checkbox />} label="Check me" />

      <RadioGroup name="Game Mode">
        <FormControlLabel value="simple" control={<Radio />} label="Simple" />
        <FormControlLabel value="general" control={<Radio />} label="General" />
      </RadioGroup>

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
