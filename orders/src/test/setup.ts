import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from 'jsonwebtoken';
let mongo: MongoMemoryServer;
// jest.mock('../nats-wrapper');
declare global {
  var signin: () => string[];
  var api: request.SuperTest<request.Test>
}
jest.mock('../nats-wrapper');

beforeAll(async () => {
  jest.setTimeout(300000);
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri();
  await mongoose.connect(mongoURI, {
	})
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.api = request(app)

global.signin = () => {
 // Build a jsonwebtoken payload. { email, id };
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email:'test@test.com'
  }
 // Create a JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  
  // Build a session Object. { jwt: MY_JWT };
  const session = { jwt: token };
  
  //Turn session into json
  const sessionJSON = JSON.stringify(session);

 //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
 //return a string which is cookie with encode data;
  return [`express:sess=${base64}`]
};
