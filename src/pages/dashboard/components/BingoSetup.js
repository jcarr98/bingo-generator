import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, FileInput, Image, Layer, Text, TextInput } from 'grommet';

export default function BingoSetup(props) {
  const [title, setTitle] = useState(props.playlist.name);
  const [maxUnique] = useState(factorial(props.playlist.numSongs));
  const [numSheets, setNumSheets] = useState(1);
  const [badNumSheets, setBadNumSheets] = useState({status: false, message: ''});
  const [fsLogo, setFSLogo] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);
  const navigate = useNavigate();

  function checkNum(num) {
    let n = parseInt(num);
    // Entry is deleted
    if(num === '') {
      setNumSheets('');
      setBadNumSheets({status: false});
    }
    else if(isNaN(n)) {
      setBadNumSheets({status: true, message: 'Please only enter numbers'});
    }
    else if (n < 1) {
      setBadNumSheets({status: true, message: 'You must make at least one sheet'});
    }
    else if(n > maxUnique) {
      setBadNumSheets({status: true, message: `Please enter less than ${maxUnique}`});
    }
    else {
      setNumSheets(n);
      setBadNumSheets({status: false});
      return true;
    }

    return false;
  }

  function factorial(n) {
    return factorialHelper(n);
  }

  function factorialHelper(n) {
    if(n === 0) {
      return 1;
    } else {
      return n * factorialHelper(n-1);
    }
  }

  function uploadImage(uploaded, type) {
    // Confirm file is passed and is an image
    function checkImage(img) {
      if(!img) {
        return false;
      }

      return img.type.split('/')[0] !== 'image' ? false : true;
    }

    // Remove image
    function removeImage() {
      type === 'freespace' ? setFSLogo(null) : setCompanyLogo(null);
    }

    if(!uploaded || uploaded.length < 1) {
      removeImage();
      return;
    }

    let image = uploaded[0];

    if(!checkImage(image)) {
      alert('Please only upload an image');
      removeImage();
    } else {
      type === 'freespace' ? setFSLogo(URL.createObjectURL(image)) : setCompanyLogo(URL.createObjectURL(image));
    }
  }

  function create() {
    if(!checkNum(numSheets)) {
      return;
    }

    navigate('/generate', {
      state: {
        title: title,
        tracks: props.playlist.trackNames,
        numberSheets: numSheets,
        companyName: companyName,
        companyLogo: companyLogo,
        fsLogo: fsLogo
      }
    });
  }

  return (
    <Layer background='secondary' responsive>
      <Box pad='medium' align='center' fill='vertical' overflow='auto' responsive>
        <h1>Bingo Sheet Setup</h1>
        <h2>{props.playlist.name}</h2>
        <Box pad='small' responsive>
          <Box>
            <Text>Total songs: {props.playlist.numSongs}</Text>
          </Box>
          <Box fill align='center'>
            <p>You can make <b>{maxUnique}</b> unique bingo boards with this many songs</p>
          </Box>
        </Box>

        {/* Form */}
        <Box pad={{bottom: 'large', horizontal: 'small'}} responsive>
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
            {badNumSheets.status && (
              <Text color='red'>{badNumSheets.message}</Text>
            )}
          </Box>
          {/* Logo uploader */}
          <Box>
            {/* Company name */}
            <Box>
              <Text>Company name (optional):</Text>
              <TextInput
                placeholder='Company name'
                value={companyName}
                onChange={event => setCompanyName(event.target.value)}
              />
            </Box>
            {/* Company logo */}
            <Box>
              <Text>Upload Company Logo (optional):</Text>
              <FileInput
                onChange={(event) => uploadImage(event.target.files, 'company')}
                multiple={false}
              />
            </Box>
            {companyLogo && (
              <Box basis='small' pad={{top: 'large'}}>
                <Image src={companyLogo} fit='contain' />
              </Box>
            )}
            <Box>
              <Text>Upload Free Space logo (optional)</Text>
              <FileInput
                onChange={event => uploadImage(event.target.files, 'freespace')}
                multiple={false}
              />
            </Box>
            {fsLogo && (
              <Box basis='small' pad={{top: 'large'}}>
                <Image src={fsLogo} fit='contain' />
              </Box>
            )}
          </Box>
        </Box>

        {/* Disclaimer */}
        <Box>
          <Text>Note: All sheet creation takes place in your browser, so it may take a bit to generate all the sheets</Text>
        </Box>

        {/* Footer buttons */}
        <Box direction='row'>
          <Box pad='xsmall'>
            <Button primary color='main' label={<Text color='mainText'>Generate sheets</Text>} onClick={() => create()} />
          </Box>
          <Box pad='xsmall'>
            <Button secondary color='main' label={<Text color='mainText'>Close</Text>} onClick={() => {props.setShow()}} />
          </Box>
        </Box>
      </Box>
    </Layer>
  )
}