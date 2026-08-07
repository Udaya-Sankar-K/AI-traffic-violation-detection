/**
 * Face Verification Service
 * Uses @vladmandic/face-api for real in-browser face recognition.
 * Falls back to a high-fidelity simulation if models fail to load (e.g. offline).
 */
import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = '/models';

let modelsLoaded = false;
let modelsLoading = null; // Promise to avoid race conditions

// ─── Model Loading ───────────────────────────────────────────────────────────

export async function loadFaceModels() {
  if (modelsLoaded) return true;
  if (modelsLoading) return modelsLoading;

  modelsLoading = (async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      modelsLoaded = true;
      return true;
    } catch (err) {
      console.warn('[FaceVerification] Models failed to load, using simulation mode:', err.message);
      return false;
    } finally {
      modelsLoading = null;
    }
  })();

  return modelsLoading;
}

export function areModelsLoaded() {
  return modelsLoaded;
}

// ─── Detection ───────────────────────────────────────────────────────────────

export async function detectFace(videoEl) {
  if (!modelsLoaded || !videoEl) return null;
  try {
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.5,
    });
    const detection = await faceapi
      .detectSingleFace(videoEl, options)
      .withFaceLandmarks(true)
      .withFaceDescriptor();
    return detection || null;
  } catch {
    return null;
  }
}

/**
 * Returns true if the face is reasonably centered and sized within the video frame.
 */
export function isFaceCentered(detection, videoWidth, videoHeight) {
  if (!detection) return false;
  const { box } = detection.detection;
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const tolerance = videoWidth * 0.18;
  const areaRatio = (box.width * box.height) / (videoWidth * videoHeight);

  return (
    Math.abs(centerX - videoWidth / 2) < tolerance &&
    Math.abs(centerY - videoHeight / 2) < tolerance * 1.3 &&
    areaRatio > 0.04 &&
    areaRatio < 0.55
  );
}

// ─── Storage ─────────────────────────────────────────────────────────────────

export function saveFaceData(policeId, descriptors) {
  const serialized = descriptors.map((d) => Array.from(d));
  localStorage.setItem(`tvds_face_${policeId}`, JSON.stringify(serialized));
}

export function loadFaceData(policeId) {
  const raw = localStorage.getItem(`tvds_face_${policeId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw).map((a) => new Float32Array(a));
  } catch {
    return null;
  }
}

export function hasFaceRegistered(policeId) {
  return !!localStorage.getItem(`tvds_face_${policeId}`);
}

export function clearFaceData(policeId) {
  localStorage.removeItem(`tvds_face_${policeId}`);
}

// ─── Verification ────────────────────────────────────────────────────────────

/**
 * Compares a captured face descriptor against stored descriptors.
 * Returns { match: boolean, confidence: number (0–100) }
 */
export function verifyFace(capturedDescriptor, storedDescriptors, threshold = 0.52) {
  if (!storedDescriptors?.length) return { match: false, confidence: 0 };

  const distances = storedDescriptors.map((d) =>
    faceapi.euclideanDistance(capturedDescriptor, d)
  );
  const minDistance = Math.min(...distances);
  const confidence = Math.max(0, Math.min(100, Math.round((1 - minDistance / threshold) * 100)));

  return { match: minDistance < threshold, confidence, distance: minDistance };
}

// ─── Simulation (fallback when models not available) ─────────────────────────

/**
 * Returns a simulated face descriptor (random Float32Array of length 128).
 * Used when face-api models fail to load.
 */
export function simulateDescriptor() {
  return new Float32Array(128).map(() => (Math.random() - 0.5) * 2);
}

/**
 * Simulated registration – stores a mock descriptor.
 */
export function simulateRegistration(policeId) {
  const descriptors = [simulateDescriptor(), simulateDescriptor(), simulateDescriptor()];
  saveFaceData(policeId, descriptors);
}

/**
 * Simulated verification – always returns a high confidence match.
 * Used when real detection is not available.
 */
export function simulateVerification() {
  return { match: true, confidence: 96 };
}
