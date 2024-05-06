import mongoose from 'mongoose';

async function testMongoConnection() {
    try {
        const dbUri = process.env.DB_URI || 'mongodb://LukeT:Csc648GroupProject!@3.145.7.29:27017/CSC_648_Database'; // Replace with your actual MongoDB URI
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to Database");

        // Attempt to insert a document into a 'test' collection
        const testSchema = new mongoose.Schema({ name: String });
        const Test = mongoose.model('Test', testSchema);
        const testDoc = new Test({ name: 'Test Document' });

        await testDoc.save();
        console.log("Document inserted successfully");

        // Clean up after test
        await Test.deleteOne({ _id: testDoc._id });
        console.log("Cleanup successful");

        await mongoose.disconnect();
        console.log("Disconnected from Database");
    } catch (err) {
        console.error("Error during MongoDB operation:", err);
    }
}

testMongoConnection();
