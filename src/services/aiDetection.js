/**
 * AI Detection Engine — TVDS
 *
 * Architecture:
 *  - Each violation type maps to a YOLO/Roboflow model class name (modelClass)
 *  - modelSupported = true  → detection runs (mock or real API)
 *  - modelSupported = false → detection is skipped and a "MODEL_REQUIRED" flag is set
 *  - To enable a real Roboflow model, replace the mock block with the commented API call below
 *
 * Adding a new violation type:
 *  1. Add entry to ALL_VIOLATION_TYPES in mockData.js
 *  2. Set modelSupported: true when the YOLO class is trained and deployed
 *  3. No other file changes needed
 */

import { ALL_VIOLATION_TYPES, VIOLATION_META, computeOverallSeverity } from '../utils/mockData';

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
  'KA-02-GG-6666',
];

// Only types the current mock model "supports" are eligible for random selection
const SUPPORTED_TYPES  = ALL_VIOLATION_TYPES.filter(v => v.modelSupported);
const UNSUPPORTED_TYPES = ALL_VIOLATION_TYPES.filter(v => !v.modelSupported);

// Probability weights (must sum to 1.0 across supported types)
const PROBABILITY_MAP = {
  'Helmetless Riding':   0.28,
  'Signal Jumping':      0.22,
  'Illegal Parking':     0.15,
  'Wrong-Way Driving':   0.12,
  'Multiple Violations': 0.08,
  // New types below activate automatically when modelSupported → true
  'No-Parking Zone Violation': 0.07,
  'Zebra-Crossing Violation':  0.05,
  'Triple Riding':             0.03,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rand(min, max) { return Math.random() * (max - min) + min; }

function generateRecordId() {
  const d = new Date().toISOString().split('T')[0].replace(/-/g, '');
  return `VIO-${d}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

function generateHash() {
  return `SHA256:${Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)).join('')}`;
}

/**
 * Generate annotated bounding boxes for one violation type.
 * Each box includes (x, y, width, height) as percentage of image dimensions.
 */
function generateBoundingBoxes(violationType, count = 1) {
  return Array.from({ length: count }, (_, i) => ({
    x: rand(8 + i * 20, 35 + i * 20),
    y: rand(10, 55),
    width: rand(18, 38),
    height: rand(14, 32),
    label: violationType,
    confidence: rand(0.82, 0.98),
    modelClass: VIOLATION_META[violationType]?.modelClass ?? 'unknown',
  }));
}

/**
 * Build a single detected violation payload.
 * Used for both single and multi-violation results.
 */
function buildViolationPayload(violationType, file, overrides = {}) {
  const meta = VIOLATION_META[violationType] ?? {};
  const confidence = parseFloat(rand(84, 98.5).toFixed(1));
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const plate = PLATES[Math.floor(Math.random() * PLATES.length)];
  const isRepeat = Math.random() < 0.25;

  return {
    type: violationType,
    severity: meta.severity ?? 'Medium',
    vehicleType: meta.vehicleType ?? 'Vehicle',
    confidence,
    location,
    plateNumber: plate,
    boundingBoxes: generateBoundingBoxes(violationType, 1),
    isRepeatOffender: isRepeat,
    previousViolations: isRepeat ? Math.floor(rand(2, 6)) : 0,
    modelClass: meta.modelClass,
    modelSupported: meta.modelSupported ?? true,
    ...overrides,
  };
}

/**
 * Pick a violation type based on weighted probability.
 * Only samples from currently supported types.
 */
function sampleViolationType() {
  const pool = SUPPORTED_TYPES.filter(v => PROBABILITY_MAP[v.type]);
  const total = pool.reduce((s, v) => s + (PROBABILITY_MAP[v.type] ?? 0), 0);
  let r = Math.random() * total;
  for (const v of pool) {
    r -= PROBABILITY_MAP[v.type] ?? 0;
    if (r <= 0) return v.type;
  }
  return pool[0]?.type ?? 'Helmetless Riding';
}

// ─── Main Detection Function ──────────────────────────────────────────────────

/**
 * runDetection(file)
 *
 * Simulates YOLO/Roboflow detection with realistic timing and results.
 * Returns a structured DetectionResult object.
 *
 * DetectionResult shape:
 * {
 *   violationDetected: boolean
 *   recordId: string
 *   timestamp: string
 *   processingTime: string (seconds)
 *   fileSize: string
 *   fileHash: string
 *   evidenceIntegrity: 'VERIFIED'
 *   // Single violation:
 *   type?: string
 *   severity?: string
 *   confidence?: number
 *   vehicleType?: string
 *   location?: string
 *   plateNumber?: string
 *   boundingBoxes?: BoundingBox[]
 *   isRepeatOffender?: boolean
 *   previousViolations?: number
 *   // Multiple violations:
 *   isMultipleViolations?: boolean
 *   violations?: ViolationDetail[]
 *   overallSeverity?: string
 *   totalViolations?: number
 *   // Unsupported model:
 *   modelRequired?: boolean
 *   modelNote?: string
 * }
 */
export async function runDetection(file) {
  // Simulate AI processing time
  await new Promise(r => setTimeout(r, rand(1500, 3000)));

  const recordId = generateRecordId();
  const timestamp = new Date().toISOString();
  const processingTime = rand(1.2, 2.8).toFixed(2);
  const fileSize = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '2.4 MB';
  const fileHash = generateHash();
  const base = { recordId, timestamp, processingTime, fileSize, fileHash, evidenceIntegrity: 'VERIFIED' };

  // 85% chance of detecting a violation
  if (Math.random() > 0.85) {
    return {
      ...base,
      violationDetected: false,
      message: 'No violation detected in this media.',
      confidence: parseFloat(rand(88, 95).toFixed(1)),
      boundingBoxes: [],
    };
  }

  // 15% chance of multiple violations
  const isMultiple = Math.random() < 0.15;

  if (isMultiple) {
    // Pick 2–3 distinct supported violation types
    const shuffled = [...SUPPORTED_TYPES].sort(() => Math.random() - 0.5);
    const count = Math.floor(rand(2, Math.min(4, shuffled.length)));
    const picked = shuffled.slice(0, count).map(v => v.type);

    const violations = picked.map((type, i) => ({
      ...buildViolationPayload(type, file),
      boundingBoxes: generateBoundingBoxes(type, 1).map(b => ({
        ...b,
        x: b.x + i * 18, // offset boxes so they don't overlap
      })),
    }));

    const allBoxes = violations.flatMap(v => v.boundingBoxes);
    const overallSeverity = computeOverallSeverity(picked);
    const maxConfidence = Math.max(...violations.map(v => v.confidence));

    return {
      ...base,
      violationDetected: true,
      isMultipleViolations: true,
      type: 'Multiple Violations',
      severity: overallSeverity,
      overallSeverity,
      totalViolations: count,
      violations,
      confidence: parseFloat(maxConfidence.toFixed(1)),
      vehicleType: violations[0]?.vehicleType ?? 'Vehicle',
      location: violations[0]?.location,
      plateNumber: violations[0]?.plateNumber,
      boundingBoxes: allBoxes,
      isRepeatOffender: violations.some(v => v.isRepeatOffender),
      previousViolations: Math.max(...violations.map(v => v.previousViolations)),
    };
  }

  // Single violation
  const type = sampleViolationType();
  const payload = buildViolationPayload(type, file);

  return {
    ...base,
    violationDetected: true,
    isMultipleViolations: false,
    ...payload,
  };
}

// ─── Model Support Checker ────────────────────────────────────────────────────

/**
 * Returns which violation types are not yet model-supported.
 * Display this in Settings/Admin page to inform operators.
 */
export function getUnsupportedViolationTypes() {
  return UNSUPPORTED_TYPES.map(v => ({
    type: v.type,
    modelClass: v.modelClass,
    note: v.modelNote ?? `Train a YOLO model with class "${v.modelClass}" and set modelSupported: true`,
  }));
}

// ─── Real Roboflow API (swap in when ready) ───────────────────────────────────
//
// export async function runDetection(file) {
//   const formData = new FormData();
//   formData.append('file', file);
//   const res = await fetch(
//     `https://detect.roboflow.com/${import.meta.env.VITE_ROBOFLOW_MODEL_ID}/${import.meta.env.VITE_ROBOFLOW_VERSION}` +
//     `?api_key=${import.meta.env.VITE_ROBOFLOW_API_KEY}`,
//     { method: 'POST', body: formData }
//   );
//   const data = await res.json();
//   // Map Roboflow predictions → TVDS DetectionResult
//   return mapRoboflowResponse(data);
// }
//
// function mapRoboflowResponse(data) {
//   const predictions = data.predictions ?? [];
//   if (predictions.length === 0) return { violationDetected: false, ... };
//   // Map each prediction.class → VIOLATION_META[class].type
//   // Group, compute severity, build bounding boxes
//   // Return in DetectionResult format above
// }
