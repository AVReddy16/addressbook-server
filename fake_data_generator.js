const { faker } = require("@faker-js/faker");
const { MongoClient, ObjectId } = require("mongodb");

const uri =
  "mongodb+srv://vinitha:6nEye3eS1xaCOyvI@cluster0.28ve347.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function generateAndInsertFakeData() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("db");
    const collection = db.collection("addressBook");

    const records = [];
    const numRecords = 15;

    for (let i = 0; i < numRecords; i++) {
      const address = {
        _id: new ObjectId(),
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 100 }),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      };

      records.push(address);
    }

    await collection.insertMany(records);
    console.log(`Inserted ${numRecords} records into the collection`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

generateAndInsertFakeData();
