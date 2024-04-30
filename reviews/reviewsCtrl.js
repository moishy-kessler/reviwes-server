const reviewsServ = require('./reviewsServ');
const json2csv = require('json2csv').Parser;

const reviewsCtrl = {
  //  Calling the function to start the process
  loadDataBatch() {
    reviewsServ.loadDataBatch();
  },

  // Ctrl to display the information
  async getReviews(req, res) {
    try {
      const PAGE_SIZE = 500; // Amount of records to displey on the page
      const { sentiment, text, page } = req.query;
      const pageIndex = parseInt(page) || 0;
      reviewsServ.filterData(sentiment, text);
      const startIndex = pageIndex * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      const batch = reviewsServ.filteredData.slice(startIndex, endIndex);

      currentPageIndex = pageIndex;

      res.json(batch);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error loading data' });
    }
  },

  // Ctrl to export the initial information file
  async getExport(req, res) {
    try {
      const fields = reviewsServ.fields;
      const json2csvParser = new json2csv({ fields });
      const startIndex = 0;
      const endIndex = startIndex + 500000;
      const exportBatch = reviewsServ.dataToExport.slice(startIndex, endIndex);
      const csv = json2csvParser.parse(exportBatch);

      res.attachment('reviews.csv');
      res.status(200).send(csv);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error exporting data' });
    }
  },

  // Router for extracting the rest of the files of the infromotion (according to the page, each page 500,000 records)
  async getEportByPage(req, res) {
    try {
      const fields = reviewsServ.fields;
      const page = parseInt(req.params.page) || 0;
      const json2csvParser = new json2csv({ fields });
      const startIndex = page * 500000;
      const endIndex = startIndex + 500000;
      const exportBatch = reviewsServ.dataToExport.slice(startIndex, endIndex);
      const csv = json2csvParser.parse(exportBatch);

      res.attachment(`reviews-page${page + 1}.csv`);
      res.status(200).send(csv);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error exporting data' });
    }
  },

  // Ctrl to provide the list of populer words in each category (positive / negative)
  async getTopWords(req, res) {
    try {
      const { category, numWords = 5 } = req.query;
      const categoryNum = category == 'positive' ? 2 : 1;
      const topWords = reviewsServ.getTopWords(categoryNum, parseInt(numWords));
      res.json(topWords);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching top words' });
    }
  }
}

module.exports = reviewsCtrl;