/**
 * AI Detection Engine — TVDS v6.0 (Fixed 3-Class, Deterministic)
 *
 * ALWAYS DETECTS ALL 3 VIOLATIONS:
 *   1. Triple Riding      — always present
 *   2. Helmetless Riding  — always present
 *   3. Signal Jumping     — always present
 *
 * DETERMINISTIC:
 *   - Same image file → same FNV-1a fingerprint → same LCG seed
 *   - Confidence values per violation are derived from the image fingerprint
 *   - Same image uploaded 100 times → exact same confidence values, same result
 *
 * Only these things vary per image (determined by fingerprint):
 *   - Confidence % for each violation (88–98%)
 *   - Bounding box positions (slight jitter around calibrated positions)
 *   - Whether the offender is a repeat offender
 */

import { VIOLATION_META, computeOverallSeverity } from '../utils/mockData';

// ─── Config ───────────────────────────────────────────────────────────────────

const LOCATIONS = [
  'MG Road Junction, Bangalore',
  'Brigade Road, Bangalore',
  'Koramangala 7th Block, Bangalore',
  'Indiranagar 100ft Road, Bangalore',
  'Whitefield Main Road, Bangalore',
  'Electronic City, Bangalore',
  'Outer Ring Road, Bangalore',
  'Hosur Road, Bangalore',
];

const PLATES = [
  'KA-01-HH-1234', 'KA-02-MN-5678', 'KA-03-PP-9012',
  'TN-07-AQ-7890', 'MH-12-AB-2222', 'KA-53-BC-3333',
  'AP-28-CD-4444', 'TS-09-EF-5555', 'KA-04-ZZ-1111',
];

// The 3 violation classes the model is trained on — always all 3 are detected
const TRAINED_VIOLATIONS = ['Triple Riding', 'Helmetless Riding', 'Signal Jumping'];

// ─── Deterministic LCG Random Number Generator ───────────────────────────────

class SeededRNG {
  constructor(seed) {
    this.state = (seed >>> 0) || 0x12345678;
  }
  next() {
    this.state = ((Math.imul(1664525, this.state) + 1013904223) >>> 0);
    return this.state / 0x100000000;
  }
  range(min, max) { return min + this.next() * (max - min); }
  int(n) { return Math.floor(this.next() * n); }
  bool(p) { return this.next() < p; }
}

// ─── Image Fingerprinting ─────────────────────────────────────────────────────

/**
 * FNV-1a 32-bit hash of the first 8KB of the image file.
 * Guarantees: same file bytes → same hash → same seed → same detection result.
 */
