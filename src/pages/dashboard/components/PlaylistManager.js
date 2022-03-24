import { useEffect, useState } from 'react';
import Axios from 'axios';

import { Box, Button, List, Text } from 'grommet';

import Loading from '../../../components/Loading';
import Track from './Track';

export default function PlaylistManager(props) {
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [playlistInfoLoading, setPlaylistInfoLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState({id: -1, name: 'No playlist selected', tracks: []});
  

  useEffect(() => {
    const headers = {
      'Authorization' : `Bearer ${props.token}`
    }

    // Load playlists
    Axios.get(`${process.env.REACT_APP_SPOTIFY_API}/me/playlists`, {headers: headers}).then(response => {
      let tPlaylists = [];
      tPlaylists.push({
        id: -1,
        name: 'Playlist Title',
        description: '',
        numSongs: 'Number of Songs',
        tracks: []
      });
      for(let i = 0; i < response.data.items.length; i++) {
        let current = response.data.items[i];
        // Get playlist id and name
        let playlist = {
          id: current.id,
          name: current.name,
          description: current.description,
          numSongs: current.tracks.total
        }

        tPlaylists.push(playlist);
      }

      setPlaylists(tPlaylists);
      setPlaylistsLoading(false);
    });
  }, [props.token]);

  function loadPlaylist(playlist) {
    // If user selects list title
    if(playlist.id < 0) {
      setSelectedPlaylist(playlist);
      return;
    }

    setPlaylistInfoLoading(true);
    const headers = {
      'Authorization' : `Bearer ${props.token}`
    }

    // Load songs
    Axios.get(`${process.env.REACT_APP_SPOTIFY_API}/playlists/${playlist.id}/tracks`, {headers: headers}).then(response => {
      let tTracks = [];  // Keep list of all tracks in playlist
      for(let i = 0; i < response.data.items.length; i++) {
        // Get current track
        let track = response.data.items[i].track;
        // Collect artists on track
        let artists = [];
        for(let j = 0; j < track.artists.length; j++) {
          artists.push(track.artists[j].name);
        }
        // Compile all info about current track
        let item = {
          name: track.name,
          artists: artists,
          album: track.album.name,
          album_image: track.album.images[2].url,
          preview: track.preview_url
        }
        // Save all info about current track
        tTracks.push(item);
      }

      let info = {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        numSongs: tTracks.length,
        tracks: tTracks,
      }

      setSelectedPlaylist(info);
      props.setSelectedPlaylist(info);
      setPlaylistInfoLoading(false);
    });
  }

  return (
    <Box
      fill 
      direction='row' 
      pad='medium'
    >
      <Box pad={{horizontal: 'large'}}>
        <h2>Playlist List</h2>
        {playlistsLoading ? <Loading text='Loading playlists...' />
          :
          <List
            border='bottom'
            itemKey='id'
            primaryKey='name'
            secondaryKey='numSongs'
            data={playlists}
            onClickItem={({item, index}) => loadPlaylist(item)}
          />
        }
      </Box>

      <Box
        width='70%' 
        pad={{horizontal: 'large'}} 
        background='secondary'
      >
        <h2>Playlist Info</h2>
        {playlistInfoLoading ? 
          <Loading text='Loading playlist info...' />
        :
          <Box>
            <Box>
              <h2>{selectedPlaylist.id < 0 ? 'No playlist selected' : selectedPlaylist.name}</h2>
              <Text>{selectedPlaylist.description ? selectedPlaylist.description : null}</Text>
              <Box pad={{vertical: 'small'}} width='small'>
                <Button primary color='main' label={<Text color='mainText'>Create Bingo Sheet</Text>} size='small' onClick={() => {props.setShowBingoSetup(true)}} />
              </Box>
            </Box>
            <Box>
              <h3>All songs:</h3>
              <ul style={{'listStyleType': 'none'}}>
                {selectedPlaylist.tracks.map((item, index) => {
                  return(
                    <li key={item.name}>
                      <Track 
                        token={props.token} 
                        item={item}
                        setShowBingoSetup={props.setShowBingoSetup}
                        setAudioError={props.setAudioError} 
                      />
                    </li>
                  );
                })}
              </ul>
            </Box>
          </Box>
        }
        
      </Box>
    </Box>
  )

}