const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Anna salasana komentoriviparametrina: node mongo.js <salasana>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://paavoN:${password}@cluster0.v6bz8r1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`${person.name} ja ${person.number} lisättiin puhelinluetteloon`)
    mongoose.connection.close()
  })

} else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Puhelinluettelo:')
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })

} else {
  console.log('Käyttö:\nnode mongo.js <salasana> [nimi numero]')
  mongoose.connection.close()
}