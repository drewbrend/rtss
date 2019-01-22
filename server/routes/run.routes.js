import { Router } from 'express';
import * as RunController from '../controllers/run.controller';
const router = new Router();

// Get Runs
router.route('/runs').get(RunController.getRuns);

// Get one Run by cuid
router.route('/runs/:id').get(RunController.getRun);

// Add a new Run
router.route('/runs').post(RunController.addRun);

// Delete a Run by cuid
router.route('/runs/:id').delete(RunController.deleteRun);

export default router;
