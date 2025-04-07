
export const mockReports: Report[] = [
  {
    id: '1',
    userId: 'user1',
    plantTypeId: 'plant1',
    imageUrl: 'https://example.com/image1.jpg',
    timestamp: '2024-04-07T10:00:00Z',
    gpsLat: 36.7538,
    gpsLng: 3.0588,
    city: 'Algiers',
    state: 'Alger',
    detectionResult: 'Healthy',
    confidenceScore: 0.95,
    status: 'reviewed',
    notes: 'Plant appears healthy with good growth',
    reviewedBy: 'expert1',
    reviewedAt: '2024-04-07T11:00:00Z',
    farmerName: 'Ahmed Benali',
    plantType: 'Tomato'
  },
  {
    id: '2',
    userId: 'user2',
    plantTypeId: 'plant2',
    imageUrl: 'https://example.com/image2.jpg',
    timestamp: '2024-04-07T09:30:00Z',
    gpsLat: 36.7648,
    gpsLng: 3.0688,
    city: 'Oran',
    state: 'Oran',
    detectionResult: 'Leaf Blight',
    confidenceScore: 0.88,
    status: 'submitted',
    notes: 'Yellow spots on leaves',
    farmerName: 'Fatima Zohra',
    plantType: 'Potato'
  },
  {
    id: '3',
    userId: 'user3',
    plantTypeId: 'plant3',
    imageUrl: 'https://example.com/image3.jpg',
    timestamp: '2024-04-06T15:00:00Z',
    gpsLat: 36.7738,
    gpsLng: 3.0788,
    city: 'Constantine',
    state: 'Constantine',
    detectionResult: 'Root Rot',
    confidenceScore: 0.92,
    status: 'reviewed',
    notes: 'Severe root damage observed',
    reviewedBy: 'expert2',
    reviewedAt: '2024-04-06T16:00:00Z',
    farmerName: 'Karim Hadj',
    plantType: 'Wheat'
  }
];

export const plantTypes = [
  { id: 'plant1', name: 'Tomato' },
  { id: 'plant2', name: 'Potato' },
  { id: 'plant3', name: 'Wheat' },
  { id: 'plant4', name: 'Corn' },
  { id: 'plant5', name: 'Olive' }
];

export const states = [
  'Alger',
  'Oran',
  'Constantine',
  'Annaba',
  'Setif'
]; 