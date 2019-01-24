import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const testResultSchema = new Schema({
  testName: { type: 'String', required: true },
  result: { type: 'String', required: true },
  duration: { type: 'Number', required: true },
  isStable: { type: 'Boolean', required: false },
  run: { type: mongoose.Schema.Types.ObjectId, ref: 'TestRun' },
});

export default mongoose.model('TestResult', testResultSchema);
