const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;

mongoose.connect(url)
mongoose.Promise = global.Promise

let name;
let number;

if(process.argv.length >= 3) {
  name = process.argv[2];
  number = process.argv[3];
}

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

  if(name && number) {
    console.log('Lisätään henkilön ' + name + ' numero '+number+' luetteloon');
    
    const person = new Person({
      name: name,
      number: number,
    })

    person
      .save()
      .then(() => {
        console.log('Henkilö lisättiin');
      })
  }
 

