//Imports
const http = require("http");
const path = require("path");
const express = require("express");
const database = require("./mongoDB");
const formatter = require("./format");
const duelSim = require("./DuelSim");
let bodyParser = require("body-parser");
const req = require("express/lib/request");
const { query } = require("express");

//Set up database client
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const uri = `mongodb+srv://${userName}:${password}@cluster0.zocte.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
let db = process.env.MONGO_DB_NAME;
let collection = process.env.MONGO_DEFAULT;
//Initialize database client
let mongoClient = new database.MongoDB(uri,db,collection);
(async() => {await mongoClient.connect()})();
//Initialize passport and auth stuff
const session = require("express-session");
const passport = require('passport');
const { redirect } = require("express/lib/response");
require("dotenv").config({ path: path.resolve(__dirname, '.env') });
require('./auth')(mongoClient);
//Initialize express app
const app = express();
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());
const serverPort = 5000; 

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + '/public'));
app.set("views", path.resolve(__dirname, "templates")); //Set view folder
app.set("view engine", "ejs"); // set ejs as view engine

app.get('/', function(req, res){
    res.redirect('/battle');
});

//battle page acts as homepage
app.get("/battle", async (req, res) => {
    //Sets up what collection to look at with default if not signed in
    req.user ? await mongoClient.switchUserCollection(req.user.email) : mongoClient.collection = process.env.MONGO_DEFAULT;
    //Pulls all the units the the collection
    let units = await mongoClient.list();
    //Format user info to pass to render
    let userInfo = formatter.passUserInfo(req.user);
    //Pass units to be formatted to selection field
    let formattedUnits = formatter.unitsToSelection(units);

    let variables = 
    {unitSelectionBlue: formattedUnits,
        unitSelectionRed: formattedUnits,
        blueUnit: formatter.defaultUnit,
        redUnit: formatter.defaultUnit,
        ...formatter.defaultBattle,
        ...userInfo
    }

    res.render("battle",variables);
});

app.get("/battle/blueSelect", async (req, res) => {
    req.user ? await mongoClient.switchUserCollection(req.user.email) : mongoClient.collection = process.env.MONGO_DEFAULT;
    let units = await mongoClient.list();
    let userInfo = formatter.passUserInfo(req.user);
    
    //pulls the first instance of the units name selected
    let blueUnit = units.find(unit => unit.name === req.query.blueName);

    let variables = 
    {unitSelectionBlue: formatter.unitsToSelection(units, blueUnit.name),
        unitSelectionRed: formatter.unitsToSelection(units, req.query.redName),
        blueUnit: blueUnit,
        redUnit: formatter.passQueryRedObject(req.query),
        ...formatter.defaultBattle,
        ...userInfo
        }

    res.render("battle",variables);
});

app.get("/battle/redSelect", async (req, res) => {
    req.user ? await mongoClient.switchUserCollection(req.user.email) : mongoClient.collection = process.env.MONGO_DEFAULT;
    let units = await mongoClient.list();
    let userInfo = formatter.passUserInfo(req.user);
    
    let redUnit = units.find(unit => unit.name === req.query.redName);

    let variables = 
    {unitSelectionBlue: formatter.unitsToSelection(units, req.query.blueName),
        unitSelectionRed: formatter.unitsToSelection(units, redUnit.name),
        blueUnit: formatter.passQueryBlueObject(req.query),
        redUnit: redUnit,
        ...formatter.defaultBattle,
        ...userInfo
    }

    res.render("battle",variables);
});

/*I'm now realising that doing the duelsim stuff in the back end is COMPLETELY UNNECESSARY
  and can be moved to the front end. Not worth changing before the final deadline however*/

/*Calculate battle stats based on both blue and red units*/
app.get("/battle/start", async (req,res) => {
    req.user ? await mongoClient.switchUserCollection(req.user.email) : mongoClient.collection = process.env.MONGO_DEFAULT;
    let units = await mongoClient.list();
    let userInfo = formatter.passUserInfo(req.user);

    //Set up battle info used for calculations
    let battleStat = duelSim.setupUnits(
        formatter.passQueryBlueObject(req.query),formatter.passQueryRedObject(req.query));

    let variables = 
    {unitSelectionBlue: formatter.unitsToSelection(units, req.query.blueName),
        unitSelectionRed: formatter.unitsToSelection(units, req.query.redName),
        blueUnit: formatter.passQueryBlueObject(req.query),
        redUnit: formatter.passQueryRedObject(req.query),
        ...battleStat,
        ...userInfo
    }
    res.render("battle",variables);
})

/*Uses battle stats to simulate a step of a battle simulation*/
app.get("/battle/step", async (req,res) => {
    req.user ? await mongoClient.switchUserCollection(req.user.email) : mongoClient.collection = process.env.MONGO_DEFAULT;
    let units = await mongoClient.list();
    let userInfo = formatter.passUserInfo(req.user);
    
    //Start computing and updating battle stats
    let battleStat = formatter.passQueryBattleStatus(req.query)
    battleStat.blueBattleStats.name = req.query.blueName;
    battleStat.redBattleStats.name = req.query.redName;
    battleStat = duelSim.step(battleStat);

    let variables = 
    {unitSelectionBlue: formatter.unitsToSelection(units, req.query.blueName),
        unitSelectionRed: formatter.unitsToSelection(units, req.query.redName),
        blueUnit: formatter.passQueryBlueObject(req.query),
        redUnit: formatter.passQueryRedObject(req.query),
        ...battleStat,
        ...userInfo
    }

    res.render("battle",variables);
})

app.get("/login", function(req,res) {
    !(req.user) ? res.render("login") : res.sendStatus(401);
})

app.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile']})
);

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: 'auth/failure'
    })
);

app.get('/auth/failure', (req, res) => {
    res.send('oops! Something went wrong...')
});

app.get('/logout', (req, res) => {
    req.logOut();
    req.session.destroy();
    res.redirect('/battle');
})

console.log("Server started on port " + serverPort);
http.createServer(app).listen(serverPort);
