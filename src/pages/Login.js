import { useEffect, useState } from 'react';

import { Anchor, Box, Button, Notification, Paragraph, Text } from 'grommet';
import { useSearchParams } from 'react-router-dom';

export default function Login() {
  // API information
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  // States
  const [searchParams] = useSearchParams();
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    // Set page name
    document.title = 'Bingo Creator - Login';

    // Check for expired token parameter
    setTokenExpired(searchParams.get('tokenExpired') === 'true');
  }, [searchParams]);

  return (
    <Box full align="center" pad="medium">
      <h1>Jeff's Bingo Creator</h1>
      <Box align='center' width='large'>
        <Paragraph fill textAlign='justify'>
          Welcome to my Bingo Sheet creator. This is a webapp that allows for the simple creation of a large number of bingo sheets by using
          your Spotify playlists.
        </Paragraph>
        <Paragraph fill textAlign='justify'>
          This is a simple webapp. I created it to practice my web development skills and try to play around with the Spotify API.
          This app is just a fun personal project, so it will always be free and available to anyone who wants to use it.
        </Paragraph>
        <Paragraph fill textAlign='justify'>
          Unfortunately, due to Spotify's <Anchor color='main' label='developer policy' href='https://developer.spotify.com/policy/' target='_blank' /> (specifically section 3, item 2), I cannot take this app out of development mode. This means that for you to access 
          this app, you need to be whitelisted by me. If you want access to this app, either to use to make bingo sheets or just to check out my work, 
          please <Anchor color='main' href='mailto:jeffrey.carr98@gmail.com' label='Email me' /> at <Text color='main'>jeffrey.carr98@gmail.com </Text>
          with your full name and email address used at Spotify.
        </Paragraph>
      </Box>
      
      <Button
        primary
        color='main'
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        label={<Text color='mainText'>Login with Spotify</Text>}
      />

      {tokenExpired &&
        <Notification
          toast
          status="critical"
          title="Login Expired"
          message="Please log in again to continue"
          onClose={() => setTokenExpired(false)}
        />
      }
    </Box>
  );
}