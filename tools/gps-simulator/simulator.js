/**
 * GPS Simulator for BIKOPA (Trans Palu)
 * Simulates buses traveling along Kota Palu corridors at 20-35 km/h.
 * PRD requirement: tools/gps-simulator
 */

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3000/api/v1/telemetry/location';

const BUSES = [
  { hull_number: 'TP-01', lat: -0.7600, lng: 119.8670, speed: 28, heading: 180 },
  { hull_number: 'TP-02', lat: -0.8650, lng: 119.8810, speed: 24, heading: 0 },
  { hull_number: 'TP-03', lat: -0.8990, lng: 119.8780, speed: 26, heading: 240 },
  { hull_number: 'TP-05', lat: -0.9080, lng: 119.8840, speed: 30, heading: 160 },
  { hull_number: 'TP-06', lat: -0.9070, lng: 119.8985, speed: 27, heading: 170 },
];

async function sendPing(bus) {
  // Slight delta to simulate movement
  const deltaLat = (Math.random() - 0.5) * 0.0005;
  const deltaLng = (Math.random() - 0.5) * 0.0005;
  bus.lat += deltaLat;
  bus.lng += deltaLng;

  const payload = {
    hull_number: bus.hull_number,
    lat: parseFloat(bus.lat.toFixed(6)),
    lng: parseFloat(bus.lng.toFixed(6)),
    speed: bus.speed + Math.floor((Math.random() - 0.5) * 4),
    heading: bus.heading,
    accuracy: 6,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log(`[GPS Simulator] Ping ${bus.hull_number}: HTTP ${res.status}`);
  } catch (err) {
    console.warn(`[GPS Simulator] Could not reach ${API_ENDPOINT}: ${err.message}`);
  }
}

console.log('BIKOPA GPS Simulator started. Sending pings every 4 seconds...');
setInterval(() => {
  BUSES.forEach(sendPing);
}, 4000);
