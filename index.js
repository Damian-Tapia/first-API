const express = require ("express")
const app = express()
const fsPromises = require ("fs/promises")
const { request } = require("http")
const { parse } = require("path")

// Middleware  parsear todo lo que el cliente me mande a .json

app.use(express.json())

//
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
    console.log(name)
    const db = await fsPromises.readFile("./koders.json","utf8")
    const parseDB = JSON.parse(db);
    const filteredKoder = parseDB.koders.filter(koder => koder.name.toLowerCase() === name.toLowerCase())[0]
    response.json(filteredKoder)
})

app.get("/koders", async (request,response)=> {
    const {module} = request.query
    const db = await fsPromises.readFile("./koders.json","utf8");
    const parseDB = JSON.parse(db);
    const filteredKoders = parseDB.koders.filter(koder => module === koder.module)
    if (filteredKoders.lenght === 0){
        response.json(parseDB.koders)
    } else {
        response.json(filteredKoders)
    }
})

app.get("/mentors", async (request,response)=> {
    const {name} = request.query
    // console.log(name)
    const db = await fsPromises.readFile("./koders.json","utf8");
    const parseDB = JSON.parse(db);
    // console.log(parseDB)
    const filteredMentor = parseDB.mentors.filter(mentor => name.toLowerCase() === mentor.name.toLowerCase())
    if (filteredMentor.length === 0){
        response.json(parseDB.mentors)
    } else {
        response.json(filteredMentor)
    }
})

app.get("/mentorsAge/:age", async (request,response)=> {
    const {age} = request.params
    // console.log(age)
    const db = await fsPromises.readFile("./koders.json","utf8");
    const parseDB = JSON.parse(db);
    // console.log(parseDB)
    const filterMentor = parseDB.mentors.filter(mentor => age === mentor.age)
    console.log(filterMentor)
    if (age && filterMentor.length === 0){
        response.json({message:"El mentor con esa edad no fue encontrado"})
    } else {
        response.json(filterMentor)
    }
})

// agregar koders a un obj
app.post("/koders", async (request,response)=> {
    const db = await fsPromises.readFile("./koders.json","utf8")
    const parseDB = JSON.parse(db);
    const newKoder = {
        id: parseDB.koders.length + 1,
        ...request.body,
    }
    parseDB.koders.push(newKoder)
    await fsPromises.writeFile("./koders.json",JSON.stringify(parseDB,"\n",2));
    response.json(newKoder)
})

app.patch("/koders/:id",async (request,response)=> {
    const {id} = request.params
    const db = await fsPromises.readFile("./koders.json","utf8")
    const parseDB = JSON.parse(db);

    let index = parseDB.koders.findIndex(koder => koder.id === parseInt(id))
    const updateKoder = {
        ...parseDB.koders[index],
        ...request.body
    }
    //esto ya actualiza en bd
    parseDB.koders[index] = updateKoder
    // sobre escribe en bd
    await fsPromises.writeFile("./koders.json",JSON.stringify(parseDB,"\n",2));
    response.json(updateKoder)
})

app.listen(8080,()=> {
    console.log("El servidor esta arriba")
})