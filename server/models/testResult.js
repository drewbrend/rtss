import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const testResultSchema = new Schema({
  testName: { type: 'String', required: true },
  framework: { type: 'String', required: false },
  result: { type: 'String', required: true },
  message: { type: 'String', required: false },
  duration: { type: 'Number', required: true },
  isStable: { type: 'Boolean', required: false },
  run: { type: mongoose.Schema.Types.ObjectId, ref: 'TestRun' },
});

export default mongoose.model('TestResult', testResultSchema);
