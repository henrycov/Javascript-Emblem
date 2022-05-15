const path = require("path");
const { MongoClient, ServerApiVersion } = require('mongodb');
const res = require("express/lib/response");
require("dotenv").config({ path: path.resolve(__dirname, '.env') })

class MongoDB {

    //Basic constructor of uri,db and collection
    constructor(uri, db, collection) {
        this.databaseAndCollection = { db: `${db}`, collection: `${collection}` };
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

    //Collection setter and getter since it chances frequently
    get collection() {
        return this.databaseAndCollection.collection;
    }

    set collection (collectionName) {
        this.databaseAndCollection.collection = collectionName;
    }

    //Inits user as their own collection
    async createUserCollection(userId) {
        //Find if user id matches with a current collection
        let collectionQuery = await this.client.db(this.databaseAndCollection.db).listCollections({name: userId}).toArray();
        if (collectionQuery.length <= 0) {
            //query all default units to provide initial values for the newuser collection
            this.collection = process.env.MONGO_DEFAULT;
            let defaultUnits = await this.client.db(this.databaseAndCollection.db)
            .collection(this.databaseAndCollection.collection)
            .find().toArray();
            //Create new user collection
            await this.client.db(this.databaseAndCollection.db).createCollection(userId, { capped : true, size : 1000000, max : 5000 });
            this.collection = userId;
            await this.client.db(this.databaseAndCollection.db)
            .collection(this.databaseAndCollection.collection)
            .insertMany(defaultUnits);
            console.log(`New user collection under the id ${userId} has been created.`)
        }
    }

    //Changes to valid user collection
    async switchUserCollection(email) {
        const result = await this.client.db(this.databaseAndCollection.db)
                .collection("users")
                .findOne({email: email});

        this.collection = result._id.toString();
        console.log(`${email} has requested collection ${this.collection}`)
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
            console.log(`List request made to ${this.collection}`)
            return result;
        } catch (e) {
            console.error(e);
        }
    }

    //Insert data into current collection
    async insert(newData) {
        const result = await this.client.db(this.databaseAndCollection.db).collection(this.databaseAndCollection.collection).insertOne(newData);
    }

    async upsert(key, data) {
        await this.client.db(this.databaseAndCollection.db).collection(this.databaseAndCollection.collection).updateOne(key,{$setOnInsert: data}, {upsert: true});
        let result = await this.client.db(this.databaseAndCollection.db).collection(this.databaseAndCollection.collection).findOne(key);
        console.log(`upsert for ${key} has been requested for ${this.collection}`)
        return result;
    }
}

/* Our database and collection */

module.exports = { MongoDB };