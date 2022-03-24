import { useState } from 'react';

import { Box, Button, Layer, Text, TextInput } from 'grommet';

export default function BingoSetup(props) {
  const [title, setTitle] = useState(props.playlist.name);
  const [numSheets, setNumSheets] = useState(0);
  const [badNumSheets, setBadNumSheets] = useState(false);

  function checkNum(num) {
    let n = parseInt(num);
    // Entry is deleted
    if(num === '') {
      setNumSheets(0);
      setBadNumSheets(false);
    }
    else if(isNaN(n)) {
      setBadNumSheets(true);
    } 
    else {
      setNumSheets(n);
      setBadNumSheets(false);
    }
  }

  return (
    <Layer background='secondary'>
      <Box pad='medium' align='center' fill='vertical' overflow='auto'>
        <h1>Bingo Sheet Setup</h1>
        <h2>{props.playlist.name}</h2>
        <Box pad='small'>
          <Box>
            <Text>Total songs: {props.playlist.numSongs}</Text>
          </Box>
          <Box>
            <p>You can make xx number of unique combinations</p>
          </Box>
        </Box>

        {/* Form */}
        <Box pad='small'>
          {/* Title */}
          <Box>
            <Text>Sheet Title:</Text>
            <TextInput
              placeholder='Enter sheet title'
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </Box>
          {/* Number of sheets */}
          <Box>
            <Text>Number of bingo sheets:</Text>
            <TextInput
              value={numSheets}
              onChange={event => checkNum(event.target.value)}
            />
            {badNumSheets && (
              <Text color='red'>Please only enter numbers</Text>
            )}
          </Box>
        </Box>

        {/* Footer buttons */}
        <Box direction='row'>
          <Box pad='xsmall'>
            <Button primary color='main' label={<Text color='mainText'>Generate sheets</Text>} onClick={() => alert('Not implemented yet')} />
          </Box>
          <Box pad='xsmall'>
            <Button secondary color='main' label={<Text color='mainText'>Close</Text>} onClick={() => {props.setShow()}} />
          </Box>
        </Box>
      </Box>
    </Layer>
  )
}