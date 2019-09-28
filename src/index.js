const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
//adding modules
const app = Express();//init express framework

Mongoose.connect("mongodb://localhost/personsdb", { useNewUrlParser: true }); //set up default mangoose connection

const db = Mongoose.connection; //get the default connection it's not obligated in latest versions

db.on("error", console.error.bind("connection error"));

//modeling
const PersonModel = Mongoose.model("person", { firstname: String, lastname: String })

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));


app.get("/",  (request, response) => {
    try {
        response.send("Hello");
    }
    catch (error) {
        response.status(500).send(error);
    }
});

app.post("/person", async (request, response) => {
    try {
        let person = new PersonModel(request.body);
        let result = await person.save();
        response.send(result);
    }
    catch (error) {
        response.status(500).send(error);
    }
});
app.get("/people", async (request, response) => {
    try {
        let result = await PersonModel.find().exec();
        response.send(result);
    }
    catch (error) {
        response.status(500).send(error);
    }
});
app.get("/person/:id", async (request, response) => {
    try {
        let person = await PersonModel.findById(request.params.id).exec();
        response.send(person);
    }
    catch (error) {
        response.status(500).send(error);
    }
});
app.put("/person/:id", async (request, response) => {
    try {
        let person = await PersonModel.findById(request.params.id).exec();
        person.set(request.body);
        let result = await person.save();
        response.send(result);
    }
    catch (error) {
        response.status(500).send(error);
    }
});
app.delete("/person/:id", async (request, response) => {
    try {
        let result = await PersonModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    }
    catch (error) {
        response.status(500).send(error);
    }
});
app.listen(3000, () => {
    console.log("listening at : 3000");
})