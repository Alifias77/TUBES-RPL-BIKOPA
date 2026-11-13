import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isWithinKotaPalu,
  haversineDistance,
  calculateETA,
  computeTrackingStatus,
  findNearbyStops,
} from '../src/lib/geo/index.ts';

test('BR-01: isWithinKotaPalu accurately validates coordinates', () => {
  // Taman GOR Palu (inside)
  assert.equal(isWithinKotaPalu(-0.897, 119.877), true);

  // Pelabuhan Pantoloan (inside)
  assert.equal(isWithinKotaPalu(-0.7138, 119.855), true);

  // Outside Kota Palu (e.g. Jakarta, Makassar, or out of bbox)
  assert.equal(isWithinKotaPalu(-6.2, 106.8), false);
  assert.equal(isWithinKotaPalu(-5.14, 119.42), false);
});

test('haversineDistance computes accurate ground distance in meters', () => {
  // Taman GOR to Balai Kota (approx 2.3 km)
  const d = haversineDistance(-0.897, 119.877, -0.9038, 119.8972);
  assert.ok(d > 2000 && d < 2600, `Expected ~2.3km, got ${d}m`);
});

test('BR-03: calculateETA respects minimum speed and dwell times', () => {
  // 3 km with 0 km/h (should use min 8 km/h = 2.22 m/s -> ~1350s + 40s dwell = 24 mins)
  const eta0 = calculateETA(3000, 0, 2);
  assert.ok(eta0 >= 20 && eta0 <= 26, `Expected ~24 mins, got ${eta0}`);

  // 3 km with 30 km/h (8.33 m/s -> 360s + 20s dwell = 380s = 7 mins)
  const eta30 = calculateETA(3000, 30, 1);
  assert.equal(eta30, 7);
});

test('BR-06: computeTrackingStatus categorizes active, stale, and offline', () => {
  const now = new Date();
  assert.equal(computeTrackingStatus(now.toISOString()), 'ACTIVE');

  const staleTime = new Date(Date.now() - 45000);
  assert.equal(computeTrackingStatus(staleTime.toISOString()), 'STALE');

  const offlineTime = new Date(Date.now() - 150000);
  assert.equal(computeTrackingStatus(offlineTime.toISOString()), 'OFFLINE');
});

test('BR-04: findNearbyStops returns up to 3 closest stops and flags out-of-service', () => {
  // Near Taman GOR (actual GPS: -0.89629, 119.87152)
  const nearGor = findNearbyStops(-0.89629, 119.87152, 5000, 3);
  assert.equal(nearGor.isOutOfServiceArea, false);
  assert.ok(nearGor.stops.length <= 3);
  assert.equal(nearGor.stops[0].stop.stop_code, 'HLT-002'); // Taman GOR closest

  // Point way far outside service area (> 5km)
  const farAway = findNearbyStops(-0.5, 119.5, 5000, 3);
  assert.equal(farAway.isOutOfServiceArea, true);
  assert.equal(farAway.stops.length, 0);
});
