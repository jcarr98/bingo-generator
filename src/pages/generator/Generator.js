import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Box } from 'grommet';
import Loading from '../../components/Loading';

export default function Generator() {
  const location = useLocation();
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Run heaps
    console.log('Creating sheets');
    let r = generateTables(location.state.tracks, location.state.numberSheets);
    setMatrices(r);
    // let result = heapsAlgorithm(location.state.tracks, 3);
    // console.log('done:');
    // console.log(result);
    // setMatrices(result);

    setLoading(false);
  }, []);

  /* This is bad, but does the job */
  const generateTables = (arr, k) => {
    let results = [];

    const shuffle = (array) => {
      let shuffled = array.slice();
      let currentIndex = shuffled.length, randomIndex;
      while(currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
      }

      return shuffled;
    };

    const compare = (newArray, allArrays) => {
      let nJson = JSON.stringify(newArray);
      for(let i = 0; i < allArrays; i++) {
        let aJson = JSON.stringify(allArrays[i]);

        if(nJson === aJson) {
          return false;
        }
      }

      return true;
    };

    let nArr = arr;
    let i = 0;
    while(i < k) {
      nArr = shuffle(nArr);
      if(compare(nArr, results)) {
        results.push(nArr.slice(0, 25));
        i++;
      } else {
        console.log('Repeat, skipping');
      }
    }

    return results;
  }

  return (
    <Box>
      {loading ? (
        <Loading text='Loading matrices. This could take a while...' />
      ) : (
        <Box>
          <p>Matrices loaded.</p>
          <ol>
            {matrices.map((item, index) => {
              return (
                <li key={index}>
                  <ol>
                  {item.map((row, index2) => {
                    return <li key={`${index2}`}>{row}</li>
                  })}
                  </ol>
                </li>
              );
            })}
          </ol>
        </Box>
      )
      }
    </Box>
  )
}