import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Button, Table, TableBody, TableCell, TableHeader, TableRow, Text } from 'grommet';
import Loading from '../../components/Loading';

export default function Generator() {
  const location = useLocation();
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create tables
    let result = splitResults(generateTables(location.state.tracks, location.state.numberSheets));
    setMatrices(result);
    setLoading(false);
  }, [location.state.tracks, location.state.numberSheets]);

  /* This is bad, but does the job */
  const generateTables = (arr, k) => {
    let results = [];

    const shuffle = (array) => {
      let shuffled = array.slice();
      let currentIndex = shuffled.length, randomIndex;
      while(currentIndex !== 0) {
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

  function splitResults(array) {
    let result = [];
    for(let i = 0; i < array.length; i++) {
      let iArray = array[i];
      let table = [];
      let middleRow = [];

      // Split current table into 5 rows
      table.push(iArray.slice(0, 5));
      table.push(iArray.slice(5, 10));

      // In third row we need 'Free Space'
      middleRow = iArray.slice(10, 12);
      middleRow.push('Free Space');
      middleRow.push(iArray[13], iArray[14]);
      table.push(middleRow);

      table.push(iArray.slice(15, 20));
      table.push(iArray.slice(20));

      result.push(table);
    }

    return result;
  }

  function createTable(rows) {
    return (
      <Table align='center'>
        <TableHeader>
          <TableRow>
            <TableCell scope='col' border='bottom' align='center'>B</TableCell>
            <TableCell scope='col' border='bottom' align='center'>I</TableCell>
            <TableCell scope='col' border='bottom' align='center'>N</TableCell>
            <TableCell scope='col' border='bottom' align='center'>G</TableCell>
            <TableCell scope='col' border='bottom' align='center'>O</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            return (
              <TableRow>
                {row.map((item, index2) => {
                  return (
                    <TableCell 
                      scope='row' 
                      align='center' 
                      border='all' 
                      size='small' 
                      height='small'
                      verticalAlign='middle'
                    >
                      {index === 2 && index2 === 2 ? (
                        <b>{item}</b>
                      ) : (
                        item
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    )
  }

  return (
    <Box full align='center'>
      {loading ? (
        <Loading text='Loading matrices. This could take a while...' />
      ) : (
        <Box fill align='center'>
          <h1>Bingo Sheets Generated</h1>
          <Box width='small' align='center'>
            <Button primary color='main' label={<Text color='mainText'>Download PDF</Text>} onClick={() => alert('Not implemented')} />
          </Box>
          <Box>
            <h2>Sheets Preview:</h2>
            <ul style={{listStyleType: 'none'}}>
              {matrices.map((item, index) => {
                return (
                  <li key={index}>
                    {createTable(item)}
                  </li>
                );
              })}
            </ul>
          </Box>
        </Box>
      )
      }
    </Box>
  )
}