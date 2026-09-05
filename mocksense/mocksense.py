import json
import time
import random
import requests
from datetime import datetime
import threading
from zoneinfo import ZoneInfo

# Configuration
# NOTE: this used to point at a shared Supabase project with a single anon
# key used by every simulated (and real) device - now each device has its
# own Sentinel API key (issued from Device Management > Add Device), so
# DEVICE_API_KEYS below maps box_id -> that device's key. Only these
# endpoints/keys and the request-building code that uses them changed;
# calculate_alert() and the data generators are untouched.
SUPABASE_URL = "https://sentinel.example.com/api/devices/ingest"
DEVICES_URL = "https://sentinel.example.com/api/devices/thresholds"

# Device configurations - ADJUST INTERVALS HERE (in seconds)
DEVICES_CONFIG = {
    "mocksense-0": {
        "device_type": "CO2",
        "interval": 10,  # Send data every 10 seconds
        "outlier_interval": 120  # Send outlier every 120 seconds (2 minutes)
    },
    "mocksense-1": {
        "device_type": "H2",
        "interval": 10,  # Send data every 10 seconds
        "outlier_interval": 120  # Send outlier every 120 seconds (2 minutes)
    }
}

# Per-device Sentinel API keys - replace with the keys shown when each
# mocksense-* device is created in Device Management. Treat these like
# passwords: do not commit real keys to source control.
DEVICE_API_KEYS = {
    "mocksense-0": "REPLACE_WITH_MOCKSENSE_0_SENTINEL_API_KEY",
    "mocksense-1": "REPLACE_WITH_MOCKSENSE_1_SENTINEL_API_KEY",
}

# Default Threshold values (fallback)
DEFAULT_THRESHOLDS = {
    "CO2": {
        "alert": 1000.0,
        "dangerous": 1500.0
    },
    "H2": {
        "alert": 1.0,
        "dangerous": 2.0
    }
}

# Live thresholds storage: { "box_id": { "alert": val, "dangerous": val } }
DEVICE_THRESHOLDS = {}

def fetch_device_config(box_id):
    """Fetch threshold configuration from Supabase for a specific device"""
    api_key = DEVICE_API_KEYS[box_id]
    headers = {
        'apikey': api_key,
        'Authorization': f'Bearer {api_key}'
    }

    try:
        # Query for specific box_id
        url = f"{DEVICES_URL}?box_id=eq.{box_id}&select=treshold_alert,treshold_dangerous"
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                device_data = data[0]
                t_alert = device_data.get('treshold_alert')
                t_danger = device_data.get('treshold_dangerous')
                
                # Update local cache if values exist
                if t_alert is not None and t_danger is not None:
                    DEVICE_THRESHOLDS[box_id] = {
                        "alert": float(t_alert),
                        "dangerous": float(t_danger)
                    }
                    print(f"✓ [{box_id}] Config updated from Supabase: Alert={t_alert}, Dangerous={t_danger}")
                    return True
        else:
            print(f"⚠ [{box_id}] Failed to fetch config: {response.status_code}")
            
    except Exception as e:
        print(f"⚠ [{box_id}] Config fetch exception: {str(e)}")
    
    return False

def calculate_alert(gas_value, device_type, box_id):
    """
    Calculate alert level based on gas value and thresholds
    Returns: 0 (normal), 1 (alert), 2 (dangerous)
    """
    # Try to use device-specific thresholds first
    if box_id in DEVICE_THRESHOLDS:
        thresholds = DEVICE_THRESHOLDS[box_id]
    else:
        # Fallback to defaults
        thresholds = DEFAULT_THRESHOLDS[device_type]
    
    if gas_value >= thresholds["dangerous"]:
        return 2  # Dangerous
    elif gas_value >= thresholds["alert"]:
        return 1  # Alert
    else:
        return 0  # Normal

