import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const testSchema = new Schema({
  name: { type: 'String', required: true },
  type: { type: 'String', required: true },
  isStable: { type: 'Boolean', required: false },
  lastUpdated: { type: 'Date', default: Date.now, required: true },
});

export default mongoose.model('Test', testSchema);
