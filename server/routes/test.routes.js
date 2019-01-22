import { Router } from 'express';
import * as TestController from '../controllers/test.controller';
const router = new Router();

// Get Tests
router.route('/tests').get(TestController.getTests);

// Get one test by _id
router.route('/tests/:id').get(TestController.getTest);

// Create one test
router.route('/tests').post(TestController.addTest);

// Delete a test by _id
router.route('/tests/:id').delete(TestController.deleteTest);

export default router;
