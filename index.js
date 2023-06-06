const express = require ("express")
const app = express()
const fsPromises = require ("fs/promises")
const { request } = require("http")

app.get ("/",(request,response) => {
    response.send("Endpoint de HOME en API funciona")
})
// get the json of koders
app.get("/koders",async (request,response)=> {
    const db = await fsPromises.readFile("./koders.json","utf8");
    const parseDB = JSON.parse(db);
    response.json(parseDB)
})
// get koder by name
app.get("/koders/:name",async(request,response)=> {
    const {name} = request.params
    const db = await fsPromises.readFile("./koders.json","utf8")
    const parseDB = JSON.parse(db);
    const filteredKoder = parseDB.koders.filter(koder => koder.name.toLowerCase() === name.toLowerCase())[0]
    response.json(filteredKoder)
})

app.listen(8080,()=> {
    console.log("El servidor esta arriba")
})