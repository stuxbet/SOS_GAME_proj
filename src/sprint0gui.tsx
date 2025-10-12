import React from 'react';
import {Box, Button, Checkbox, FormControlLabel, Radio, RadioGroup, Typography} from '@mui/material';
import {SosGame} from './features/models';

const game = new SosGame(3);

export const Gui: React.FC = () => {
  const handleMove = (row: number, col: number) => {
    game.place(row, col, 'S');
  };

  return (
    <Box sx={{p: 4, maxWidth: 720, width: '100%', mx: 'auto'}}>
      <Typography variant="h4" gutterBottom>Sprint 0 Simple GUI</Typography>
      <hr />
      <FormControlLabel control={<Checkbox />} label="Check me" />

      <RadioGroup name="Game Mode:">
        <FormControlLabel value="option1" control={<Radio />} label="Quickmatch" />
        <FormControlLabel value="option2" control={<Radio />} label="General" />
      </RadioGroup>
      <Box
        display="grid"
        gridTemplateColumns={`repeat(${game.size}, 3.5rem)`}
        gridAutoRows="3.5rem"
        gap={1.5}
        justifyContent="center"
        mt={3}
      >
        {game.board.flatMap((row, r) =>
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
