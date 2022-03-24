import { useEffect, useState } from 'react';

import { Anchor, Box, Notification } from 'grommet';
import { useSearchParams } from 'react-router-dom';

export default function Login(props) {
  // API information
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'token';

  // States
  const [searchParams] = useSearchParams();
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    setTokenExpired(searchParams.get('tokenExpired') === 'true');
  }, [searchParams]);

  return (
    <Box full align="center" pad="medium">
      <Anchor
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        label="Login to Spotify"
        color="main"
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