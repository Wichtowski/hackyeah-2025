# Location Mocker Tool

A convenient interactive terminal tool for mocking user locations during development and demos.

## 🚀 Quick Start

1. **Start the backend server** (in one terminal):
   ```bash
   npm run dev
   ```

2. **Run the Location Mocker** (in another terminal):
   ```bash
   npm run mock:location
   ```

## 📋 Features

The Location Mocker provides two ways to mock user locations:

### 1. Demo Scenarios (Pre-configured)

**Option 1: Warsaw to Krakow Journey**
- Simulates a single user traveling from Warsaw to Krakow
- Stops at: Warsaw Central → Radom → Kielce → Krakow Main
- Automatically progresses through each location with 1-second delays

**Option 2: Two Users on Different Routes**
- Simulates two users traveling simultaneously
- User 1: Warsaw → Radom
- User 2: Krakow → Gdansk
- Great for testing multi-user incident reporting

### 2. Manual Input

- Manually enter any User ID
- Input custom latitude and longitude coordinates
- Perfect for testing specific scenarios

## 🔌 API Endpoint

The tool communicates with the backend endpoint:

**POST** `/api/mock/location`

**Request Body:**
```json
{
  "userId": "user_123",
  "longitude": 21.0122,
  "latitude": 52.2297
}
```

**Response:**
```json
{
  "message": "User location mocked successfully",
  "userId": "user_123",
  "longitude": 21.0122,
  "latitude": 52.2297
}
```

## 🗺️ Common Coordinates (Poland)

For manual testing, here are some useful coordinates:

| City | Latitude | Longitude |
|------|----------|-----------|
| Warsaw (Central Station) | 52.2297 | 21.0122 |
| Krakow (Main Station) | 50.0647 | 19.9450 |
| Gdansk | 54.3520 | 18.6466 |
| Wroclaw | 51.1079 | 17.0385 |
| Poznan | 52.4064 | 16.9252 |
| Radom | 51.7592 | 20.6419 |
| Kielce | 50.8371 | 20.0651 |

## 🧪 Testing Incident Reporting with Mocked Locations

1. Run the Location Mocker and set a user's location
2. Use the incident reporting API with that userId
3. The system will automatically use the mocked location

**Example workflow:**
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Mock user location
npm run mock:location
# Select option 1 or 3 to set user location

# Terminal 3: Report incident
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "demo_user_1",
    "incidentType": "DELAY",
    "description": "Train delayed by 10 minutes"
  }'
```

## 🛠️ Environment Variables

- `API_URL`: Base URL of the backend API (default: `http://localhost:3000`)

Example:
```bash
API_URL=http://localhost:4000 npm run mock:location
```

## 📝 Notes

- Mocked locations are stored in-memory and will be lost when the backend restarts
- The system will use mocked locations when available, otherwise defaults to Warsaw Central Station
- Each location update includes a timestamp for tracking purposes