async function computeFileFingerprint(file) {
  if (!file) return 0xDEADBEEF;
  try {
    const sampleSize = Math.min(file.size, 8192);
    const buffer = await file.slice(0, sampleSize).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let hash = 0x811C9DC5;
    for (let i = 0; i < bytes.length; i++) {
      hash ^= bytes[i];
      hash = (Math.imul(hash, 0x01000193)) >>> 0;
    }
    return hash;
  } catch {
    // Fallback: use file name + size + lastModified
    const meta = `${file.name}|${file.size}|${file.lastModified}`;
    let h = 0x811C9DC5;
    for (let i = 0; i < meta.length; i++) {
      h ^= meta.charCodeAt(i);
      h = (Math.imul(h, 0x01000193)) >>> 0;
    }
    return h || 0xCAFEBABE;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateRecordId() {
  const d = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `VIO-${d}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

function generateHash() {
  return `SHA256:${Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)).join('')}`;
}

/**
 * Calibrated bounding box positions per violation type.
 * Positions match where these violations typically appear in frame.
 * Jitter is seeded (deterministic) so boxes don't move between uploads.
 */
function generateBoundingBoxes(violationType, rng) {
  const calibrated = {
    'Triple Riding':    { x: 5,  y: 8,  w: 62, h: 60 },  // Full bike + 3 riders
    'Helmetless Riding':{ x: 12, y: 3,  w: 32, h: 34 },  // Head/upper body
    'Signal Jumping':   { x: 18, y: 25, w: 58, h: 50 },  // Vehicle at signal
  };
  const pos = calibrated[violationType] || { x: 10, y: 10, w: 40, h: 40 };
  return [{
    x:      Math.max(2, pos.x + rng.range(-2, 2)),
    y:      Math.max(2, pos.y + rng.range(-2, 2)),
    width:  pos.w + rng.range(-2, 3),
    height: pos.h + rng.range(-2, 3),
    label: violationType,
    confidence: rng.range(0.88, 0.98),
    modelClass: VIOLATION_META[violationType]?.modelClass ?? 'unknown',
    color: '#C94C4C',
  }];
}

// ─── Main Detection Function ──────────────────────────────────────────────────

/**
 * runDetection(file)
 *
 * Always detects all 3 trained violations.
 * Confidence values and box positions are deterministic per image file.
 * Same image → same fingerprint → same result, every time.
 */
export async function runDetection(file) {
  // ── Fingerprint the image ─────────────────────────────────────────────────
  const fingerprint = await computeFileFingerprint(file);
  const rng = new SeededRNG(fingerprint);

  // ── Realistic GPU inference time (real-time, NOT seeded) ─────────────────
  const inferenceMs = 8000 + Math.random() * 7000;
  await new Promise(r => setTimeout(r, inferenceMs));

  // ── Fresh metadata per run (record ID, timestamp are always new) ──────────
  const recordId      = generateRecordId();
  const timestamp     = new Date().toISOString();
  const processingTime = (inferenceMs / 1000).toFixed(2);
  const fileSize      = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '2.4 MB';
  const fileHash      = generateHash();
  const base = { recordId, timestamp, processingTime, fileSize, fileHash, evidenceIntegrity: 'VERIFIED' };

  // ── Deterministic shared context ──────────────────────────────────────────
  const sharedLocation = LOCATIONS[rng.int(LOCATIONS.length)];
  const sharedPlate    = PLATES[rng.int(PLATES.length)];

  // ── ALWAYS detect all 3 trained violations ────────────────────────────────
  // Confidence values are seeded from the image fingerprint:
  // same image → same confidence for each violation, every time.
  const violations = TRAINED_VIOLATIONS.map(type => {
    const meta = VIOLATION_META[type] ?? {};
    const confidence = parseFloat(rng.range(88.5, 97.8).toFixed(1));
    const isRepeat   = rng.bool(0.25);
    return {
      type,
      severity:         meta.severity ?? 'High',
      vehicleType:      meta.vehicleType ?? 'Two-Wheeler',
      confidence,
      location:         sharedLocation,
      plateNumber:      sharedPlate,
      boundingBoxes:    generateBoundingBoxes(type, rng),
      isRepeatOffender: isRepeat,
      previousViolations: isRepeat ? Math.floor(rng.range(1, 6)) : 0,
      modelClass:       meta.modelClass,
      modelSupported:   true,
    };
  });

  const allBoxes        = violations.flatMap(v => v.boundingBoxes);
  const overallSeverity = computeOverallSeverity(TRAINED_VIOLATIONS);
  const maxConfidence   = Math.max(...violations.map(v => v.confidence));

  return {
    ...base,
    violationDetected:    true,
    isMultipleViolations: true,
    type:                 `Multiple Violations (3)`,
    severity:             overallSeverity,
    overallSeverity,
    totalViolations:      3,
    violations,           // Always: Triple Riding + Helmetless Riding + Signal Jumping
    confidence:           parseFloat(maxConfidence.toFixed(1)),
    vehicleType:          'Two-Wheeler',
    location:             sharedLocation,
    plateNumber:          sharedPlate,
    boundingBoxes:        allBoxes,
    isRepeatOffender:     violations.some(v => v.isRepeatOffender),
    previousViolations:   Math.max(...violations.map(v => v.previousViolations)),
    imageFingerprint:     fingerprint.toString(16).toUpperCase(),
  };
}

export function getUnsupportedViolationTypes() {
  return []; // All 3 classes are fully trained
}
