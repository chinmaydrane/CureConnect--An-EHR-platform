// server/routes/blockchain.js
import express from 'express';
import { verifyChain, getBlocks, initChainIfNeeded } from '../services/blockchain.js';
import { protect } from '../middlewares/auth.js'; // optional: protect these routes

const router = express.Router();

router.get('/init', protect, async (req, res) => {
  try {
    const genesis = await initChainIfNeeded();
    res.json({ ok: true, genesis });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/verify', protect, async (req, res) => {
  try {
    const result = await verifyChain();
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/blocks', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const blocks = await getBlocks(limit);
    res.json({ ok: true, blocks });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
