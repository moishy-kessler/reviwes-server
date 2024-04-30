// const fs = require('fs');
// const csvParser = require('csv-parser');
// const express = require('express');
// const cors = require('cors');
//const json2csv = require('json2csv').Parser;
// const stringSimilarity = require('string-similarity');
// const app = express();
// app.use(cors());
// console.log("appTest")

// // A function that knows how to read a csv file
// const readCSVFile = (filePath) => {
//   const results = [];

//   return new Promise((resolve, reject) => {
//     fs.createReadStream(filePath)
//       .pipe(csvParser())
//       .on('data', (data) => results.push(data))
//       .on('end', () => {
//         resolve(results);
//       })
//       .on('error', (err) => reject(err));
//   });
// };

// // A function that merges the files into one large file
// const readCSVFiles = async (file1, file2) => {
//   const file1Data = await readCSVFile(file1);
//   const file2Data = await readCSVFile(file2);
//   const combinedData = [...file1Data, ...file2Data];
//   return combinedData;
// };

// // A function that fetches the original data files
// const loadData = async () => {
//   try {
//     return await readCSVFiles('./csvFiles/test.csv', './csvFiles/train.csv');
//   } catch (error) {
//     console.error('Error loading data:', error);
//     return [];
//   }
// };
// // Amount of records to displey on the page
// const PAGE_SIZE = 500;
// // Variables for saving the infromation according to each type (filter for displey / export)
// let allData = [];
// let filteredData = [];
// let dataToExport = [];

// // A function to request the infromation
// const loadDataBatch = async () => {
//   console.log(allData);
//   if (allData.length === 0) {
//     allData = await loadData();
//     console.log(allData);
//   }
// };

// // A function to filter the information according to the user's search
// const filterData = (sentiment, text) => {
//   filteredData = allData.filter((review) => {
//     if (sentiment != 'all' && review.sentiment != (sentiment == 'positive' ? 2 : 1)) {
//       return false;
//     }
//     if (text && !review.review.includes(text)) {
//       return false;
//     }
//     return true;
//   });
//   dataToExport = filteredData.slice();
// };

// // A function to find the common words
// const getTopWords = (category, numWords) => {
//   const wordCounts = {};

//   for (const review of allData) {
//     if (review.sentiment == category) {
//       const words = review.review.split(/\s+/);
//       for (const word of words) {
//         wordCounts[word] = (wordCounts[word] || 0) + 1;
//       }
//     }
//   }

//   const sortedWords = Object.entries(wordCounts)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, numWords);

//   return sortedWords.map(([word, count]) => ({ word, count }));
// };

// //  Calling the function to start the process
// loadDataBatch();

// request routers
// Router to display the information
// app.get('/api/reviews', async (req, res) => {
//   try {
//     const { sentiment, text, page } = req.query;
//     const pageIndex = parseInt(page) || 0;
//     filterData(sentiment, text);
//     const startIndex = pageIndex * PAGE_SIZE;
//     const endIndex = startIndex + PAGE_SIZE;
//     const batch = filteredData.slice(startIndex, endIndex);

//     currentPageIndex = pageIndex;

//     res.json(batch);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error loading data' });
//   }
// });

// const fields = ['sentiment', 'title', 'review'];

// Router to export the initial information file
// app.get('/api/export', async (req, res) => {
//   try {
//     const json2csvParser = new json2csv({ fields });
//     const startIndex = 0;
//     const endIndex = startIndex + 500000;
//     const exportBatch = dataToExport.slice(startIndex, endIndex);
//     const csv = json2csvParser.parse(exportBatch);

//     res.attachment('reviews.csv');
//     res.status(200).send(csv);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error exporting data' });
//   }
// });

// Router for extracting the rest of the files of the infromotion (according to the page, each page 500,000 records)
// app.get('/api/export/:page', async (req, res) => {
//   try {
//     const page = parseInt(req.params.page) || 0;
//     const json2csvParser = new json2csv({ fields });
//     const startIndex = page * 500000;
//     const endIndex = startIndex + 500000;
//     const exportBatch = dataToExport.slice(startIndex, endIndex);
//     const csv = json2csvParser.parse(exportBatch);

//     res.attachment(`reviews-page${page + 1}.csv`);
//     res.status(200).send(csv);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error exporting data' });
//   }
// });

// Router to provide the list of populer words in each category (positive / negative)
// app.get('/api/top-words', async (req, res) => {
//   try {
//     const { category, numWords = 5 } = req.query;
//     const categoryNum = category == 'positive' ? 2 : 1;
//     const topWords = getTopWords(categoryNum, parseInt(numWords));
//     res.json(topWords);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching top words' });
//   }
// });

// // The exit port
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });