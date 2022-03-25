import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Anchor, Box, Button, Layer, Table, TableBody, TableCell, TableHeader, TableRow, Text } from 'grommet';
import Loading from '../../components/Loading';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormPreviousLink } from 'grommet-icons';

export default function Generator() {
  const location = useLocation();
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const navigate = useNavigate();

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

  function createPDF() {
    let before = Date.now();
    setLoadingPDF(true);

    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth();

    for(let i = 0; i < location.state.numberSheets; i++) {
      pdf.text(location.state.title, pageWidth/2, 50, 'center');
      autoTable(pdf, {
        startY: 60,
        headStyles: {
          lineWidth: 0,
          minCellHeight: 5,
          textColor: 'black',
          fontSize: 15
        },
        styles: {
          cellWidth: pageWidth/5-5,
          minCellHeight: pageWidth/5-5,
          halign: 'center',
          valign: 'middle',
          overflow: 'linebreak',
          fillColor: false,
          lineWidth: 0.5
        },
        alternateRowStyles: {
          fillColor: false
        },
        head: [['B', 'I', 'N', 'G', 'O']],
        body: matrices[i]
      });
      
      if(i < location.state.numberSheets-1) {
        pdf.addPage();
      }
    }

    pdf.save('bingosheets.pdf');
    setLoadingPDF(false);
    let after = Date.now();
    console.log(`Time: ${(after-before)/1000} seconds`);
    navigate('/');
  }

  return (
    <Box full align='center'>
      {loading ? (
        <Loading text='Loading matrices. This could take a while...' />
      ) : (
        <Box fill align='center'>
          <h1>Bingo Sheets Download Center</h1>
          <Box align='center' direction='row'>
            <Box pad='small'>
              <Button primary color='main' label={<Text color='mainText'>Download PDF</Text>} onClick={() => createPDF()} />
            </Box>
            <Box pad='small'>
              <Button secondary color='main' label='Cancel' onClick={() => navigate('/')} />
            </Box>
          </Box>
          <Box>
            <h2>Sheets Preview:</h2>
            <Box background='light-2' pad='small' align='center'>
              {matrices.map((item, index) => {
                  return (
                    <Box id={`${index}`} key={index} align='center' style={{marginBottom: '10em'}}>
                      <Box pad='large'>
                        <h1 color='black'>{location.state.title}</h1>
                      </Box>
                      <Box pad='medium'>
                        {createTable(item)}
                      </Box>
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </Box>
      )
      }

      {loadingPDF && (
        <Layer>
          <Loading text='Creating PDF. This could take a while...' />
        </Layer>
      )}
    </Box>
  )
}