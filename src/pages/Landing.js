import { useEffect, useState } from 'react';

import { Box } from 'grommet';
import { useNavigate } from 'react-router-dom';

import Loading from '../components/Loading';
import Dashboard from './dashboard/Dashboard';

/**
 * Validates existing token or token received from Spotify login
 */
export default function Landing() {
  const navigate = useNavigate();
  // Token states
  const [userToken, setUserToken] = useState(null);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [noTokenExpiry, setNoTokenExpiry] = useState(false);

  // Non-token states
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if this is user's first time logging in
    if(!localStorage.getItem('token')) {
      localStorage.setItem('firstLogin', true);
    } else {
      localStorage.setItem('firstLogin', false);
    }

    // Load token information
    const hash = window.location.hash;
    // Get existing token
    let token = window.localStorage.getItem('token');
    // Get existing token expiration
    const tokenExpiryStr = window.localStorage.getItem('token-expiry');
    // Create variable to convert expiration to number
    let tokenExpiry;
    if(!tokenExpiryStr) {
      tokenExpiry = null;
    } else {
      try {
        tokenExpiry = parseInt(tokenExpiryStr);
      } catch(e) {
        console.log("Error parsing existing tokenExpiry string to int");
        tokenExpiry = null;
      }
    }
    
    // Check if hash containing new access string exists
    if (hash) {
      let expiry;
      try {
        const allData = hash.substring(1).split("&");
        token = allData.find(elem => elem.startsWith('access_token')).split('=')[1];
        const expiryStr = allData.find(elem => elem.startsWith('expires_in')).split('=')[1];
        expiry = parseInt(expiryStr) * 1000;
      } catch(e) {
        console.log("Error retrieving necessary login information");
        token = null;
        setUserToken(null);
      }

      const current = Date.now();
      const expireTime = current + expiry;

      // Reset window hash
      window.location.hash = "";
      // Save user's token as cookie
      window.localStorage.setItem("token", token);
      // Set expiry for user's token
      window.localStorage.setItem("token-expiry", expireTime);
      // Set user's token
      setUserToken(token);
    }
    // If pre-existing token stored in localStorage
    else if (token) {
      const currentTime = Date.now();
      // If no token expire stored in localStorage
      if(!tokenExpiry) {
        console.log("No token expiry found");
        // Set flag for warning
        setNoTokenExpiry(true);
        setUserToken(token);
      }
      // Saved token expiry is older than current time
      else if(currentTime > tokenExpiry) {
        console.log("Logon token expired");
        setUserToken(null);
        setTokenExpired(true);
        token = null;
      } 
      // Already saved token is valid
      else {
        console.log("Existing logon token not expired yet");
        setUserToken(token);
      }
    }
    else {
      setUserToken(null);
      token = null;
    }

    // Finish loading
    setLoading(false);
  }, []);

  return (
    <Box>
      {loading ?
        // If loading, show loading text
        <Loading text="Loading app..." />
        :
        // Check validity of token
        userToken ? 
          <Dashboard
            token={userToken}
            noExpiry={noTokenExpiry}
          />
          :
          navigate(`/login?tokenExpired=${tokenExpired}`)
      }
    </Box>
  )
}