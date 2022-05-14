const http = require("http");
const path = require("path");
const express = require("express");
const database = require("./mongoDB");
const formatter = require("./format");
let bodyParser = require("body-parser");
const req = require("express/lib/request");
const app = express();

const serverPort = 5000; 

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + '/public'));
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const uri = `mongodb+srv://${userName}:${password}@cluster0.zocte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
let db = process.env.MONGO_DB_NAME;
let collection = process.env.MONGO_COLLECTION;

let mongoClient = new database.MongoDB(uri,db,collection);
(async() => {await mongoClient.connect()})();

app.get('/', function(req, res){
    res.redirect('/battle');
});

app.get("/battle", async (req, res) => {
    let units = await mongoClient.list();

    let formattedUnits = formatter.unitsToSelection(units);

    let variables = 
    {unitSelectionBlue: formattedUnits,
        unitSelectionRed: formattedUnits,
        blueUnit: formatter.defaultUnit,
        redUnit: formatter.defaultUnit,
        something: {var: "thing"}
    }

    res.render("battle",variables);
});

app.get("/battle/blueSelect", async (req, res) => {
    let units = await mongoClient.list();
    
    let blueUnit = units.find(unit => unit.name === req.query.blueName);

    let variables = 
    {unitSelectionBlue: formatter.unitsToSelection(units, blueUnit.name),
        unitSelectionRed: formatter.unitsToSelection(units, req.query.redName),
        blueUnit: blueUnit,
        redUnit: formatter.passQueryRedObject(req.query),
        }

    res.render("battle",variables);
});

app.get("/battle/redSelect", async (req, res) => {
    let units = await mongoClient.list();
    
    let redUnit = units.find(unit => unit.name === req.query.redName);

    let variables = 
    {unitSelectionBlue: formatter.unitsToSelection(units, req.query.blueName),
        unitSelectionRed: formatter.unitsToSelection(units, redUnit.name),
        blueUnit: formatter.passQueryBlueObject(req.query),
        redUnit: redUnit}

    res.render("battle",variables);
});


console.log("Server started on port " + serverPort);
http.createServer(app).listen(serverPort);
