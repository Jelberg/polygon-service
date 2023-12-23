import express from 'express';
import { getWatchlistController } from '../../controllers/getWatchlistController';
import { getInfoCompanyByTickerController } from '../../controllers/getInfoCompanyByTickerController';
import { getQuoteTickerController } from '../../controllers/getQuoteByTickerController';

const router = express.Router();


router.get("/", (req, res) =>{
    res.send("It's OK!");
  });

router.get("/stock", getWatchlistController.bind(getWatchlistController));
router.get('/stock/:ticker/company', getInfoCompanyByTickerController.bind(getInfoCompanyByTickerController)) 
router.get('/stock/:ticker', getQuoteTickerController.bind(getQuoteTickerController));


  
export default router