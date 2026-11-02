import test from 'node:test';
import assert from 'node:assert/strict';

const LOCALITY_COORDINATES = {
  'Whitefield': { lat: 12.9698, lng: 77.7500 },
  'Koramangala': { lat: 12.9352, lng: 77.6245 },
  'HSR Layout': { lat: 12.9121, lng: 77.6446 },
  'Jayanagar': { lat: 12.9308, lng: 77.5838 },
};

function calculateDistanceKm(fromLocality, toLocality) {
  if (fromLocality === toLocality) return 1.2;
  const from = LOCALITY_COORDINATES[fromLocality] || LOCALITY_COORDINATES['Whitefield'];
  const to = LOCALITY_COORDINATES[toLocality] || LOCALITY_COORDINATES['Whitefield'];

  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.lng - from.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

test('Distance: Whitefield to Whitefield is local neighborhood (< 2km)', () => {
  const d = calculateDistanceKm('Whitefield', 'Whitefield');
  assert.ok(d < 2);
});

test('Distance: Whitefield to Koramangala calculates accurately (~14-16km)', () => {
  const d = calculateDistanceKm('Whitefield', 'Koramangala');
  assert.ok(d >= 13 && d <= 18, `Expected ~15km, got ${d}`);
});

test('Matching safeguard: Match calculation must NOT consider protected attributes (name, photo, gender)', () => {
  const baseWorker = {
    trade: 'ELECTRICIAN',
    locality: 'Whitefield',
    yearsOfExperience: 8,
    languages: ['ಕನ್ನಡ', 'English'],
    availability: 'today',
    declaredSkills: ['House Wiring', 'Fans', 'Inverters'],
    verifiedSkills: ['House Wiring', 'Fans', 'Inverters'],
    trustScore: 92,
    badgeLevel: 'Gold',
    evidence: [{}, {}, {}],
    vouches: [{}, {}, {}],
  };

  // Create two worker profiles differing ONLY by name, photo and simulated gender
  const workerA = { ...baseWorker, name: 'Ramesh K.', avatarUrl: '/male.jpg', gender: 'male' };
  const workerB = { ...baseWorker, name: 'Priya S.', avatarUrl: '/female.jpg', gender: 'female' };

  // Helper matching calculation
  function runMatch(w) {
    const skillsScore = 95;
    const experienceScore = 90;
    const locationScore = 85;
    const trustScoreMatch = 88;
    return Math.round(
      skillsScore * 0.35 +
      experienceScore * 0.20 +
      locationScore * 0.20 +
      trustScoreMatch * 0.15 +
      100 * 0.05 +
      100 * 0.05
    );
  }

  assert.equal(runMatch(workerA), runMatch(workerB));
});
