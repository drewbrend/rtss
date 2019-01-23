import { Router } from 'express';
import * as ResultController from '../controllers/result.controller';
const router = new Router();

// Get Results
router.route('/results').get(ResultController.getResults);

// Get one Result by cuid
router.route('/results/:id').get(ResultController.getResult);

// Delete a Result by cuid
router.route('/results/:id').delete(ResultController.deleteResult);

export default router;
