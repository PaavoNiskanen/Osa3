const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log('Yhdistetään', url)
mongoose.connect(url)
  .then(() => console.log('Yhdistetty MongoDB'))
  .catch(error => console.log('Virhe yhdistäessä MongoDB', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{5,}$/.test(v)
      },
      message: props => `${props.value} ei ole kelvollinen puhelinnumero!`
    },
    minlength: 8
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
