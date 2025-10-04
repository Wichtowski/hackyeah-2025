# Quick Demo: Location Mocker

## Step-by-Step Demo Guide

### Setup (2 terminals needed)

**Terminal 1 - Start the backend:**
```bash
cd journey-radar-backend
npm run dev
```

Wait for: `Server running at http://localhost:3000`

**Terminal 2 - Run Location Mocker:**
```bash
cd journey-radar-backend
npm run mock:location
```

You'll see an interactive menu like this:
```
╔════════════════════════════════════════╗
║     🗺️  Location Mocker Tool 🗺️       ║
╚════════════════════════════════════════╝

Demo Scenarios:
  1 - Warsaw to Krakow journey (single user)
  2 - Two users on different routes

Manual Options:
  3 - Manually input user location
  4 - Exit

Select an option (1-4):
```

## Demo Scenarios

### Scenario 1: Warsaw to Krakow Journey
This simulates a user traveling along a route, perfect for testing incident reporting at different points along the journey.

**What happens:**
1. User starts at Warsaw Central Station
2. Moves to Radom (halfway point)
3. Continues to Kielce
4. Arrives at Krakow Main Station

Each location update happens with a 1-second delay for visualization.

### Scenario 2: Two Users Different Routes
Tests multiple users traveling simultaneously - great for testing how incidents from different users appear on the map.

**What happens:**
- User 1: Warsaw → Radom (south direction)
- User 2: Krakow → Gdansk (north direction)

### Scenario 3: Manual Input
Perfect for testing specific coordinates or simulating users at custom locations.

**Example:**
```
Select an option (1-4): 3
Enter User ID: alice_123
Enter Latitude: 52.2297
Enter Longitude: 21.0122
✓ Location mocked successfully!
  User: alice_123
  Location: (52.2297, 21.0122)
```

## Testing with Incident Reporting

Once you've mocked a user location, test incident reporting:

**Terminal 3 - Report incident:**
```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo_user_1",
    "incidentType": "DELAY",
    "description": "Train delayed by 15 minutes"
  }'
```

**Response includes the mocked location:**
```json
{
  "id": "incident-1234567890-abc123",
  "location": {
    "longitude": 21.0122,
    "latitude": 52.2297
  },
  "reporter": {
    "id": "demo_user_1",
    "type": "USER"
  },
  "incidentType": "DELAY",
  "description": "Train delayed by 15 minutes",
  "timestamp": "2025-10-04T22:00:00.000Z"
}
```

## Tips for Demo

1. **Run Scenario 1 first** to show basic location tracking
2. **Report an incident** after setting location to show integration
3. **Run Scenario 2** to demonstrate multi-user capabilities
4. **Use Manual Input** to show flexibility for any location

## Troubleshooting

**"Connection refused" error:**
- Make sure the backend is running (`npm run dev`)
- Check that it's running on port 3000

**"Invalid coordinates" error:**
- Latitude must be between -90 and 90
- Longitude must be between -180 and 180

**Want to use a different API URL?**
```bash
API_URL=http://localhost:4000 npm run mock:location
```

