const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;
mongoose.connect(url)
console.log('connected to db')
mongoose.Promise = global.Promise


const personSchema = new mongoose.Schema({
  name: String,
  number: String
}, {collection: 'people'})

personSchema.statics.format = function(person){
  return {
      name: person.name,
      number: person.number,
      id: person._id
    }
  }

const Person = mongoose.model('Person', personSchema); 

module.exports = Person;