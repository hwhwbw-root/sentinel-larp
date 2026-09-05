# MockSense - Device Simulator

MockSense simulates two Sentinel boxes ("mocksense-0", a CO2 device, and
"mocksense-1", an H2 device) sending readings to the backend, with an
occasional outlier reading mixed in.

## Setup

1. Install the required dependency:
```bash
pip install -r requirements.txt
```

2. In `mocksense.py`, set `DEVICE_API_KEYS["mocksense-0"]` and
   `["mocksense-1"]` to the API keys shown when you create those two
   devices in Device Management (Superadmin only, one-time reveal).
   `SUPABASE_URL`/`DEVICES_URL` already point at this app's ingest and
   threshold endpoints and normally don't need to change.

## Data Schema

Each simulated reading is posted as:

```json
{
  "box_id": "mocksense-0",
  "gas_value": 650.25,
  "temperature": 22.50,
  "humidity": 45.20,
  "alert": 0,
  "created_at": "2026-01-01T00:00:00+08:00"
}
```

`alert` (0/1/2) is computed locally the same way the ESP32 firmware does,
but the backend recomputes it server-side from the device's own
thresholds rather than trusting this value.

## Usage

Run the script with:
```bash
python mocksense.py
```

The script will, per device:
- Fetch that device's thresholds from the backend on startup and every 30 minutes
- Send a normal reading on its configured interval (default: every 10s)
- Send an outlier reading on its configured interval (default: every 2 minutes)
- Print status to the console

Press Ctrl+C to stop.
