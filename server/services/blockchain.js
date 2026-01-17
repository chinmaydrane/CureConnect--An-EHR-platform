// server/services/blockchain.js
import crypto from 'crypto';
import Block from '../models/Block.js'; // create this model (see below)

/* helper */
const sha256 = (input) => crypto.createHash('sha256').update(input).digest('hex');

const computeHash = (index, timestamp, data, previousHash, nonce = 0) => {
  const dataStr = JSON.stringify(data);
  const ts = (timestamp instanceof Date) ? timestamp.toISOString() : new Date(timestamp).toISOString();
  return sha256(`${index}|${ts}|${dataStr}|${previousHash}|${nonce}`);
};

export async function getLatestBlock() {
  return Block.findOne().sort({ index: -1 }).lean();
}

export async function initChainIfNeeded() {
  const latest = await getLatestBlock();
  if (latest) return latest;

  const genesis = {
    index: 0,
    timestamp: new Date(),
    data: { info: 'genesis' },
    previousHash: '0'.repeat(64),
    nonce: 0,
  };
  genesis.hash = computeHash(genesis.index, genesis.timestamp, genesis.data, genesis.previousHash, genesis.nonce);
  await Block.create(genesis);
  return genesis;
}

export async function addBlock(dataObj) {
  const latest = await initChainIfNeeded();
  const newIndex = latest.index + 1;
  const timestamp = new Date();
  const previousHash = latest.hash;
  const nonce = 0;
  const hash = computeHash(newIndex, timestamp, dataObj, previousHash, nonce);

  const blockDoc = await Block.create({
    index: newIndex,
    timestamp,
    data: dataObj,
    previousHash,
    hash,
    nonce,
  });

  return blockDoc.toObject();
}

export async function verifyChain() {
  const blocks = await Block.find().sort({ index: 1 }).lean();
  const errors = [];
  if (!blocks.length) {
    return { valid: false, errors: ['No blocks found'] };
  }
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const recomputed = computeHash(b.index, b.timestamp, b.data, b.previousHash, b.nonce);
    if (recomputed !== b.hash) errors.push(`Hash mismatch at index ${b.index}`);
    if (i > 0 && b.previousHash !== blocks[i - 1].hash) errors.push(`Prev hash mismatch at index ${b.index}`);
  }
  return { valid: errors.length === 0, errors, length: blocks.length };
}

export async function getBlocks(limit = 50) {
  return Block.find().sort({ index: -1 }).limit(limit).lean();
}
