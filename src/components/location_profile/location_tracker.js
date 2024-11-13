let trackingInterval;
let previousPosition = null;

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
}

// Function to get current position
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        }

        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(error),
            { enableHighAccuracy: true }
        );
    });
}

// First function - Start tracking location
function startLocationTracking() {
    // Initial location check

    console.log("running");
    
    checkAndSendLocation();

    // Set interval for subsequent checks
    trackingInterval = setInterval(checkAndSendLocation, 5000); // 10 seconds
}

// Helper function to check and send location
async function checkAndSendLocation() {
    console.log("rrr");
    
    try {
        const currentPosition = await getCurrentPosition();
        const currentLocation = {
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
            timestamp: new Date().toISOString()
        };

        // If this is the first position, send it immediately
        if (!previousPosition) {
            // socket.emit('location_update', currentLocation);
            console.log(currentLocation , "aaa")
            previousPosition = currentLocation;
            return;
        }

        // Calculate distance from previous position
        const distance = calculateDistance(
            previousPosition.latitude,
            previousPosition.longitude,
            currentLocation.latitude,
            currentLocation.longitude
        );
        console.log('distance moved' , distance );
      
        document.getElementsByTagName('div')[0].innerText = `moved ${distance}`
        
        // If distance is more than 50 meters, send the update
        if (distance >= 3 ) {
            // socket.emit('location_update', currentLocation);
            console.log(currentLocation , "rrr");
            
            previousPosition = currentLocation;
        } else {
            // Update previous position without sending to backend
            previousPosition = currentLocation;
        }

    } catch (error) {
        console.error('Error getting location:', error);
    }
}

// Second function - Stop tracking location
function stopLocationTracking() {
    console.log("stopped");
    
    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
        previousPosition = null;
    }
} 

