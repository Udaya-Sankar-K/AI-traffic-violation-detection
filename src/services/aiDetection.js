/**
 * AI Detection Engine — TVDS
 *
 * All 8 violation types are now active.
 * Smart co-occurrence: related violations fire together (e.g. helmetless + triple riding).
 * Multi-violation probability: 55% (was 15%).
 * No-violation rate: 8% (was 15%).
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
  'KR Puram, Bangalore',
  'Marathahalli Bridge, Bangalore',
];

const PLATES = [
  'KA-01-HH-1234', 'KA-02-MN-5678', 'KA-03-PP-9012',
  'TN-07-AQ-7890', 'MH-12-AB-2222', 'KA-53-BC-3333',
  'AP-28-CD-4444', 'TS-09-EF-5555', 'KA-04-ZZ-1111',
  'KA-02-GG-6666', 'KA-05-AB-8888', 'MH-14-XX-4321',
];

// All types are now supported
const SUPPORTED_TYPES = ALL_VIOLATION_TYPES.filter(v => v.modelSupported && v.type !== 'Multiple Violations');

// ─── Smart Co-occurrence Groups ───────────────────────────────────────────────
// When one violation is detected, these other violations commonly appear together.
// This mirrors real-world traffic violation patterns.

const CO_OCCURRENCE_GROUPS = [
  // Two-wheeler violations cluster
  {
    primary: ['Helmetless Riding', 'Triple Riding'],
    secondaries: ['Helmetless Riding', 'Triple Riding', 'Illegal Parking'],
    weight: 0.32,  // 32% of all detections are two-wheeler clusters
  },
  // Signal/junction violations
  {
    primary: ['Signal Jumping'],
    secondaries: ['Signal Jumping', 'Wrong-Way Driving', 'Zebra-Crossing Violation'],
    weight: 0.18,
  },
  // Parking violations cluster
  {
    primary: ['Illegal Parking', 'No-Parking Zone Violation'],
    secondaries: ['Illegal Parking', 'No-Parking Zone Violation'],
    weight: 0.14,
  },
  // High severity cluster
  {
    primary: ['Wrong-Way Driving', 'Signal Jumping'],
    secondaries: ['Wrong-Way Driving', 'Signal Jumping', 'Zebra-Crossing Violation'],
    weight: 0.10,
  },
];

// Standalone violation weights (for single-violation detections)
const SINGLE_WEIGHTS = {
  'Helmetless Riding':         0.26,
  'Triple Riding':             0.18,
  'Signal Jumping':            0.16,
  'Illegal Parking':           0.14,
  'No-Parking Zone Violation': 0.10,
  'Zebra-Crossing Violation':  0.08,
  'Wrong-Way Driving':         0.08,
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
 * Generate annotated bounding boxes.
 * Positions vary by violation type for realistic placement.
 */
function generateBoundingBoxes(violationType, index = 0) {
  // Different violations appear in different areas of the image
  const regionMap = {
    'Helmetless Riding':         { xBase: 10, yBase: 5,  wBase: 28, hBase: 35 },
    'Triple Riding':             { xBase: 8,  yBase: 10, wBase: 45, hBase: 50 },
    'Signal Jumping':            { xBase: 20, yBase: 30, wBase: 55, hBase: 40 },
    'Illegal Parking':           { xBase: 5,  yBase: 40, wBase: 60, hBase: 45 },
    'No-Parking Zone Violation': { xBase: 5,  yBase: 45, wBase: 65, hBase: 40 },
    'Zebra-Crossing Violation':  { xBase: 15, yBase: 50, wBase: 70, hBase: 35 },
    'Wrong-Way Driving':         { xBase: 20, yBase: 15, wBase: 55, hBase: 60 },
  };

  const region = regionMap[violationType] ?? { xBase: 10 + index * 20, yBase: 15, wBase: 30, hBase: 35 };
  const jitter = () => rand(-6, 6);

  return [{
    x: Math.max(2, region.xBase + jitter()),
    y: Math.max(2, region.yBase + jitter()),
    width: region.wBase + rand(-5, 8),
    height: region.hBase + rand(-5, 8),
    label: violationType,
    confidence: rand(0.83, 0.97),
    modelClass: VIOLATION_META[violationType]?.modelClass ?? 'unknown',
    color: VIOLATION_META[violationType]?.color ?? '#C94C4C',
  }];
}

/**
 * Build a single detected violation payload.
 */
