// verifyBlock.js
// Usage:
//   node verifyBlock.js block <blockId>
//   node verifyBlock.js report <reportId>
//   node verifyBlock.js chain-from <startIndex>
// Environment:
//   MONGO_URI (e.g. mongodb://localhost:27017/yourdb)

import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config();


const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("✖ MONGO_URI not set. Set it like: export MONGO_URI='mongodb://localhost:27017/yourdb'");
  process.exit(1);
}

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

/**
 * Replicate computeHash used in your service.
 * IMPORTANT: timestamp must match the DB timestamp exactly (ISO string).
 */
function computeHash(index, timestamp, data, previousHash, nonce = 0) {
  const ts = (new Date(timestamp)).toISOString();
  const dataStr = JSON.stringify(data);
  const raw = `${index}|${ts}|${dataStr}|${previousHash}|${nonce}`;
  return sha256(raw);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log("Usage:");
    console.log("  node verifyBlock.js block <blockId>");
    console.log("  node verifyBlock.js report <reportId>");
    console.log("  node verifyBlock.js chain-from <startIndex>");
    process.exit(0);
  }

  const mode = args[0];
  const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(); // uses DB from URI
    const blocksCol = db.collection('blocks');   // adjust collection name if different
    const reportsCol = db.collection('reports'); // adjust if your collection name differs

    if (mode === 'block') {
      const blockId = args[1];
      const b = await blocksCol.findOne({ _id: new ObjectId(blockId) });
      if (!b) {
        console.error(`✖ Block with _id=${blockId} not found.`);
        process.exit(2);
      }

      // Recompute block hash
      const recomputed = computeHash(b.index, b.timestamp, b.data, b.previousHash, b.nonce || 0);
      console.log("Block index:", b.index);
      console.log("Stored hash :", b.hash);
      console.log("Recomputed  :", recomputed);

      if (recomputed !== b.hash) {
        console.error("✖ MISMATCH — tampering detected (hash mismatch for this block).");
        process.exit(3);
      } else {
        console.log("✔ OK — block hash matches. No tampering detected for this block.");
      }

      // === NEW: cross-check the report referenced by this block (if any) ===
      try {
        const dataReportId = b.data && b.data.reportId;
        if (dataReportId) {
          const report = await reportsCol.findOne({ _id: new ObjectId(dataReportId) });
          if (!report) {
            console.warn(`⚠ Warning — block.data.reportId (${dataReportId}) has no matching report document.`);
          } else {
            const mismatches = [];
            const reportUrl = report.url || report.fileUrl || report.file_url;
            const blockUrl = b.data && (b.data.cloudinaryUrl || b.data.cloudinary_url || b.data.url);
            if (reportUrl && blockUrl && reportUrl !== blockUrl) {
              mismatches.push({ field: 'url/cloudinaryUrl', report: reportUrl, block: blockUrl });
            }
            const repPub = report.cloudinaryPublicId || report.public_id || report.publicId;
            const blkPub = b.data && (b.data.public_id || b.data.publicId || b.data.publicId);
            if (repPub && blkPub && repPub !== blkPub) {
              mismatches.push({ field: 'cloudinaryPublicId', report: repPub, block: blkPub });
            }
            const repUploaded = report.createdAt ? new Date(report.createdAt).toISOString() : (report.uploadedAt ? new Date(report.uploadedAt).toISOString() : null);
            const blkUploaded = b.data && b.data.uploadedAt ? new Date(b.data.uploadedAt).toISOString() : null;
            if (repUploaded && blkUploaded && repUploaded !== blkUploaded) {
              mismatches.push({ field: 'uploadedAt', report: repUploaded, block: blkUploaded });
            }

            if (mismatches.length === 0) {
              console.log("✔ OK — referenced report exists and its key fields match block.data.");
            } else {
              console.error("✖ REPORT vs BLOCK MISMATCH — report document differs from block.data:");
              console.table(mismatches);
              process.exit(3);
            }
          }
        } else {
          console.log("ℹ No reportId found in block.data — skipping report cross-check.");
        }
      } catch (err) {
        console.warn("⚠ Error during report cross-check:", err.message || err);
      }
    }



    else if (mode === 'report') {
      const reportId = args[1];
      const report = await reportsCol.findOne({ _id: new ObjectId(reportId) });
      if (!report) {
        console.error(`✖ Report with _id=${reportId} not found.`);
        process.exit(2);
      }
      if (!report.blockHash) {
        console.error("✖ Report has no blockHash field. Maybe the blockchain wasn't attached for this report.");
        process.exit(2);
      }

      // Find block by stored hash
      const block = await blocksCol.findOne({ hash: report.blockHash });
      if (!block) {
        console.error("✖ No block found with hash equal to report.blockHash. Tampering suspected or block missing.");
        process.exit(3);
      }

      // recompute block hash
      const recomputed = computeHash(block.index, block.timestamp, block.data, block.previousHash, block.nonce || 0);
      console.log("Report _id        :", report._id.toString());
      console.log("Report.blockHash  :", report.blockHash);
      console.log("Block _id         :", block._id.toString());
      console.log("Block index       :", block.index);
      console.log("Stored block.hash :", block.hash);
      console.log("Recomputed hash   :", recomputed);

      if (recomputed !== block.hash) {
        console.error("✖ MISMATCH — tampering detected (block hash does not match recomputed hash).");
        process.exit(3);
      } else {
        console.log("✔ OK — block hash matches (block not tampered).");
      }

      // === NEW: compare report fields vs block.data ===
      // choose fields you recorded when creating the block (cloudinaryUrl, public_id, uploadedAt)
      const mismatches = [];
      // compare url / cloudinaryUrl
      const reportUrl = report.url || report.fileUrl || report.file_url;
      const blockUrl = block.data && (block.data.cloudinaryUrl || block.data.cloudinary_url || block.data.url);
      if (reportUrl && blockUrl && reportUrl !== blockUrl) {
        mismatches.push({ field: 'url/cloudinaryUrl', report: reportUrl, block: blockUrl });
      }
      // compare public id
      const repPub = report.cloudinaryPublicId || report.public_id || report.publicId;
      const blkPub = block.data && (block.data.public_id || block.data.publicId || block.data.publicId);
      if (repPub && blkPub && repPub !== blkPub) {
        mismatches.push({ field: 'cloudinaryPublicId', report: repPub, block: blkPub });
      }
      // compare uploadedAt (allow slight differences by normalizing ISO)
      const repUploaded = report.createdAt ? new Date(report.createdAt).toISOString() : (report.uploadedAt ? new Date(report.uploadedAt).toISOString() : null);
      const blkUploaded = block.data && block.data.uploadedAt ? new Date(block.data.uploadedAt).toISOString() : null;
      if (repUploaded && blkUploaded && repUploaded !== blkUploaded) {
        mismatches.push({ field: 'uploadedAt', report: repUploaded, block: blkUploaded });
      }

      if (mismatches.length === 0) {
        console.log("✔ OK — report fields match block.data (no tampering between report and block).");
      } else {
        console.error("✖ REPORT vs BLOCK MISMATCH — report data differs from what the block recorded:");
        console.table(mismatches);
        process.exit(3);
      }
    }



    else if (mode === 'chain-from') {
      const startIndex = parseInt(args[1], 10);
      if (Number.isNaN(startIndex)) {
        console.error("✖ startIndex must be a number");
        process.exit(2);
      }
      // fetch blocks from startIndex sorted ascending
      const cursor = blocksCol.find({ index: { $gte: startIndex } }).sort({ index: 1 });
      const blocks = await cursor.toArray();
      if (!blocks.length) {
        console.error("✖ No blocks found from index", startIndex);
        process.exit(2);
      }
      let ok = true;
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        const recomputed = computeHash(b.index, b.timestamp, b.data, b.previousHash, b.nonce || 0);
        if (recomputed !== b.hash) {
          console.error(`✖ Hash mismatch at index ${b.index} (block _id=${b._id}).`);
          ok = false;
        }
        if (i > 0) {
          const prev = blocks[i - 1];
          if (b.previousHash !== prev.hash) {
            console.error(`✖ Previous-hash mismatch at index ${b.index}: expected previousHash=${prev.hash}, found ${b.previousHash}`);
            ok = false;
          }
        } else {
          if (b.index > 0) {
            const prevBlock = await blocksCol.findOne({ index: b.index - 1 });
            if (prevBlock && b.previousHash !== prevBlock.hash) {
              console.error(`✖ Previous-hash of index ${b.index} (${b.previousHash}) does not match hash of index ${b.index - 1} (${prevBlock.hash})`);
              ok = false;
            }
          }
        }

        // === NEW: cross-check referenced report (if any) ===
        if (b.data && b.data.reportId) {
          try {
            const report = await reportsCol.findOne({ _id: new ObjectId(b.data.reportId) });
            if (!report) {
              console.error(`✖ Missing report for block index ${b.index} (reportId=${b.data.reportId}).`);
              ok = false;
            } else {
              // compare critical fields
              const reportUrl = report.url || report.fileUrl || report.file_url;
              const blockUrl = b.data && (b.data.cloudinaryUrl || b.data.cloudinary_url || b.data.url);
              if (reportUrl && blockUrl && reportUrl !== blockUrl) {
                console.error(`✖ REPORT vs BLOCK URL mismatch at index ${b.index}: report.url != block.data.cloudinaryUrl`);
                ok = false;
              }
              const repPub = report.cloudinaryPublicId || report.public_id || report.publicId;
              const blkPub = b.data && (b.data.public_id || b.data.publicId || b.data.publicId);
              if (repPub && blkPub && repPub !== blkPub) {
                console.error(`✖ REPORT vs BLOCK public_id mismatch at index ${b.index}`);
                ok = false;
              }
              const repUploaded = report.createdAt ? new Date(report.createdAt).toISOString() : (report.uploadedAt ? new Date(report.uploadedAt).toISOString() : null);
              const blkUploaded = b.data && b.data.uploadedAt ? new Date(b.data.uploadedAt).toISOString() : null;
              if (repUploaded && blkUploaded && repUploaded !== blkUploaded) {
                console.error(`✖ REPORT vs BLOCK uploadedAt mismatch at index ${b.index}`);
                ok = false;
              }
            }
          } catch (err) {
            console.warn(`⚠ Error checking report for block index ${b.index}:`, err.message || err);
            ok = false;
          }
        }
      }

      if (ok) {
        console.log(`✔ OK — chain is valid from index ${startIndex} (checked ${blocks.length} blocks).`);
      } else {
        console.error("✖ Chain verification failed. See errors above.");
        process.exit(3);
      }
    } else {
      console.error("✖ Unknown mode:", mode);
      process.exit(2);
    }
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
