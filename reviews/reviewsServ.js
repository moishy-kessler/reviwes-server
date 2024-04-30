const fs = require('fs');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');


const reviewsServ = {
  // A function that knows how to read a csv file
  readCSVFile: (filePath) => {
      const results = [];

      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            resolve(results);
          })
          .on('error', (err) => reject(err));
      });
    },

  // A function that merges the files into one large file
  readCSVFiles: async (file1, file2) => {
    const file1Data = await reviewsServ.readCSVFile(file1);
    const file2Data = await reviewsServ.readCSVFile(file2);
    const combinedData = [...file1Data, ...file2Data];
    return combinedData;
  },

  // A function that fetches the original data files
  loadData: async () => {
    try {
      return await reviewsServ.readCSVFiles('./csvFiles/test.csv', './csvFiles/train.csv');
      // const TestModel = mongoose.model('Test', { });
      // const TrainModel = mongoose.model('Train', { });

      // const testData = await TestModel.find({});
      // const trainData = await TrainModel.find({});

      // mongoose.disconnect();

      // return [testData, trainData];
    } catch (error) {
      console.error('Error loading data:', error);
      return [];
    }
  },

  // A function to request the infromation
  loadDataBatch: async () => {
    console.log(reviewsServ.allData);
    if (reviewsServ.allData.length === 0) {
      reviewsServ.allData = await reviewsServ.loadData();
      console.log(reviewsServ.allData);
    }
  },

  // A function to filter the information according to the user's search
  filterData: (sentiment, text) => {
    reviewsServ.filteredData = reviewsServ.allData.filter((review) => {
      if (sentiment != 'all' && review.sentiment != (sentiment == 'positive' ? 2 : 1)) {
        return false;
      }
      if (text && !review.review.includes(text)) {
        return false;
      }
      return true;
    });
    reviewsServ.dataToExport = reviewsServ.filteredData.slice();
  },

  // A function to find the common words
  getTopWords: (category, numWords) => {
    const wordCounts = {};

    for (const review of reviewsServ.allData) {
      if (review.sentiment == category) {
        const words = review.review.split(/\s+/);
        for (const word of words) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      }
    }

    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, numWords);

    return sortedWords.map(([word, count]) => ({ word, count }));
  },

  // Variables for saving the infromation according to each type (filter for displey / export)
  allData: [],
  filteredData: [],
  dataToExport: [],

  // Defines the export group
  fields: ['sentiment', 'title', 'review'],
}

module.exports = reviewsServ;