function buildViolationPayload(violationType, file, sharedLocation = null, sharedPlate = null) {
  const meta = VIOLATION_META[violationType] ?? {};
  const confidence = parseFloat(rand(85, 97.5).toFixed(1));
  const location = sharedLocation ?? LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const plate = sharedPlate ?? PLATES[Math.floor(Math.random() * PLATES.length)];
  const isRepeat = Math.random() < 0.28;

  return {
    type: violationType,
    severity: meta.severity ?? 'Medium',
    vehicleType: meta.vehicleType ?? 'Two-Wheeler',
    confidence,
    location,
    plateNumber: plate,
    boundingBoxes: generateBoundingBoxes(violationType),
    isRepeatOffender: isRepeat,
    previousViolations: isRepeat ? Math.floor(rand(2, 7)) : 0,
    modelClass: meta.modelClass,
    modelSupported: true,
  };
}

/**
 * Pick a single violation type based on weighted probability.
 */
function sampleSingleViolationType() {
  const entries = Object.entries(SINGLE_WEIGHTS);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * total;
  for (const [type, weight] of entries) {
    r -= weight;
    if (r <= 0) return type;
  }
  return 'Helmetless Riding';
}

/**
 * Pick a co-occurrence group based on weights.
 */
function sampleCoOccurrenceGroup() {
  const total = CO_OCCURRENCE_GROUPS.reduce((s, g) => s + g.weight, 0);
  let r = Math.random() * total;
  for (const group of CO_OCCURRENCE_GROUPS) {
    r -= group.weight;
    if (r <= 0) return group;
  }
  return CO_OCCURRENCE_GROUPS[0];
}

// ─── Main Detection Function ──────────────────────────────────────────────────

/**
 * runDetection(file)
 *
 * Simulates realistic YOLO/Roboflow detection.
 * - 8% chance: no violation
 * - 37% chance: single violation
 * - 55% chance: multiple violations (2–3 co-occurring)
 *
 * Returns a structured DetectionResult object.
 */
export async function runDetection(file) {
  // Realistic AI processing delay
  await new Promise(r => setTimeout(r, rand(1800, 3200)));

  const recordId = generateRecordId();
  const timestamp = new Date().toISOString();
  const processingTime = rand(1.5, 3.2).toFixed(2);
  const fileSize = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '2.4 MB';
  const fileHash = generateHash();
  const base = { recordId, timestamp, processingTime, fileSize, fileHash, evidenceIntegrity: 'VERIFIED' };

  const roll = Math.random();

  // ── 8% chance: no violation ──────────────────────────────────────────────
  if (roll < 0.08) {
    return {
      ...base,
      violationDetected: false,
      message: 'No violation detected in this media.',
      confidence: parseFloat(rand(89, 96).toFixed(1)),
      boundingBoxes: [],
    };
  }

  // Shared location + plate for all violations in the same detection (same vehicle)
  const sharedLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const sharedPlate = PLATES[Math.floor(Math.random() * PLATES.length)];

  // ── 37% chance: single violation ─────────────────────────────────────────
  if (roll < 0.45) {
    const type = sampleSingleViolationType();
    const payload = buildViolationPayload(type, file, sharedLocation, sharedPlate);
    return {
      ...base,
      violationDetected: true,
      isMultipleViolations: false,
      ...payload,
    };
  }

  // ── 55% chance: multiple violations (co-occurrence group) ─────────────────
  const group = sampleCoOccurrenceGroup();

  // Pick 2–3 violations from the group's secondaries (no duplicates)
  const available = [...new Set(group.secondaries)];
  const shuffled = available.sort(() => Math.random() - 0.5);
  const count = Math.min(shuffled.length, Math.floor(rand(2, 3.99)));
  const picked = shuffled.slice(0, count);

  const violations = picked.map((type) => ({
    ...buildViolationPayload(type, file, sharedLocation, sharedPlate),
  }));

  const allBoxes = violations.flatMap(v => v.boundingBoxes);
  const overallSeverity = computeOverallSeverity(picked);
  const maxConfidence = Math.max(...violations.map(v => v.confidence));

  return {
    ...base,
    violationDetected: true,
    isMultipleViolations: true,
    type: `Multiple Violations (${count})`,
    severity: overallSeverity,
    overallSeverity,
    totalViolations: count,
    violations,
    confidence: parseFloat(maxConfidence.toFixed(1)),
    vehicleType: violations[0]?.vehicleType ?? 'Two-Wheeler',
    location: sharedLocation,
    plateNumber: sharedPlate,
    boundingBoxes: allBoxes,
    isRepeatOffender: violations.some(v => v.isRepeatOffender),
    previousViolations: Math.max(...violations.map(v => v.previousViolations)),
  };
}

// ─── Model Support Checker ────────────────────────────────────────────────────
export function getUnsupportedViolationTypes() {
  return []; // All violation types are now model-supported
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
//   return mapRoboflowResponse(data);
// }
