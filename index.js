  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  const morgan = require('morgan');
  const http = require('http')
  const cors = require('cors')
  var fs = require("fs");


  app.use(cors());
    
    let contents = fs.readFileSync("db.json");
    let personData = JSON.parse(contents);
    let persons = personData.persons;

    morgan.token('custom', function (req, res) { 
      return JSON.stringify(req.body);
    });
    
    app.use(morgan(':method :url :custom :status :res[content-length] - :response-time ms'));

    app.use(bodyParser.json());

    app.get('/api/persons', (req, res) => {
        res.json(persons);
      })

    app.get('/info', (request, response) => {
      const size = persons.length;
      const date = new Date();
      let count = "Puhelinluettelossa on " + size + " henkilön tiedot.";
        console.log("yhteensa",size);
        console.log(date);
        response.json(count + " " + date);
        
    })

    app.get('/api/persons/:id', (request, response) => {
      const id = Number(request.params.id)
      const person = persons.find(person => person.id === id );
    
      if(person){
        response.json(person);
      } else {
        response.status(404).end();
      }
    })

    app.delete('/api/persons/:id', (request, response) => {
      const id = Number(request.params.id)
      persons = persons.filter(person => person.id !== id)

      response.status(204).end();
    })

   app.post('/api/persons', (request, response) => {
      const newContact = request.body;
      newContact.id = new Date().getTime();
      
      if(persons.find(p => p.name === newContact.name)){
        response.status(409).send({'error': 'contact with same name exists'});
      }else{
        persons.push(newContact);
        response.status(200).send(newContact);
      }

    });
  
    app.put('/api/persons/:id', (request, response) => {
      const body = request.body;
      const id = request.params.id;
      const foundContact = persons.findIndex(p => p.id === id);

      if(!id) {
        response.status(404).send({'error': 'Person to update wasn\'t found'});
      } else {
        persons[foundContact] = body;
        response.status(200).send(body);
      }

      
        
    });


    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    })
    
    