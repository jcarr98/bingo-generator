import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Anchor, Box, Button, Card, CardBody, CardHeader, CardFooter, Notification, Text } from 'grommet';
import Axios from 'axios';

import Loading from '../../components/Loading';
import PlaylistManager from './components/PlaylistManager';
import BingoSetup from './components/BingoSetup';

export default function Dashboard(props) {
  const [noExpiry, setNoExpiry] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [audioError, setAudioError] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setNoExpiry(props.noExpiry);

    // Get user profile info
    const headers = {
      'Authorization' : `Bearer ${props.token}`
    }

    // Load profile
    Axios.get(`${process.env.REACT_APP_SPOTIFY_API}/me`, {headers: headers}).then((response) => {
      // Check auth token isn't expired
      if(response.status === 401) {
        navigate('/login?tokenExpired=true');
      }

      setUserName(response.data.display_name);
    }).catch((error) => {
      console.log('error');
      console.log(error);
    }).finally(() => {
      setLoading(false);
    });
  }, [props.noExpiry, props.token, navigate]);

  function logout() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("token-expiry");
    navigate('/login');
  }

  return (
    <Box full align="center">
      {loading ?
        <Loading text="Loading user information..." />
      : (
        <Box fill align="center">
          <Box pad='medium'>
            <Card width='large' align='center' pad='medium' elevation='medium' background='secondary'>
              <CardHeader>
                <h1>Hello, {userName}</h1>
              </CardHeader>
              <CardBody>
                <Text>Welcome to your dashboard</Text>
              </CardBody>
              <CardFooter pad='medium'>
                <Button
                  primary
                  color='main'
                  label={<Text color='mainText'>Log out</Text>}
                  onClick={() => logout()}
                />
              </CardFooter>
            </Card>
          </Box>

          {/* <Box 
            fill 
            direction='row' 
            background='main' 
            pad='medium' 
            align='center'
          >
            <Box>
              <Text color='mainText'>Control Panel</Text>
            </Box>
          </Box> */}

          <Box fill>
            <Box pad='small' align='center'>
              <Anchor 
                color='main' 
                label="Why aren't some of my playlists showing up?" 
                onClick={() => setShowHelp(!showHelp)} 
                style={{textDecoration: 'underline'}} 
              />
              {showHelp && (
                <Box fill align='center'>
                  <p>
                    There are a couple of rules for the app to load your playlist
                    <ol>
                      <li>The playlist must have at least 25 songs. This is how many spaces are on a standard bingo sheet.</li>
                      <li>The playlist must be public. Access private playlists hasn't been implemented in this app yet.</li>
                      <li>As of right now, the app can only load the first 100 songs on a playlist. That will be fixed eventually</li>
                    </ol>
                  </p>

                  <Box width='small' align='center'>
                    <Button secondary color='main' label='Close help' onClick={() => setShowHelp(false)} />
                  </Box>
                </Box>
              )}
            </Box>
            <PlaylistManager 
              token={props.token} 
              setShowBingoSetup={setShowSetup} 
              setSelectedPlaylist={setSelectedPlaylist}
              setAudioError={setAudioError} 
            />
          </Box>
        </Box>
      )}

      {/* BingoSetup Layer */}
      {showSetup && (
        <BingoSetup 
          setShow={setShowSetup}
          playlist={selectedPlaylist}
        />
      )}

      {/* Show help */}


      {/* Notifications */}
      {noExpiry && 
        <Notification
          toast
          status="warning"
          title="No Token Expiry"
          message="No expiration date was set for your login. Requests to Spotify may not work. To reset and confirm requests will work, please log out and log back in."
          onClose={() => setNoExpiry(false)}
        />
      }

      {audioError && 
        <Notification
          toast
          status="critical"
          title="Error playing song"
          message="The current song could not be played."
          onClose={() => setAudioError(false)}
        />
      }
    </Box>
  )
}