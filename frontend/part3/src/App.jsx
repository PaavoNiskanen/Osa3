import { useState, useEffect } from 'react';
import phone from './services/phone';
import './index.css';

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Rajaa hakua: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ addName, UusiNimi, handleNameChange, Puhelinnumero, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        Nimi: <input value={UusiNimi} onChange={handleNameChange} />
      </div>
      <div>
        Puhelinnumero: <input value={Puhelinnumero} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">Lähetä</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, filter, PoistaNappi }) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      {filteredPersons.map((person) => (
        <p key={person.id}>
          {person.name} | {person.number} {' '}
          <button onClick={() => PoistaNappi(person.id)}>Poista</button>
        </p>
      ))}
    </div>
  )
}

const Ilmoitus = ({ message, type }) => {
  if (message === null) return null
  console.log(`Ilmoitus: ${message}, tyyppi: ${type}`)

  return (
    <div className={type === 'success' ? 'ilmoitus' : 'virhe'}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [UusiNimi, setUusiNimi] = useState('')
  const [Puhelinnumero, setPuhelinnumero] = useState('')
  const [filter, setFilter] = useState('')
  const [Message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const existingPerson = persons.find(person => person.name === UusiNimi)
  const newPerson = { name: UusiNimi, number: Puhelinnumero }

  useEffect(() => {
    phone
      .getAll()
      .then(response => {
        console.log('Data haettu:', response)
        setPersons(response.data)
      })
      .catch(error => {
        console.error('Virhe haettaessa tietoja:', error)
      })
  }, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setUusiNimi(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setPuhelinnumero(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()

    if (existingPerson) {
      if (window.confirm(`${UusiNimi} on jo luettelossa. Korvataanko vanha numero uudella?`)) {
        phone
          .update(existingPerson.id, newPerson)
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data))
            setUusiNimi('')
            setPuhelinnumero('')
            setMessage(`Päivitettiin ${response.data.name}`)
            setMessageType('success')
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.error('Päivitys epäonnistui:', error)
            setMessage(`Tietoa käyttäjästä '${existingPerson.name}' ei voitu päivittää – se on ehkä jo poistettu`)
            setMessageType('error')
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      if (UusiNimi.length > 2 && Puhelinnumero.length > 7) {
        phone
          .create(newPerson)
          .then(response => {
            setPersons(persons.concat(response.data))
            setUusiNimi('')
            setPuhelinnumero('')
            setMessage(`Lisättiin ${response.data.name}`)
            setMessageType('success')
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(error => {
            console.error('Virhe lisättäessä henkilöä:', error)
            setMessage(`Käyttäjän '${UusiNimi}' lisääminen epäonnistui`)
            setMessageType('error')
            setTimeout(() => setMessage(null), 5000)
          })
      } else {
        setMessage('Nimen täytyy olla yli 2 merkkiä pitkiä ja puhelinnumeron vähintään 8 merkkiä ja muotoa xx-xxxxx tai xxx-xxxx')
        setMessageType('error')
        setTimeout(() => setMessage(null), 5000)
      }
    }
  }
  const PoistaNappi = (id) => {
    console.log(`Poistetaan henkilö ${id}`)
    if (window.confirm(`Haluatko varmasti poistaa '${persons.find(person => person.id === id).name}'?`)) {
      phone
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage('Henkilö poistettu')
          setMessageType('success')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.error('Virhe poistettaessa henkilöä:', error)
          setMessage('Henkilön poistaminen epäonnistui')
          setMessageType('error')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }
  
  return (
    <div>
      <h2>Filteroitu lista</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Puhelinluettelo</h2>
      <Ilmoitus message={Message} type={messageType} />
      <PersonForm 
        addName={addName} 
        UusiNimi={UusiNimi} 
        handleNameChange={handleNameChange} 
        Puhelinnumero={Puhelinnumero} 
        handleNumberChange={handleNumberChange}
      />     
      <h2>Numerot</h2>
      <Persons 
        persons={persons} 
        filter={filter}
        PoistaNappi={PoistaNappi} 
      />
    </div>
  )
}

export default App