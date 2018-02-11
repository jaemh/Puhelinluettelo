  const express = require('express');
  const app = express();
  const bodyParser = require('body-parser');
  const morgan = require('morgan');
  const cors = require('cors')
  const Person = require('./models/Person')
  
  app.use(cors());
  app.use(morgan(':method :url :custom :status :res[content-length] - :response-time ms'));
  app.use(express.static('build'));
  app.use(bodyParser.json());
  

    morgan.token('custom', function (req, res) { 
      return JSON.stringify(req.body);
    });
    
   
    app.get('/api/persons', (req, res) => {
        Person
            .find({})
            .then(persons => {
              console.log('got persons');
              res.json(persons.map(Person.format));
            }, (err) => {
              console.log(err);
            })
    })


    app.get('/api/persons/:id', (request, response) => {
        Person
            .findById(request.params.id)
            .then(persons => {
            res.json(persons.map(Person.format));
          })
      
      /*const id = Number(request.params.id)
      const person = persons.find(person => person.id === id );
    
      if(person){
        response.json(person);
      } else {
        response.status(404).end();
      }
      */
    })

    app.post('/api/persons', (request, response) => {
      const newContact = request.body;
      
      const newPerson = new Person({
          name: newContact.name,
          number: newContact.number,
      })

      /*if(persons.find(p => p.name === newContact.name)){
        response.status(409).send({'error': 'contact with same name exists'});
      }else{
        persons.push(newContact);
        response.status(200).send(newContact);
      }
    */

        Person
            .find({'name': newContact.name})
            .then((result) => {
                if(result.length) {
                  response.status(409).send('Person already exists!')
                } else {
                  newPerson
                      .save()
                      .then(saved => {
                      response.json(Person.format(saved))
                      })
                }
              
            }, (err) => {
              console.log('Add new person promise failed: '+err)
            })
    });

    app.put('/api/persons/:id', (request, response) => {
      const updateContact = request.body;

      const person = {
        name: updateContact.name,
        number: updateContact.number
      }
      
        Person
            .findByIdAndUpdate(request.params.id, person, { new: true})
            .then(update => {
              response.json(Person.format(update))
            })
            .catch(error => {
              console.log(error)
              response.status(400).send({ error: 'Person to update wasn\'t found' })
            })
    });


    app.delete('/api/persons/:id', (request, response) => {
        Person
            .findByIdAndRemove(request.params.id)
            .then(result => {
              response.status(204).end()
            })
            .catch(error => {
              response.status(400).send({ error: 'kkkk' })
            })
    })

    app.get('/info', (request, response) => {
      Person
         .find({})
      const size = persons.length;
      const date = new Date();
      let count = "Puhelinluettelossa on " + size + " henkilön tiedot.";
        console.log("yhteensa",size);
        console.log(date);
        response.json(count + " " + date);
        
    })

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    })
    
    