import React from 'react';
import {Box, Checkbox, FormControlLabel, Radio, RadioGroup, Typography} from '@mui/material';


export const Gui: React.FC = () => {
  return (
    <Box sx={{p: 4}}>
      <Typography variant="h4" gutterBottom>Sprint 0 Simple GUI</Typography>
      <hr />
      <FormControlLabel control={<Checkbox />} label="Check me" />

      <RadioGroup name="sprint0-radio-group">
        <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
        <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
      </RadioGroup>
    </Box>
  );
};
