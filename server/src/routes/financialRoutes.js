import { Router } from 'express';
import { getCompanyFinancials, getFxRates, getMacroData, getRatios } from '../controllers/financialController.js';

const router = Router();

router.get('/company/:symbol', getCompanyFinancials);
router.get('/ratios/:symbol', getRatios);
router.get('/macro/:country', getMacroData);
router.get('/fx/:base', getFxRates);

export default router;
