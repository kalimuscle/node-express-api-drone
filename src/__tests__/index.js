//import request from 'supertest';
const request = require("supertest")


const baseURL = "http://localhost:3000"

describe("POST /registering_drone", () => {
    const random = Math.floor(Math.random() * 1000000);
    const newDrone = {
        serial_number: `TEST-${random}`,
         model: "Middleweight",
         weight_limit: 100.00,
         battery_capacity: 0.75,
         state: "LOADING"
    }

    let response;

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
    const random = Math.floor(Math.random() * 1000000);
    
    it("should add drone", async () => {
    });
});