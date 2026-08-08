// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// VIOLATION DEFINITIONS â€” Single source of truth for all violation metadata
// To add a new violation: add an entry here and the entire app updates automatically
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const ALL_VIOLATION_TYPES = [
  {
    type: 'Helmetless Riding',
    severity: 'Medium',
    vehicleType: 'Two-Wheeler',
    icon: 'ðŸª–',
    color: '#C9824B',
    description: 'Rider or pillion not wearing a helmet',
    modelClass: 'no_helmet',          // YOLO/Roboflow class name
    modelSupported: true,
  },
  {
    type: 'Signal Jumping',
    severity: 'High',
    vehicleType: 'Car',
    icon: 'ðŸš¦',
    color: '#C94C4C',
    description: 'Vehicle crossing red-light signal',
    modelClass: 'signal_jump',
    modelSupported: true,
  },
  {
    type: 'Illegal Parking',
    severity: 'Medium',
    vehicleType: 'SUV',
    icon: 'ðŸ…¿ï¸',
    color: '#287C78',
    description: 'Vehicle parked in a restricted/unauthorized zone',
    modelClass: 'illegal_parking',
    modelSupported: true,
  },
  {
    type: 'No-Parking Zone Violation',
    severity: 'Medium',
    vehicleType: 'Car',
    icon: 'ðŸš«',
    color: '#287C78',
    description: 'Vehicle parked inside a designated no-parking area',
    modelClass: 'no_parking_zone',
    modelSupported: false,            // Set true when YOLO model class is trained
    modelNote: 'Requires YOLO model class "no_parking_zone" â€” see SETUP.md Â§AI',
  },
  {
    type: 'Zebra-Crossing Violation',
    severity: 'High',
    vehicleType: 'Car',
    icon: 'ðŸ¦“',
    color: '#C9824B',
    description: 'Vehicle stopped on or obstructing pedestrian zebra crossing',
    modelClass: 'zebra_crossing_block',
    modelSupported: false,
    modelNote: 'Requires YOLO model class "zebra_crossing_block" â€” see SETUP.md Â§AI',
  },
  {
    type: 'Wrong-Way Driving',
    severity: 'High',
    vehicleType: 'Motorcycle',
    icon: 'â¬…ï¸',
    color: '#DC2626',
    description: 'Vehicle travelling against designated traffic direction',
    modelClass: 'wrong_way',
    modelSupported: true,
  },
  {
    type: 'Triple Riding',
    severity: 'Medium',
    vehicleType: 'Two-Wheeler',
    icon: 'ðŸ‘¥',
    color: '#10B981',
    description: 'Motorcycle carrying more than two riders',
    modelClass: 'triple_riding',
    modelSupported: false,
    modelNote: 'Requires YOLO model class "triple_riding" â€” see SETUP.md Â§AI',
  },
  {
    type: 'Multiple Violations',
    severity: 'Critical',
    vehicleType: 'Truck',
    icon: 'âš ï¸',
    color: '#C94C4C',
    description: 'Multiple simultaneous violations detected',
    modelClass: 'multiple',
    modelSupported: true,
  },
];

// Quick lookup maps
export const VIOLATION_META = Object.fromEntries(
  ALL_VIOLATION_TYPES.map(v => [v.type, v])
);

export const ALL_VIOLATION_TYPE_NAMES = ALL_VIOLATION_TYPES.map(v => v.type);

