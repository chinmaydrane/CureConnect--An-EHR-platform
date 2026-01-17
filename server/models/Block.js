// server/models/Block.js
import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  data: { type: Object, required: true }, // store metadata
  previousHash: { type: String, required: true },
  hash: { type: String, required: true },
  nonce: { type: Number, default: 0 }
});

export default mongoose.model('Block', blockSchema);
