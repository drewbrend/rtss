import { Router } from 'express';
import * as TestController from '../controllers/test.controller';
const router = new Router();

// Get all Tests
router.route('/tests/all').get(TestController.getAllTests);

// Get Tests
router.route('/tests').get(TestController.getTests);

// Get one test by _id
router.route('/tests/:id').get(TestController.getTest);

// Delete a test by _id
router.route('/posts/:id').delete(TestController.deleteTest);

export default router;