// Overall severity calculation for multiple violations
export function computeOverallSeverity(violationTypes) {
  const order = { Low: 0, Medium: 1, High: 2, Critical: 3 };
  let max = 0;
  for (const t of violationTypes) {
    const meta = VIOLATION_META[t];
    if (meta) max = Math.max(max, order[meta.severity] ?? 0);
  }
  return ['Low', 'Medium', 'High', 'Critical'][max];
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MOCK VIOLATION RECORDS â€” Updated with all 8 violation types
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_VIOLATIONS = [
  {
    id: 'VIO-2024-001',
    type: 'Helmetless Riding',
    severity: 'Medium',
    confidence: 94.7,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    vehicleType: 'Two-Wheeler',
    officerId: 'POL-9821',
    officerName: 'SI Rahul Sharma',
    location: 'MG Road Junction, Bangalore',
    imageUrl: null,
    status: 'Pending',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'KA-01-HH-1234',
  },
  {
    id: 'VIO-2024-002',
    type: 'Signal Jumping',
    severity: 'High',
    confidence: 91.2,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    vehicleType: 'Car',
    officerId: 'POL-9821',
    officerName: 'SI Rahul Sharma',
    location: 'Brigade Road, Bangalore',
    imageUrl: null,
    status: 'Confirmed',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'KA-02-MN-5678',
  },
  {
    id: 'VIO-2024-003',
    type: 'Illegal Parking',
    severity: 'Medium',
    confidence: 88.9,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    vehicleType: 'SUV',
    officerId: 'POL-4456',
    officerName: 'ASI Priya Nair',
    location: 'Indiranagar, Bangalore',
    imageUrl: null,
    status: 'Resolved',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'KA-03-PP-9012',
  },
  {
    id: 'VIO-2024-004',
    type: 'Multiple Violations',
    severity: 'Critical',
    confidence: 97.3,
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    vehicleType: 'Truck',
    officerId: 'POL-7732',
    officerName: 'Insp. Arjun Mehta',
    location: 'Outer Ring Road, Bangalore',
    imageUrl: null,
    status: 'Action Taken',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'KA-05-XY-3456',
    repeatOffender: true,
    previousViolations: 3,
    subViolations: ['Signal Jumping', 'Helmetless Riding', 'Wrong-Way Driving'],
  },
  {
    id: 'VIO-2024-005',
    type: 'Wrong-Way Driving',
    severity: 'High',
    confidence: 93.1,
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    vehicleType: 'Motorcycle',
    officerId: 'POL-4456',
    officerName: 'ASI Priya Nair',
    location: 'Hosur Road, Bangalore',
    imageUrl: null,
    status: 'Pending',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'TN-07-AQ-7890',
  },
  {
    id: 'VIO-2024-006',
    type: 'No-Parking Zone Violation',
    severity: 'Medium',
    confidence: 89.5,
    timestamp: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    vehicleType: 'Car',
    officerId: 'POL-9821',
    officerName: 'SI Rahul Sharma',
    location: 'Koramangala, Bangalore',
    imageUrl: null,
    status: 'Confirmed',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'KA-04-ZZ-1111',
    repeatOffender: true,
    previousViolations: 2,
  },
  {
    id: 'VIO-2024-007',
    type: 'Zebra-Crossing Violation',
    severity: 'High',
    confidence: 85.4,
    timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    vehicleType: 'Car',
    officerId: 'POL-7732',
    officerName: 'Insp. Arjun Mehta',
    location: 'Electronic City, Bangalore',
    imageUrl: null,
    status: 'Pending',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'MH-12-AB-2222',
  },
  {
    id: 'VIO-2024-008',
    type: 'Triple Riding',
    severity: 'Medium',
    confidence: 91.6,
    timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    vehicleType: 'Two-Wheeler',
    officerId: 'POL-4456',
    officerName: 'ASI Priya Nair',
    location: 'Whitefield, Bangalore',
    imageUrl: null,
    status: 'Resolved',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'KA-53-BC-3333',
  },
  {
    id: 'VIO-2024-009',
    type: 'Signal Jumping',
    severity: 'High',
    confidence: 96.2,
    timestamp: new Date(Date.now() - 1000 * 60 * 620).toISOString(),
    vehicleType: 'Bus',
    officerId: 'POL-7732',
    officerName: 'Insp. Arjun Mehta',
    location: 'MG Road Junction, Bangalore',
    imageUrl: null,
    status: 'Action Taken',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'KA-01-F-9999',
    repeatOffender: true,
    previousViolations: 4,
  },
  {
    id: 'VIO-2024-010',
    type: 'Helmetless Riding',
    severity: 'Medium',
    confidence: 88.3,
    timestamp: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    vehicleType: 'Two-Wheeler',
    officerId: 'POL-9821',
    officerName: 'SI Rahul Sharma',
    location: 'Brigade Road, Bangalore',
    imageUrl: null,
    status: 'Pending',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'AP-28-CD-4444',
  },
  {
    id: 'VIO-2024-011',
    type: 'No-Parking Zone Violation',
    severity: 'Medium',
    confidence: 87.1,
    timestamp: new Date(Date.now() - 1000 * 60 * 760).toISOString(),
    vehicleType: 'SUV',
    officerId: 'POL-4456',
    officerName: 'ASI Priya Nair',
    location: 'Indiranagar 100ft Road, Bangalore',
    imageUrl: null,
    status: 'Confirmed',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'TS-09-EF-5555',
  },
  {
    id: 'VIO-2024-012',
    type: 'Wrong-Way Driving',
    severity: 'High',
    confidence: 95.8,
    timestamp: new Date(Date.now() - 1000 * 60 * 820).toISOString(),
    vehicleType: 'Car',
    officerId: 'POL-7732',
    officerName: 'Insp. Arjun Mehta',
    location: 'Outer Ring Road, Bangalore',
    imageUrl: null,
    status: 'Pending',
    evidenceIntegrity: 'VERIFIED',
    plateNumber: 'KA-02-GG-6666',
    repeatOffender: true,
    previousViolations: 2,
  },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// CHARTS & TREND DATA â€” Updated with 4 new violation categories
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_DAILY_TREND = [
  { day: 'Mon', violations: 38, helmets: 10, signals: 7,  parking: 5, noParking: 4, zebra: 3, wrongWay: 5, triple: 4 },
  { day: 'Tue', violations: 45, helmets: 12, signals: 9,  parking: 6, noParking: 5, zebra: 4, wrongWay: 5, triple: 4 },
  { day: 'Wed', violations: 54, helmets: 15, signals: 12, parking: 7, noParking: 6, zebra: 5, wrongWay: 5, triple: 4 },
  { day: 'Thu', violations: 41, helmets: 11, signals: 8,  parking: 6, noParking: 5, zebra: 3, wrongWay: 5, triple: 3 },
  { day: 'Fri', violations: 68, helmets: 19, signals: 17, parking: 9, noParking: 7, zebra: 6, wrongWay: 6, triple: 4 },
  { day: 'Sat', violations: 59, helmets: 17, signals: 14, parking: 8, noParking: 6, zebra: 5, wrongWay: 5, triple: 4 },
  { day: 'Sun', violations: 29, helmets: 8,  signals: 6,  parking: 5, noParking: 3, zebra: 2, wrongWay: 3, triple: 2 },
];

export const MOCK_MONTHLY_TREND = [
  { month: 'Jan', violations: 420, resolved: 380, wrongWay: 28, zebra: 34, noParking: 52, triple: 40 },
  { month: 'Feb', violations: 380, resolved: 340, wrongWay: 24, zebra: 30, noParking: 45, triple: 36 },
  { month: 'Mar', violations: 510, resolved: 460, wrongWay: 35, zebra: 42, noParking: 61, triple: 48 },
  { month: 'Apr', violations: 490, resolved: 430, wrongWay: 33, zebra: 40, noParking: 58, triple: 45 },
  { month: 'May', violations: 620, resolved: 560, wrongWay: 44, zebra: 52, noParking: 74, triple: 58 },
  { month: 'Jun', violations: 580, resolved: 510, wrongWay: 40, zebra: 48, noParking: 69, triple: 54 },
  { month: 'Jul', violations: 710, resolved: 640, wrongWay: 50, zebra: 60, noParking: 84, triple: 66 },
  { month: 'Aug', violations: 262, resolved: 210, wrongWay: 18, zebra: 22, noParking: 31, triple: 24 },
];

export const MOCK_CATEGORY_DATA = [
  { name: 'Helmetless Riding',       value: 28, color: '#C9824B' },
  { name: 'Signal Jumping',          value: 22, color: '#C94C4C' },
  { name: 'Illegal Parking',         value: 14, color: '#287C78' },
  { name: 'No-Parking Zone',         value: 12, color: '#287C78' },
  { name: 'Zebra Crossing',          value: 10, color: '#C9824B' },
  { name: 'Wrong-Way Driving',       value: 8,  color: '#DC2626' },
  { name: 'Triple Riding',           value: 4,  color: '#10B981' },
  { name: 'Multiple Violations',     value: 2,  color: '#64748B' },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HOTSPOTS â€” Updated with violation type breakdown
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_HOTSPOTS = [
  { location: 'MG Road Junction',     count: 142, risk: 'Critical', topViolation: 'Signal Jumping' },
  { location: 'Brigade Road',          count: 98,  risk: 'High',    topViolation: 'Helmetless Riding' },
  { location: 'Outer Ring Road',       count: 87,  risk: 'High',    topViolation: 'Wrong-Way Driving' },
  { location: 'Hosur Road',            count: 73,  risk: 'Medium',  topViolation: 'Triple Riding' },
  { location: 'Koramangala 7th Block', count: 61,  risk: 'Medium',  topViolation: 'No-Parking Zone' },
  { location: 'Electronic City',       count: 52,  risk: 'Medium',  topViolation: 'Zebra Crossing' },
  { location: 'Whitefield Main Road',  count: 44,  risk: 'Low',     topViolation: 'Helmetless Riding' },
  { location: 'Indiranagar 100ft',     count: 38,  risk: 'Low',     topViolation: 'Illegal Parking' },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ALERTS â€” Updated with new violation categories
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_ALERTS = [
  {
    id: 'ALT-001',
    type: 'CRITICAL',
    title: 'Multiple Violations Spike',
    message: 'Multiple critical violations detected at MG Road. Wrong-Way Driving + Signal Jumping.',
    time: '2 min ago',
    isRead: false,
  },
  {
    id: 'ALT-002',
    type: 'REPEAT_OFFENDER',
    title: 'Repeat Offender Detected',
    message: 'Vehicle KA-05-XY-3456 flagged for 4th violation this month (Wrong-Way Driving).',
    time: '15 min ago',
    isRead: false,
  },
  {
    id: 'ALT-003',
    type: 'HIGH',
    title: 'Zebra-Crossing Blockage Detected',
    message: 'Vehicle obstructing pedestrian crossing on Electronic City Flyover.',
    time: '32 min ago',
    isRead: true,
  },
  {
    id: 'ALT-004',
    type: 'SPIKE',
    title: 'Triple Riding Spike â€” Weekend',
    message: 'Saturday triple riding violations up 55% vs last weekend. Whitefield area.',
    time: '1 hr ago',
    isRead: true,
  },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// OFFICER DATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const MOCK_OFFICER = {
  uid: 'demo-uid',
  fullName: 'Rahul Sharma',
  policeId: 'POL-9821',
  designation: 'Sub-Inspector',
  station: 'MG Road Police Station',
  district: 'Central Bangalore',
  email: 'rahul.sharma@bangalorepolice.gov.in',
  casesProcessed: 145,
  casesUploaded: 168,
  reviewsCompleted: 132,
  lastLogin: new Date().toISOString(),
  joinDate: '2019-03-15',
  badge: 'KA/SI/2019/0821',
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// AI RECOMMENDATIONS â€” Extended for all 8 violation types
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const RECOMMENDATIONS = {
  'Helmetless Riding': {
    text: 'Conduct helmet enforcement drives at peak hours (8-10 AM, 5-8 PM). Set up checkpoints near residential clusters.',
    action: 'Deploy checkpoint at location',
    priority: 'Medium',
  },
  'Signal Jumping': {
    text: 'Increase signal monitoring during peak traffic. Consider red-light cameras for automated detection.',
    action: 'Install automated red-light camera',
    priority: 'High',
  },
  'Illegal Parking': {
    text: 'Deploy tow trucks and issue notices. Consider permanent designated parking zones as a fix.',
    action: 'Deploy tow truck team',
    priority: 'Medium',
  },
  'No-Parking Zone Violation': {
    text: 'Install physical "No Parking" bollards and signage. Increase patrol presence at designated no-parking stretches.',
    action: 'Install physical no-parking barriers',
    priority: 'Medium',
  },
  'Zebra-Crossing Violation': {
    text: 'URGENT: Pedestrian safety at risk. Install automated pedestrian-priority signal + speed bumps before crossing.',
    action: 'Pedestrian safety infrastructure upgrade',
    priority: 'High',
  },
  'Wrong-Way Driving': {
    text: 'URGENT: Install physical barriers and clear directional signage. Increase patrol presence immediately.',
    action: 'Emergency road signage deployment',
    priority: 'High',
  },
  'Triple Riding': {
    text: 'Set up two-wheeler checkpoints at colony exits. Issue awareness notices. Increase fines for repeat offenders.',
    action: 'Two-wheeler checkpoint at exit roads',
    priority: 'Medium',
  },
  'Multiple Violations': {
    text: 'CRITICAL: Initiate repeat offender protocol. Issue mandatory court appearance notice and vehicle impoundment.',
    action: 'Initiate legal proceedings + impoundment',
    priority: 'Critical',
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SEVERITY CONFIG â€” Unchanged, kept for backward compatibility
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const SEVERITY_CONFIG = {
  Low:      { color: '#287C78', bg: 'rgba(40,124,120,0.1)',   border: 'rgba(40,124,120,0.3)',   label: 'LOW',      badge: 'badge-green'    },
  Medium:   { color: '#C9824B', bg: 'rgba(201,130,75,0.1)', border: 'rgba(201,130,75,0.3)', label: 'MEDIUM',   badge: 'badge-orange'   },
  High:     { color: '#C94C4C', bg: 'rgba(201,76,76,0.1)',  border: 'rgba(201,76,76,0.3)',  label: 'HIGH',     badge: 'badge-red'      },
  Critical: { color: '#C94C4C', bg: 'rgba(201,76,76,0.15)', border: 'rgba(201,76,76,0.5)',  label: 'CRITICAL', badge: 'badge-critical'  },
};

