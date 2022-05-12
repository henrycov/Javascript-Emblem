const path = require("path");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: path.resolve(__dirname, '.env') })  

class MongoDB {

    //Basic constructor of uri,db and collection
    constructor(uri,db,collection) {
        this.databaseAndCollection = {db: `${db}`, collection:`${collection}`};
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    }

    //Connects client
    async connect() {
        try {
            await this.client.connect();
        } catch (e) {
            console.error(e);
        }
    }
   
    //Closes client
    async close() {
        try {
            await this.client.close();
        } catch (e) {
            console.error(e);
        }
    }

    //Lists data in current collection based on filter
    async list(filter) {
        try {
            //If a filter is not given define empty filter
            if (filter === undefined)
                filter = {};
            
            const cursor = this.client.db(this.databaseAndCollection.db)
            .collection(this.databaseAndCollection.collection)
            .find(filter);
            
            const result = await cursor.toArray();
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    //Insert data into current collection
    async insert(newData) {
        const result = await this.client.db(this.databaseAndCollection.db).collection(this.databaseAndCollection.collection).insertOne(newData);
        console.log(`Entry created with id ${result.insertedId}`);
    }
}

 /* Our database and collection */

module.exports = {MongoDB};