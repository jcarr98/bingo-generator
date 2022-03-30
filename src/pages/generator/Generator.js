import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Button, Image, Layer, Table, TableBody, TableCell, TableHeader, TableRow, Text } from 'grommet';
import Loading from '../../components/Loading';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Generator() {
  const location = useLocation();
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Create tables
    let result = generateTables(location.state.tracks, location.state.numberSheets);
    setMatrices(result);
    setLoading(false);
  }, [location.state.tracks, location.state.numberSheets]);

  /* This is bad, but does the job */
  // Shuffle array of songs and compare to already shuffled songs.
  // If the array is unique, save it; if not, skip
  const generateTables = (arr, k) => {
    let results = [];

    // Returns shuffled array
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

    // Compares array to existing arrays
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

    // Is passed an array of 25 songs and returns an array of
    // 5 arrays of 5 songs each, effectively making a bingo board
    const splitResults = (array) => {
      let table = [];
      let middleRow = [];

      // Split current table into 5 rows
      table.push(array.slice(0, 5));
      table.push(array.slice(5, 10));

      // In third row we need 'Free Space'
      middleRow = array.slice(10, 12);
      middleRow.push('');  // Leave free space blank - gets filled in by PDF generator
      middleRow.push(array[13], array[14]);
      table.push(middleRow);

      table.push(array.slice(15, 20));
      table.push(array.slice(20));

      return table;
    };

    let nArr = arr;
    let i = 0;
    while(i < k) {
      nArr = shuffle(nArr);
      // Only take first 25 songs
      let shuffledArr = nArr.slice(0, 25);
      if(compare(shuffledArr, results)) {
        // Create table using first 25 songs
        let table = splitResults(shuffledArr);
        results.push(table);
        i++;
      } else {
        console.log('Repeat, skipping');
      }
    }

    return results;
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
                      {/* If we're in center space, set freespace image/text; otherwise, set song name */}
                      {index === 2 && index2 === 2 ? (
                        location.state.fsLogo ? (
                          <Image src={location.state.fsLogo} fit='contain' />
                        ) : (
                          <b>Free Space</b>
                        )
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

    // For each bingo sheet, create a new page in the pdf
    for(let i = 0; i < location.state.numberSheets; i++) {
      // If a company logo is provided, add to pdf
      if(location.state.companyLogo) {
        console.log(location.state.companyLogo);
        pdf.addImage(location.state.companyLogo, 'png', 10, 10, 25, 25);
      }
      if(location.state.companyName.length > 0) {
        pdf.setFontSize(12);
        location.state.companyLogo ? pdf.text(location.state.companyName, 40, 24) : pdf.text(location.state.companyName, 10, 20);
      }
      pdf.setFontSize(28);
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
        body: matrices[i],
        didDrawCell: function(data) {
          if(data.column.index === 2 && data.row.index === 2) {
            let dim = data.cell.height - data.cell.padding('vertical');
            let textPos = data.cell.getTextPos();
            let img;
            // If logo for freespace, set logo. If not, set 'Free Space'
            if(location.state.fsLogo) {
              img = location.state.fsLogo;
              // Add Free Space logo
              pdf.addImage(img, 'png', textPos.x-17, textPos.y-17, dim, dim);
            } else {
              pdf.setFont(undefined, 'bold');
              pdf.text(textPos.x-9, textPos.y+1, 'Free Space');
              pdf.setFont(undefined, 'normal');
            }
          }
        }
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
                    <Box id={`t${index}`} key={index} align='center' style={{marginBottom: '10em'}}>
                      <Box alignSelf={'start'} direction='row'>
                        {location.state.companyLogo && (
                          <Box basis='xsmall' pad={{left: 'medium', vertical: 'large'}}>
                            <Image src={location.state.companyLogo} width='80' height='80' />
                          </Box>
                        )}
                        <Box pad='large'>
                          <h4>{location.state.companyName}</h4>
                        </Box>
                      </Box>
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