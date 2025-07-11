import mongoose from 'mongoose';

const DesignSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  shape: {
    type: String,
    required: true,
  },
  length: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  colors: {
    type: [String],
    required: true,
  },
  modelResults: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Design = mongoose.models.Design || mongoose.model('Design', DesignSchema);

export default Design;
