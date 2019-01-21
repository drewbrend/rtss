import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const testResultSchema = new Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  result: { type: 'String', required: true },
  duration: { type: 'Number', required: true },
});

export default mongoose.model('TestResult', testResultSchema);
