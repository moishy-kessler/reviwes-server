const express = require("express");
const router = express.Router();
const reviewsCtrl = require('./reviewsCtrl') 

reviewsCtrl.loadDataBatch();
router.get("/api/reviews", reviewsCtrl.getReviews);
router.get("/api/export", reviewsCtrl.getExport);
router.get("/api/export/:page", reviewsCtrl.getEportByPage);
router.get("/api/top-words", reviewsCtrl.getTopWords);


module.exports = router;