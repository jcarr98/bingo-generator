import { Box, Card, CardBody, CardFooter, Image, Text } from 'grommet';

import Player from './Player';

export default function Track(props) {
  function listArtists() {
    let str = "";
    for(let i = 0; i < props.item.artists.length; i++) {
      str = str + props.item.artists[i];
      if(i < props.item.artists.length-1) {
        str = str + ", ";
      }
    }

    return str;
  }

  return (
    <Box pad={{vertical: 'small'}} animation='fadeIn' responsive>
      <Card width='large' background='black'>
        <CardBody pad={{horizontal: 'small'}}>
          <Box direction='row' align='center'>
            <Box pad='small'>
              <Image src={props.item.album_image} />
            </Box>
            <Box pad={{vertical: 'small'}}>
              <Box>
                <Text size='large'>
                  {props.item.name}
                </Text>
              </Box>
              <Box direction='row'>
                <Text>By: {listArtists()}</Text>
              </Box>
            </Box>
          </Box>
        </CardBody>
        <CardFooter pad='small'>
          <Box direction='row'>
            <Box pad='xsmall'>
              <Player url={props.item.preview} setAudioError={props.setAudioError} />
            </Box>
          </Box>
        </CardFooter>
      </Card>
    </Box>
  )
}