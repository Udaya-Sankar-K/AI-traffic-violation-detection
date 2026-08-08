/**
 * AI Detection Engine — TVDS v3.0
 *
 * KEY RULES:
 * 1. Violation FAMILIES always fire together — Triple Riding always includes Helmetless Riding.
 * 2. Minimum 2 violations always detected (unless truly clean image).
 * 3. All 7 core violation types are active and detectable.
 * 4. Realistic processing time: 8–15 seconds.
 * 5. Never miss a co-occurring violation.
 */

import { ALL_VIOLATION_TYPES, VIOLATION_META, computeOverallSeverity } from '../utils/mockData';

// ─── Locations ────────────────────────────────────────────────────────────────

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

// ─── VIOLATION FAMILIES ───────────────────────────────────────────────────────
// Members of the same family ALWAYS occur together. If one is selected,
// ALL members of the family are included automatically.
//
// This is the core fix: Triple Riding ALWAYS comes with Helmetless Riding.

const VIOLATION_FAMILIES = [
  {
    id: 'two_wheeler_unsafe',
    // Triple riding + no helmet — always together, very high frequency
    members: ['Triple Riding', 'Helmetless Riding'],
    extraChance: 0.45,   // 45% chance of also adding Illegal Parking
    extra: ['Illegal Parking'],
    weight: 0.40,        // 40% of all detections are two-wheeler families
  },
  {
    id: 'helmet_only',
    // Single rider, no helmet (but not triple riding)
    members: ['Helmetless Riding'],
    extraChance: 0.30,
    extra: ['Illegal Parking'],
    weight: 0.18,
  },
  {
    id: 'signal_violation',
    members: ['Signal Jumping', 'Zebra-Crossing Violation'],
    extraChance: 0.20,
    extra: ['Wrong-Way Driving'],
    weight: 0.18,
  },
  {
    id: 'parking_cluster',
    members: ['Illegal Parking', 'No-Parking Zone Violation'],
    extraChance: 0.25,
    extra: ['Helmetless Riding'],
    weight: 0.14,
  },
  {
    id: 'wrong_way',
    members: ['Wrong-Way Driving', 'Signal Jumping'],
    extraChance: 0.15,
    extra: ['Zebra-Crossing Violation'],
    weight: 0.10,
  },
];

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
 * Get realistic bounding box position per violation type.
 * Different violations appear in different image regions.
 */
function generateBoundingBoxes(violationType, index = 0) {
  const regionMap = {
    'Helmetless Riding':         { x: 12, y:  5, w: 35, h: 35 },  // Head/upper body area
    'Triple Riding':             { x:  5, y: 10, w: 55, h: 55 },  // Full vehicle + riders
    'Signal Jumping':            { x: 18, y: 25, w: 60, h: 45 },
    'Illegal Parking':           { x:  5, y: 38, w: 65, h: 48 },
    'No-Parking Zone Violation': { x:  3, y: 42, w: 70, h: 44 },
    'Zebra-Crossing Violation':  { x: 10, y: 48, w: 75, h: 38 },
    'Wrong-Way Driving':         { x: 15, y: 10, w: 60, h: 65 },
  };

  const r = regionMap[violationType] ?? { x: 8 + index * 15, y: 12, w: 38, h: 40 };
  const jitter = () => rand(-4, 4);

  return [{
    x: Math.max(2, r.x + jitter()),
    y: Math.max(2, r.y + jitter()),
    width:  r.w + rand(-4, 6),
    height: r.h + rand(-4, 6),
    label: violationType,
    confidence: rand(0.84, 0.97),
    modelClass: VIOLATION_META[violationType]?.modelClass ?? 'unknown',
    color: VIOLATION_META[violationType]?.color ?? '#C94C4C',
  }];
}

/**
 * Build a single violation payload.
 */
function buildViolationPayload(type, sharedLocation, sharedPlate, index = 0) {
  const meta = VIOLATION_META[type] ?? {};
  const isRepeat = Math.random() < 0.28;
  return {
    type,
    severity: meta.severity ?? 'Medium',
    vehicleType: meta.vehicleType ?? 'Two-Wheeler',
    confidence: parseFloat(rand(85.5, 97.8).toFixed(1)),
    location: sharedLocation,
    plateNumber: sharedPlate,
    boundingBoxes: generateBoundingBoxes(type, index),
    isRepeatOffender: isRepeat,
    previousViolations: isRepeat ? Math.floor(rand(1, 7)) : 0,
    modelClass: meta.modelClass,
    modelSupported: true,
  };
}

/**
 * Pick a violation family based on weights.
 */
function pickFamily() {
  const total = VIOLATION_FAMILIES.reduce((s, f) => s + f.weight, 0);
  let r = Math.random() * total;
  for (const family of VIOLATION_FAMILIES) {
    r -= family.weight;
    if (r <= 0) return family;
  }
  return VIOLATION_FAMILIES[0];
}

// ─── Main Detection Function ──────────────────────────────────────────────────

/**
 * runDetection(file)
 *
 * Realistic AI simulation:
 * - Takes 8–15 seconds to process (realistic for deep learning inference)
 * - 92% chance of detecting violations
 * - Violations always detected in families (Triple Riding always with Helmetless Riding)
 * - Returns complete DetectionResult with all violations listed
 */
export async function runDetection(file) {
  // ── Realistic AI processing time: 8–15 seconds ──────────────────────────
  await new Promise(r => setTimeout(r, rand(8000, 15000)));

  const recordId = generateRecordId();
  const timestamp = new Date().toISOString();
  const processingTime = rand(8.2, 14.8).toFixed(2);
  const fileSize = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : '2.4 MB';
  const fileHash = generateHash();
  const base = { recordId, timestamp, processingTime, fileSize, fileHash, evidenceIntegrity: 'VERIFIED' };

  // ── 8% chance: clean image, no violation ────────────────────────────────
  if (Math.random() < 0.08) {
    return {
      ...base,
      violationDetected: false,
      message: 'No violation detected in this media.',
      confidence: parseFloat(rand(90, 96).toFixed(1)),
      boundingBoxes: [],
    };
  }

  // ── Shared context (same vehicle/incident) ───────────────────────────────
  const sharedLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const sharedPlate = PLATES[Math.floor(Math.random() * PLATES.length)];

  // ── Pick a violation family ──────────────────────────────────────────────
  const family = pickFamily();

  // Start with all mandatory family members
  const violationTypes = [...family.members];

  // Possibly add extra violations from the family's extras
  if (Math.random() < family.extraChance && family.extra?.length > 0) {
    for (const extra of family.extra) {
      if (!violationTypes.includes(extra)) {
        violationTypes.push(extra);
      }
    }
  }

  // Build violation payloads for each detected type
  const violations = violationTypes.map((type, i) =>
    buildViolationPayload(type, sharedLocation, sharedPlate, i)
  );

  const allBoxes = violations.flatMap(v => v.boundingBoxes);
  const overallSeverity = computeOverallSeverity(violationTypes);
  const maxConfidence = Math.max(...violations.map(v => v.confidence));
  const isMultiple = violations.length > 1;

  // ── Always return isMultipleViolations=true when >1 violations ──────────
  return {
    ...base,
    violationDetected: true,
    isMultipleViolations: isMultiple,
    type: isMultiple ? `Multiple Violations (${violations.length})` : violations[0].type,
    severity: overallSeverity,
    overallSeverity,
    totalViolations: violations.length,
    violations,                          // ALL violations listed here
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
  return []; // All 7 violation types are fully enabled
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
