import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const testRunSchema = new Schema({
  results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TestResult' }],
  type: { type: 'String', required: true },
  job: { type: 'String', required: true },
  runDate: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('TestRun', testRunSchema);