def send_payload(data):
    """Send the payload to Supabase"""
    api_key = DEVICE_API_KEYS[data["box_id"]]
    headers = {
        'Content-Type': 'application/json',
        'apikey': api_key,
        'Authorization': f'Bearer {api_key}',
        'Prefer': 'return=minimal'
    }

    try:
        response = requests.post(SUPABASE_URL, data=json.dumps(data), headers=headers)
        if response.status_code in [200, 201]:
            alert_status = ["NORMAL", "ALERT", "DANGEROUS"][data["alert"]]
            print(f"✓ [{data['box_id']}] Sent successfully - Gas: {data['gas_value']} | Status: {alert_status}")
        else:
            print(f"✗ [{data['box_id']}] Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"✗ [{data['box_id']}] Exception: {str(e)}")

def generate_normal_data(box_id, device_type):
    """Generate normal sensor data based on device type"""
    if device_type == "CO2":
        gas_value = round(random.uniform(400.0, 800.0), 2)  # Normal CO2 range in ppm
    else:  # H2
        gas_value = round(random.uniform(0.1, 0.5), 2)      # Normal H2 range in ppm
    
    data = {
        "box_id": box_id,
        "gas_value": gas_value,
        "temperature": round(random.uniform(20.0, 25.0), 2),  # Normal temperature range
        "humidity": round(random.uniform(40.0, 60.0), 2),     # Normal humidity range
        "alert": calculate_alert(gas_value, device_type, box_id),
        "created_at": datetime.now(ZoneInfo("Asia/Kuala_Lumpur")).isoformat()
    }
    
    return data

def generate_outlier_data(box_id, device_type):
    """Generate outlier sensor data based on device type"""
    if device_type == "CO2":
        gas_value = round(random.uniform(1500.0, 2000.0), 2)  # High CO2 outlier in ppm
    else:  # H2
        gas_value = round(random.uniform(2.0, 5.0), 2)        # High H2 outlier in ppm
    
    data = {
        "box_id": box_id,
        "gas_value": gas_value,
        "temperature": round(random.uniform(35.0, 50.0), 2),  # High temperature outlier
        "humidity": round(random.uniform(80.0, 95.0), 2),     # High humidity outlier
        "alert": calculate_alert(gas_value, device_type, box_id),
        "created_at": datetime.now(ZoneInfo("Asia/Kuala_Lumpur")).isoformat()
    }
    
    return data

def device_simulator(box_id, device_type, interval, outlier_interval):
    """Simulate a single device sending data"""
    print(f"Starting simulator for {box_id} ({device_type})")
    print(f"  - Normal data interval: {interval} seconds")
    print(f"  - Outlier interval: {outlier_interval} seconds")
    
    # Initial Config Fetch
    print(f"  ⬇ [{box_id}] Fetching initial config...")
    fetch_device_config(box_id)
    
    last_outlier_time = time.time()
    last_config_fetch_time = time.time()
    config_fetch_interval = 30 * 60  # 30 minutes in seconds
    
    # Send initial normal payload
    data = generate_normal_data(box_id, device_type)
    send_payload(data)
    
    while True:
        time.sleep(interval)
        
        current_time = time.time()
        
        # Check if it's time to fetch config (every 30 minutes)
        if current_time - last_config_fetch_time >= config_fetch_interval:
            print(f"  ⬇ [{box_id}] 30 min check: Refreshing thresholds...")
            fetch_device_config(box_id)
            last_config_fetch_time = current_time
        
        # Check if it's time to send an outlier
        if current_time - last_outlier_time >= outlier_interval:
            data = generate_outlier_data(box_id, device_type)
            send_payload(data)
            print(f"  ⚠️  [{box_id}] OUTLIER SENT")
            last_outlier_time = current_time
        else:
            # Send normal data
            data = generate_normal_data(box_id, device_type)
            send_payload(data)

def main():
    print("=" * 60)
    print("SENTINEL DEVICE SIMULATOR")
    print("=" * 60)
    print("\nDevices configured:")
    for box_id, config in DEVICES_CONFIG.items():
        print(f"  - {box_id}: {config['device_type']} device")
    print("\n" + "=" * 60 + "\n")
    
    # Create a thread for each device
    threads = []
    for box_id, config in DEVICES_CONFIG.items():
        thread = threading.Thread(
            target=device_simulator,
            args=(box_id, config["device_type"], config["interval"], config["outlier_interval"]),
            daemon=True
        )
        threads.append(thread)
        thread.start()
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nStopping all device simulators...")
        print("Goodbye!")
        exit(0)

if __name__ == "__main__":
    main()