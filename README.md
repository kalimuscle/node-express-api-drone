# node-express-api-drone

Service via REST API that allows clients to communicate with the drones (i.e. dispatch controller).

The service include:
 - registering a drone;
 - loading a drone with medication items;
 - checking loaded medication items for a given drone;
 - checking available drones for loading;
 - check drone battery level for a given drone;

 Also have a periodic task to check drones battery levels with history/audit event log configured to show a table in console every 10 seconds

 The app use as database lowdb, a local database in json lighweight as sqlite but easier than sqlite.

 The endpoint use port 3000

 # Deploy
    - npm install
    - npm run dev

# Unit testing
    -npm run test

# Configuration for client REST API
```javascript
 Headers {
    "Content-type": "application/json",
    "Accept": "application/json"
 }
 ```

 # REST API Function registering drone in system

 - Name:/registering_drone
 - Method: POST
 - Body Request Example: 

 ```javascript
    {
        "serial_number": "TOZCA-1CCR22",
        "model": "Middleweight",
        "weight_limit": 100.00,
        "battery_capacity": 0.25,
        "state": "LOADING"
    }
```

 # REST API Function adding medications on given drone

 - Name: /load_medication_on_drone
 - Method: PUT
 - Body Request Example: 
 ```javascript
    {
        "drone_code": "TOZCA-1CCR22",
        "medications": [
            {
                    "code": "MERCA",
                    "name": "Ritalin",
                    "weight": 100.00,
                    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAADs5UlEQVR42uydecAdVXn/P08ii4hgLYpoEkBkUbZEBIQEXHADFcW1at3r0oLdflWrWCWB2NpWf7aCP7VSW2urxX2pG3VJAhgWTawoIpigotalalVABfL8/rgzc8/MnJk5M/e+b97l+2mR8Oa+986995wz3/Oc5/k+IIQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQg"  
            },
            {
                    "code": "WQ_78",
                    "name": "Tylenol",
                    "weight": 50.00,
                    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAADs5UlEQVR42uydecAdVXn/P08ii4hgLYpoEkBkUbZEBIQEXHADFcW1at3r0oLdflWrWCWB2NpWf7aCP7VSW2urxX2pG3VJAhgWTawoIpigotalalVABfL8/rgzc8/MnJk5M/e+b97l+2mR8Oa+986995wz3/Oc5/k+IIQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQg"  
            }
        ]
    }
```

# REST API Function checking medication on given drone

 - Name: /check_medication_on_drone
 - Method: GET
 - Body Request example : 
```javascript
{
  "drone_code": "TOZCA-1CCR22"
}
```

# REST API Function for getting drones ready fro loading

 - Name: /drones_for_loading
 - Method: GET
 - Body Request example : 
```javascript
{

}
```

# REST API Function for getting from given drone it battery capacity

 - Name: /drone_battery_capacity
 - Method: GET
 - Body Request example : 
```javascript
{
    "drone_code": "TOZCA-1CCR22"
}
```
    