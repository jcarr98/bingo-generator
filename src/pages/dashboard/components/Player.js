import { useState } from 'react';

import { Box, Button, Text } from 'grommet';

export default function Player(props) {
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(new Audio(props.url));

  function play() {
    if(audio.error) {
      console.log(audio.error);
      props.setAudioError(true);
      return;
  }
    audio.play();
    setPlaying(!playing);
  }

  function pause() {
    audio.pause();
    setPlaying(!playing);
  }

  if(props.stop) {
    pause();
  }

  return (
    <Box direction='row'>
      {playing ? 
        <Button primary color='main' label={<Text color='mainText'>Pause</Text>} onClick={() => pause()} />
        :
        <Button primary color='main' label={<Text color='mainText'>Play Sample</Text>} onClick={() => play()} />
      }
    </Box>
  )
}