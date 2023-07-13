//import request from 'supertest';
const request = require("supertest")


const baseURL = "http://localhost:3000"

const random = Math.floor(Math.random() * 1000000);
const newDrone = {
  serial_number: `TEST-${random}`,
  model: "Middleweight",
  weight_limit: 100.00,
  battery_capacity: 0.75,
  state: "LOADING"
}

let response;

describe("POST /registering_drone", () => {
    
    it("should add drone", async () => {
      response = await request(baseURL).post("/registering_drone").send(newDrone);
      expect(response.statusCode).toBe(201);
      response = await request(baseURL).post("/registering_drone").send(newDrone);
      expect(response.statusCode).toBe(500);
    });

    it("drone already exist", async () => {
      response = await request(baseURL).post("/registering_drone").send(newDrone);
      expect(response.statusCode).toBe(500);
    });

    it("detecting fail in fields (validation)", async () => {
      let i = 0;
      // aqui voy a tomar newDrone e ir modificando los field para que no sean validos
      // y debe devolver un 500
      let droneTest = newDrone;
      let name = Array(101);
      name.fill('l');
      droneTest['serial_number'] = name.toString();
      response = await request(baseURL).post("/registering_drone").send(droneTest);
      expect(response.statusCode).toBe(500);

      droneTest = newDrone;
      i++;
      droneTest['serial_number'] += i.toString();
      droneTest['model'] = 'No valid model';
      response = await request(baseURL).post("/registering_drone").send(droneTest);
      expect(response.statusCode).toBe(500);

      droneTest = newDrone;
      i++;
      droneTest['serial_number'] += i.toString();
      droneTest['weight_limit'] = 800;
      response = await request(baseURL).post("/registering_drone").send(droneTest);
      expect(response.statusCode).toBe(500);

      droneTest = newDrone;
      i++;
      droneTest['serial_number'] += i.toString();
      droneTest['battery_capacity'] = 1.89;
      response = await request(baseURL).post("/registering_drone").send(droneTest);
      expect(response.statusCode).toBe(500);

      droneTest = newDrone;
      i++;
      droneTest['serial_number'] += i.toString();
      droneTest['battery_capacity'] = -0.2;
      response = await request(baseURL).post("/registering_drone").send(droneTest);
      expect(response.statusCode).toBe(500);

      droneTest = newDrone;
      i++;
      droneTest['serial_number'] += i.toString();
      droneTest['state'] = "Zen mode";
      response = await request(baseURL).post("/registering_drone").send(droneTest);
      expect(response.statusCode).toBe(500);
    });
});

describe("PUT /load_medication_on_drone", () => {
  let i = 0;
  const medicationOnDrone = {
    drone_code: newDrone['serial_number'],
    medications: [
      {
        code: "MEDICATION",
        name: "Ritalin",
        weight: 10.00,
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAADs5UlEQVR42uydecAdVXn/P08ii4hgLYpoEkBkUbZEBIQEXHADFcW1at3r0oLdflWrWCWB2NpWf7aCP7VSW2urxX2pG3VJAhgWTawoIpigotalalVABfL8/rgzc8/MnJk5M/e+b97l+2mR8Oa+986995wz3/Oc5/k+IIQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQg"  
      }
    ]
  }
    
    it("should add medication on drone", async () => {
      response = await request(baseURL).put("/load_medication_on_drone").send(medicationOnDrone);
      expect(response.statusCode).toBe(200);
    });

    it("should fail add medication drone not exist", async () => {
      let testExist = {
        drone_code: "CHEWACA355",
        medications: [
          {
            code: "MEDICATION",
            name: "Ritalin",
            weight: 10.00,
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAADs5UlEQVR42uydecAdVXn/P08ii4hgLYpoEkBkUbZEBIQEXHADFcW1at3r0oLdflWrWCWB2NpWf7aCP7VSW2urxX2pG3VJAhgWTawoIpigotalalVABfL8/rgzc8/MnJk5M/e+b97l+2mR8Oa+986995wz3/Oc5/k+IIQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQg"  
          }
        ]
      };
      response = await request(baseURL).put("/load_medication_on_drone").send(testExist);
      expect(response.statusCode).toBe(500);
    });

    it("should update weigth for same medication on drone successfully", async () => {
      let testWeightSuccess = medicationOnDrone;
      testWeightSuccess['medications'][0]['weight'] += 50;
      response = await request(baseURL).put("/load_medication_on_drone").send(testWeightSuccess);
      expect(response.statusCode).toBe(200);
    });

    it("should fail update weigth for same medication on drone", async () => {
      let testWeightFail = medicationOnDrone;
      testWeightFail['medications'][0]['weight'] += 50;
      response = await request(baseURL).put("/load_medication_on_drone").send(testWeightFail);
      expect(response.statusCode).toBe(500);
    });

    it("detecting fail in fields of medications (validation)", async () => {
      let test = medicationOnDrone;

      test['medications'][0]['name'] = 'TEst&99';
      response = await request(baseURL).put("/load_medication_on_drone").send(test);
      expect(response.statusCode).toBe(500);

      test = medicationOnDrone;

      test['medications'][0]['weight'] = 1000;
      response = await request(baseURL).put("/load_medication_on_drone").send(test);
      expect(response.statusCode).toBe(500);

      test = medicationOnDrone;

      test['medications'][0]['code'] = 'Code&*&*&252525';
      response = await request(baseURL).put("/load_medication_on_drone").send(test);
      expect(response.statusCode).toBe(500);

      test['medications'][0]['image'] = 'image/base64/png YUI(E*(&E*(&E*(&E*(&E*(&E';
      response = await request(baseURL).put("/load_medication_on_drone").send(test);
      expect(response.statusCode).toBe(500);
    });
});

describe("GET /check_medication_on_drone", () => {

  let i = 0;
  let params = {
    drone_code: newDrone['serial_number']
  }
    
  it("should get medications of given drone", async () => {
    response = await request(baseURL).get("/check_medication_on_drone").send(params);
    expect(response.statusCode).toBe(200);
    expect(response.body.value.length).toBe(1);
  });

  it("should fail getting medications of given drone", async () => {
    params['drone_code'] = 'CHEWA';
    response = await request(baseURL).get("/check_medication_on_drone").send(params);
    expect(response.statusCode).toBe(500);
  });
});

describe("GET /drones_for_loading", () => {
  let params = {
  }
    
  it("should get drones", async () => {
    response = await request(baseURL).get("/drones_for_loading").send(params);
    expect(response.statusCode).toBe(200);
    expect(response.body.value.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /drone_battery_capacity", () => {
  let params = {
    drone_code: newDrone['serial_number']
  }
    
  it("should get battery capacity of given drone", async () => {
    response = await request(baseURL).get("/drone_battery_capacity").send(params);
    expect(response.statusCode).toBe(200);
  });

  it("should fail getting battery capacity of given drone", async () => {
    params['drone_code'] = 'CHEWA';
    response = await request(baseURL).get("/drone_battery_capacity").send(params);
    expect(response.statusCode).toBe(500);
  });
});