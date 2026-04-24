////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P3.A.Node.js y Express
























/*
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.E.Ejercicios 2.18.-2.20.
import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetails from './components/CountryDetails'

const App = () => {
  const [value, setValue] = useState('')
  const [rates, setRates] = useState({})
  const [currency, setCurrency] = useState(null)
  
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  
const filteredCountries = countries.filter(country =>
  country.name.common.toLowerCase().includes(currency.toLowerCase())
)

  useEffect(() => {
    console.log('effect run, currency is now', currency)
    // omitir si la moneda no está definida
    if (currency) {
      console.log('fetching exchange rates...')
      axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
            setCountries(response.data)
        })
    }
  }, [currency])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const onSearch = (event) => {
    event.preventDefault()
    setCurrency(value)
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        currency: <input value={value} onChange={handleChange} />
        <button type="submit">exchange rate</button>
      </form>
      <pre>
        {JSON.stringify(rates, null, 2)}
      </pre>

            {filteredCountries.length > 10 && (
              <p>Too many matches, specify another filter</p>
            )}

            {filteredCountries.length > 1 && filteredCountries.length <= 10 &&
              filteredCountries.map(country => (
                <div key={country.cca3}>
                  {country.name.common}
                  <button onClick={() => setCurrency(country.name.common)}>
                    show
                  </button>
                </div>
              ))
            }

            {filteredCountries.length === 1 && (
              <div>
                <h1>{filteredCountries[0].name.common}</h1>
                <p>Capital: {filteredCountries[0].capital}</p>
                <p>Area: {filteredCountries[0].area}</p>
                <p>Flags: {filteredCountries[0].flags.png}</p>
                
                  <img
                    src={filteredCountries[0].flags.png}
                    alt={`Flag of ${filteredCountries[0].name.common}`}
                    width="250"
                  />

                  {filteredCountries.length === 1 && (
                    <CountryDetails country={filteredCountries[0]} />
                  )}
              </div>
            )}
    </div>
  )
}
export default App

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.C.Extraer la comunicación con el backend en un módulo separado

import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import EnvioPost from './components/EnvioPost'
import personsService from './services/persons'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [ErrorType, setErrorType] = useState(null)

        useEffect(() => {
                      personsService
                        .getAll()
                        .then(initialNotes => {
                          setNotes(initialNotes)
                        })
        }, [])
        console.log('render', notes.length, 'notes')
        console.log('Get All:::' , notes)

    // Agregar Notas
          const  addNote = event => {
          event.preventDefault()
          const noteObject = {
            name: newNote,
            number: newNumber,
            }
                     if (!notes.find(note => note.name === newNote)){
                      personsService
                        .create(noteObject)
                        .then(returnedNote => {
                                  setNotes(notes.concat(returnedNote))
                                  setNewNote('')
                                  setNewNumber('')
                                  console.log('Create_1:::::' , notes)
                                        setErrorMessage('Nuevo Contacto Agregado')
                                        setErrorType('success')
                                    setTimeout(() => {
                                        setErrorMessage(null)
                                        setErrorType(null)
                                         }, 3000)
                        })
                      } else {  
                               if (confirm(newNote + '  Esta duplicado en la agenda, Desea reemplazarlo? ')){
                                 const noteUpd = notes.find(n => n.name === newNote)
                                 console.log('noteeeeeee:::::',noteUpd)
                                    personsService
                                    .update(noteUpd.id, noteObject)
                                    .then(returnedNote => {
                                    setNotes(notes.map(note => note.id !== noteUpd.id ? note : returnedNote))
                                   
                                    console.log('Else si esta duplicado:::::' , notes)
                                    setNewNote('')
                                    setNewNumber('')
                                    setErrorMessage('Contacto Actualizado')
                                    setErrorType('success')
                                          setTimeout(() => {
                                                  setErrorMessage(null)
                                                  setErrorType(null)
                                            }, 3000)
                                             })  
                            .catch(() => {
                            setErrorMessage(
                              `Note '${noteUpd.name}' was already removed from server`
                            )
                            setErrorType('error')
                                    setNotes(notes.filter(n => n.id !== noteUpd.id))
                                             setTimeout(() => {
                                                  setErrorMessage(null)
                                                  setErrorType(null)
                                            }, 3000)
                    })
                               }



                               
        }
                                  console.log('create_2:::' , notes)
      }
      const handleNoteSend = (event) => {
      console.log('value_Find', event.target.value)
      setNewNote(event.target.value) 
  }
      const handleNumberSend = (event) => {
      console.log('value_Find', event.target.value)
      setNewNumber(event.target.value) 
  }

       const toggleImportanceOf = id => {
       const url = `http://localhost:3001/persons/${id}`
       const note = notes.find(n => n.id === id)
       const changedNote = { ...note, important: !note.important }
                    personsService
                      .update(id, changedNote)
                      .then(returnedNote => {
                      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
                      })  
                      .catch(error => {
                            setErrorMessage(
                              `Note '${note.name}' was already removed from server`
                            )
                            setErrorType('error')

                                             setTimeout(() => {
                                                  setErrorMessage(null)
                                                  setErrorType(null)
                                            }, 3000)
                      //alert(
                      //  `the note '${note.name}' was already deleted from server`
                      //)
                      setNotes(notes.filter(n => n.id !== id))
                    })
         }

       const toggleEraserOf = id => {
       if (confirm("¿Seguro que deseas eliminar a ..?" )){
       const url = `http://localhost:3001/persons/${id}`
       const note = notes.find(n => n.id === id)
//       const changedNote = { ...note, important: !note.important }
                    personsService
                      .eraser(id)
                      .then(returnedNote => {
                        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
                      })
                      .catch(error => {
                      alert(
                        `the note '${note.name}' was already deleted from server`
                      )
                      setNotes(notes.filter(n => n.id !== id))
                    })
                    } else {console.log('Se aborta Borrado:::')} 
}

    const notesToShow = showAll
    ? notes 
    : notes.filter(note => note.important === true)

return (
         <div>
              <h2>Add a New::: </h2>
              <EnvioPost 
                addNote={addNote}
                newNote={newNote}
                newNumber={newNumber}
                handleNoteSend={handleNoteSend}
                handleNumberSend={handleNumberSend}
              />
              <Notification message={errorMessage} type={ErrorType} />
              <h1>Notes</h1>

              <div>
                <button onClick={() => setShowAll(!showAll)}>
                  show {showAll ? 'important' : 'all' }
                </button>
              </div>      
              <ul>
                {notesToShow.map((note, i) => 
                  <Note
                    key={i}
                    note={note} 
                    toggleImportance={() => toggleImportanceOf(note.id)}
                    toggleEraser={() => toggleEraserOf(note.id)}
                  />
                )}
              </ul>
            <Footer/>
         </div>
  )
}
export default App

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.C.Extraer la comunicación con el backend en un módulo separado

import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import EnvioPost from './components/EnvioPost'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

        useEffect(() => {
                      noteService
                        .getAll()
                        .then(initialNotes => {
                          setNotes(initialNotes)
                        })
//                    noteService
//                      .getAll()
//                      .then(response => {
//                        setNotes(response.data)
//                      })
        }, [])
  console.log('render', notes.length, 'notes')

    // Agregar Notas
    const  addNote = event => {
      event.preventDefault()
      const noteObject = {
        content: newNote,
        important: Math.random() < 0.5,
        }
      noteService
        .create(noteObject)
        .then(returnedNote => {
          setNotes(notes.concat(returnedNote))
          setNewNote('')
        })
//      noteService
//        .create(noteObject)
//        .then(response => {
//          setNotes(notes.concat(response.data))
//          setNewNote('')
//        })
    }

    const handleNoteSend = (event) => {
      console.log('value_Find', event.target.value)
      setNewNote(event.target.value) 
  }

    // const toggleImportanceOf = (id) => {
    //   console.log('importance of ' + id + ' needs to be toggled')
    // }
       const toggleImportanceOf = id => {
       const url = `http://localhost:3001/notes/${id}`
       const note = notes.find(n => n.id === id)
       const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })  
      .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })

//    noteService
//      .update(id, changedNote)
//      .then(response => {
//        setNotes(notes.map(note => note.id !== id ? note : response.data))
//      })
}

    const notesToShow = showAll
    ? notes 
    : notes.filter(note => note.important === true)

return (
         <div>
              <h2>Post</h2>
              <EnvioPost 
                addNote={addNote}
                newNote={newNote}
                handleNoteSend={handleNoteSend}
              />
              <h1>Notes</h1>
              <div>
                <button onClick={() => setShowAll(!showAll)}>
                  show {showAll ? 'important' : 'all' }
                </button>
              </div>      
              <ul>
                {notesToShow.map((note, i) => 
                  <Note
                    key={i}
                    note={note} 
                    toggleImportance={() => toggleImportanceOf(note.id)}
                  />
                )}
              </ul>
         </div>

  )
}
export default App

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.C.Axios y promesas
//

import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import EnvioPost from './components/EnvioPost'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

    // Agregar Notas
    const  addNote = event => {
      event.preventDefault()
      const noteObject = {
        content: newNote,
        important: Math.random() < 0.5,
      }

      axios
        .post('http://localhost:3001/notes', noteObject)
        .then(response => {
          console.log(response)
          setNotes(notes.concat(response.data))
          setNewNote('')
        })
    }

    const handleNoteSend = (event) => {
      console.log('value_Find', event.target.value)
      setNewNote(event.target.value) 
  }

    // const toggleImportanceOf = (id) => {
    //   console.log('importance of ' + id + ' needs to be toggled')
    // }
       const toggleImportanceOf = id => {
       const url = `http://localhost:3001/notes/${id}`
       const note = notes.find(n => n.id === id)
       const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(note => note.id !== id ? note : response.data))
  })
}

    const notesToShow = showAll
    ? notes 
    : notes.filter(note => note.important === true)

return (
         <div>
              <h2>Post</h2>
              <EnvioPost 
                addNote={addNote}
                newNote={newNote}
                handleNoteSend={handleNoteSend}
              />
              <h1>Notes</h1>
              <div>
                <button onClick={() => setShowAll(!showAll)}>
                  show {showAll ? 'important' : 'all' }
                </button>
              </div>      
              <ul>
                {notesToShow.map((note, i) => 
                  <Note
                    key={i}
                    note={note} 
                    toggleImportance={() => toggleImportanceOf(note.id)}
                  />
                )}
              </ul>
         </div>

  )
}
export default App



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.B.Ejercicios 2.6

import { useState } from 'react'
import Agenda from './components/Agenda'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = (inapp) => {
  const {agendasApp, autosApp}=inapp
  console.log('agendas', agendasApp)
//  console.log('autos', autosApp)
  const [agendasHook, setPersons] = useState(agendasApp) 
  const [newNote, setNewNote] = useState('Add Agenda ...') 
  const [newphone, setNewPhone] = useState('Add Phone ...') 
  const [newName, setNewName] = useState(' is already added to phonebook')
  const [showAll, setShowAll] = useState(true)
  const [findName, setfindName] = useState('Filtrar Nombre ...')
  const [agendasHookFil, setPersonsFil] = useState(agendasApp) 
    
  const findAgenda = (event) => {
    event.preventDefault()
//    setPersons(agendasHook.concat(noteObject))
       
      agendasHook.map(name => name.name).includes(findName)
      ? (setPersonsFil(agendasHook.filter(name => name.name === findName)), 
         setfindName('Estas de suerte!!'))
      : (setPersonsFil(agendasHook),
         setfindName('No se encontro nombre'))
//    console.log('noteObject::::',noteObject)

  }
    const handleNoteFind = (event) => {
      console.log('value_Find', event.target.value)
      setfindName(event.target.value) 

  }


   const addAgenda = (event) => {
   event.preventDefault()
          const noteObject = {
                          id: agendasHook.length + 1,
                          name: newNote,
                          phone: newphone,
                          important: Math.random() < 0.5,
                          }
  setPersons(agendasHook.concat(noteObject))
  setPersonsFil(agendasHook.concat(noteObject))
  setNewNote('')
  setNewPhone('')
  console.log('noteObject::::',noteObject)
  }

  const handleNoteChange = (event) => {
  console.log('value_Name', event.target.value)
  setNewNote(event.target.value)   
  agendasHook.map(name => name.name).includes(event.target.value)
  ? window.alert(event.target.value + newName)
  : console.log('NO EXISTE', event.target.value) 
  }

  const handlePhoneChange = (event) => {
  console.log('value_Phone', event.target.value)
  setNewPhone(event.target.value)
  }

    const notesToShow = showAll
  ? agendasHookFil    
  : agendasHook.filter(note => note.important === true)

  return (
    <div>
      <h2>Phonebook</h2>
              <Filter 
                findName={findName}
                handleNoteFind={handleNoteFind}
                findAgenda={findAgenda}
              />

      <h2>Add a New</h2> 
                        <PersonForm 
                          addAgenda={addAgenda}
                          handleNoteChange={handleNoteChange}
                          handlePhoneChange={handlePhoneChange}
                          newNote={newNote}
                          newphone={newphone}
                        />
                            <div>
                                  <button onClick={() => setShowAll(!showAll)}>
                                    show {showAll ? 'important' : 'all' }
                                  </button>
                            </div>
      <h2>Numbers</h2>
               <Persons 
                notesToShow={notesToShow}
              />
      </div>
      
  )
}
export default App



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.B.Formularios
//Filtrado de elementos mostrados
import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
              const [notes, setNotes] = useState(props.notes)
              const [newNote, setNewNote] = useState('a new note...') 
              const [showAll, setShowAll] = useState(true)

   const addNote = (event) => {
   event.preventDefault()
   console.log('button clicked', event.target)
     const noteObject = {
                        content: newNote,
                        important: Math.random() < 0.5,
                        id: notes.length + 1,
                        }
  setNotes(notes.concat(noteObject))
  setNewNote('')
  }


  const handleNoteChange = (event) => {
    console.log('value', event.target.value)
    setNewNote(event.target.value)
  }
    const notesToShow = showAll
    ? notes 
    : notes.filter(note => note.important === true)
//    console.log('Condicion', notesToShow, showAll.useState)
  return (
    <div>
            <h1>Notes</h1>
                  <div>
                    <button onClick={() => setShowAll(!showAll)}>
                      show {showAll ? 'important' : 'all' }
                    </button>
                  </div>

                  <ul>
                    {notesToShow.map(note => 
                      <Note key={note.id} note={note} />
                    )}
                  </ul>
            
                  <form onSubmit={addNote}>
                  <input value={newNote} 
                  onChange={handleNoteChange}
                  />
                        <input />
                        <button type="submit">save</button>
                  </form> 
    </div>
  )
}
export default App 

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.B.Formularios
//Componentes controlados

import { useState } from 'react'
import Note from './components/Note'

const App = (props) => {
              const [notes, setNotes] = useState(props.notes)
              const [newNote, setNewNote] = useState('a new note...') 

   const addNote = (event) => {
   event.preventDefault()
   console.log('button clicked', event.target)
     const noteObject = {
                        content: newNote,
                        important: Math.random() < 0.5,
                        id: notes.length + 1,
                        }
  setNotes(notes.concat(noteObject))
  setNewNote('')
  }


  const handleNoteChange = (event) => {
    console.log('value', event.target.value)
    setNewNote(event.target.value)
  }
  return (
    <div>
            <h1>Notes</h1>
            <ul>
              {notes.map(note => 
                <Note key={note.id} note={note} />
              )}
            </ul>
            
            <form onSubmit={addNote}>
            <input value={newNote} 
            onChange={handleNoteChange}
            />
                  <input />
                  <button type="submit">save</button>
            </form> 
    </div>
  )
}
export default App 



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.A.Ejercicios 2.1 - 2.5

import Course from './components/Course'

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
//return <Course course={courses} />

return (
    <div>
      {courses.map(course =>
        <Course key={course.id} course={course} />
      )}
    </div>
  )

}
export default App
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.A
const Course = (props) => {
  console.log(props)
  const { course } = props
  return (
    <div>
      <Header course={course} />
    </div>
  )
}

const App = () => {
  const course = {
    // ...
  }
  console.log('App works...')
  return (
    <div>
      <Course course={course} />
    </div>
  )
}
export default App

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.A.Refactorizando módulos

import Note from './components/Note'

const App = ({ notes }) => {
  return (
    <div>
      <h1>Notes</h1>
      <ul>

        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  )
}
export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.A.Anti-patrón: índices de matriz como claves
import { useState } from "react"

const App = (props) => {
  const { notes } = props

const result   = notes.map(note => note.id)
const result2  = notes.map(note => note.content)

console.log(result)
console.log(result2)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
            {notes.map((note, i) => 
              <li key={i}>
                {note.content}
              </li>
            )}
      </ul>
    </div>
  )
}
export default App

//        {notes.map(note => 
//        <li key={note.id}>
//          {note.content}
//          </li>)}
///////////////////////7
// <li>{notes[0].content}</li>
// <li>{notes[1].content}</li>
// <li>{notes[2].content}</li>

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P2.A.Protip: Renderizando colecciones
import { useState } from "react"

const App = (props) => {
  const { notes } = props

const result   = notes.map(note => note.id)
const result2  = notes.map(note => note.content)

console.log(result)
console.log(result2)

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
        <li key={note.id}>
          {note.content}
          </li>)}
      </ul>
    </div>
  )
}

// <li>{notes[0].content}</li>
// <li>{notes[1].content}</li>
// <li>{notes[2].content}</li>

export default App

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Ejercicios 1.6.-1.14.
//UNICAFE   1.6  TO  1.11

import { useState } from "react"

const Statistics = (props) => {
      const { goodC, totalC, neutralC, badC, avgC } = props
//      console.log(goodC)
//      console.log(totalC)
    if (props.totalC === 0){
            return (
      <div>
        No Feedback Given
      </div>
     )
     }
    return (
    <div>


            <Statisticline text="Good:::    "      value={goodC} />         
            <Statisticline text="Neutral::: "      value={neutralC} />    
            <Statisticline text="Bad:::     "      value={badC} />       
            <Statisticline text="All :::    "      value={totalC} />         
            <Statisticline text="Average::: "      value={avgC/totalC} />    
            <Statisticline text="Comp_Positive:::" value={(goodC/totalC)*100} />  

    </div>
  )

}
// <p>Good ::         {goodC}</p>
// <p>Neutral::       {neutralC}</p>
// <p>Bad::           {badC}</p>
// <p>All::           {totalC}</p>
// <p>Average::       {avgC/totalC}</p>
// <p>Comp_Positive:: {(goodC/totalC)*100} %</p>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [avg, setAvg] = useState(0)
  const [allClicks, setAll] = useState([])


  const handleGoodClick = () => {
    setAll(allClicks.concat('G'))
    const updatedGood = good + 1
    const updatedAvg = avg + 1
//        console.log('left before', left)
    setGood(updatedGood)
//        console.log('left after', left)
    setTotal(updatedGood + neutral + bad)
    setAvg(updatedAvg)
  }

  const handleNeutralClick = () => {
    setAll(allClicks.concat('N'))
      const updatedNeutral = neutral + 1
          const updatedGood = good + 1
          const updatedAvg = avg + 0
  //          console.log('Right before', right)
     setNeutral(updatedNeutral)
  //          console.log('Right after', right)
    setTotal(good + updatedNeutral + bad)
    setAvg(updatedAvg)
  }

    const handleBadClick = () => {
    setAll(allClicks.concat('B'))
    const updatedBad = bad + 1
        const updatedGood = good + 1
        const updatedAvg = avg - 1
  //          console.log('Right before', right)
    setBad(updatedBad)
  //          console.log('Right after', right)
    setTotal(good + neutral + updatedBad)
    setAvg(updatedAvg)
  }

  return (
    <div>

      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text='Good' />
      <Button handleClick={handleNeutralClick} text='Neutral' />
      <Button handleClick={handleBadClick} text='Bad' />


      <h1>statistic</h1>
      <Statistics goodC={good} totalC={total} neutralC={neutral} badC={bad} avgC={avg}/>

    </div>
  )
}
//      <p>Positive:: {(good/total)*100} %</p>
//      <History allClicks={allClicks} />
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Statisticline = ({value,text }) => (

  <table>
    <tbody>
        <tr>
        <td>{text}</td> 
        <td>{value}</td> 
        </tr> 
    </tbody>
  </table>
)
export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.No definir componentes dentro de los componentes

import { useState } from "react"

const Display = props => <div>{props.value}</div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
export default App

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Pasando controladores de eventos a componentes hijos
import { useState } from "react"

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
       {value}
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Una función que devuelve una función
import { useState } from "react"

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Una función que devuelve una función
import { useState } from "react"

const App = () => {
  const [value, setValue] = useState(10)


  const setToValue = (newValue) => () => {
    console.log('value now', newValue)  // imprime el nuevo valor en la consola
    setValue(newValue)
  }

  return (
    <div>
      {value}

      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
    </div>
  )
}
export default App



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Una función que devuelve una función
import { useState } from "react"

const App = () => {
  const [value, setValue] = useState(10)

  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }
    return handler
  }

  return (
    <div>
      {value}

      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
    </div>
  )
}
export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Una función que devuelve una función
import { useState } from "react"

const App = () => {
  const [value, setValue] = useState(10)

  const hello = () => {
    const handler = () => console.log('hello world')
    return handler
  }

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
export default App

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Reglas de los Hooks
// Reglas donde n ose usa Hooks 

const App = () => {
  // estos están bien
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // esto no funciona!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // esto tampoco está bien
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // y esto también es ilegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.React Antiguo
//Depuración de aplicaciones React

import { useState } from "react"

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
        console.log('left before', left)
    setLeft(updatedLeft)
        console.log('left after', left)
    setTotal(updatedLeft + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
            console.log('Right before', right)
    setRight(updatedRight)
            console.log('Right after', right)
    setTotal(left + updatedRight)
  }

  return (
    <div>
      {left}
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
//const Button = ({ handleClick, text }) => (
//  <button onClick={handleClick}>
//    {text}
//  </button>
//)
const Button = (props) => {

  console.log('props value iszzzzz', props)

  const { handleClick, text } = props
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

export default App



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Renderizado condicional
// Con Componente Button

import { useState } from "react"

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
        console.log('left before', left)
    setLeft(updatedLeft)
        console.log('left after', left)
    setTotal(updatedLeft + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
            console.log('Right before', right)
    setRight(updatedRight)
            console.log('Right after', right)
    setTotal(left + updatedRight)
  }

  return (
    <div>
      {left}
      <Button handleClick={handleLeftClick} text='left' />
      <Button handleClick={handleRightClick} text='right' />
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)
export default App





////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Renderizado condicional

import { useState } from "react"

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
        console.log('left before', left)
    setLeft(updatedLeft)
        console.log('left after', left)
    setTotal(updatedLeft + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
            console.log('Right before', right)
    setRight(updatedRight)
            console.log('Right after', right)
    setTotal(left + updatedRight)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} />
    </div>
  )
}
const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.La actualización del estado es asíncrona

import { useState } from "react"

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
        console.log('left before', left)
    setLeft(updatedLeft)
        console.log('left after', left)
    setTotal(updatedLeft + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    const updatedRight = right + 1
            console.log('Right before', right)
    setRight(updatedRight)
            console.log('Right after', right)
    setTotal(left + updatedRight)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
      <p>total {total}</p>
    </div>
  )
}
export default App




////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Manejo de arrays

import { useState } from "react"

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

    console.log('Valor', allClicks)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
    </div>
  )
}
export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Estado complejo 2
import {useState} from "react"

const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })


//  const handleLeftClick = () => {
//    const newClicks = {
//      left: clicks.left + 1,
//      right: clicks.right
//    }
//    setClicks(newClicks)
//  }
//
//  const handleRightClick = () => {
//    const newClicks = {
//      left: clicks.left,
//      right: clicks.right + 1
//    }
//    setClicks(newClicks)
//  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//P1.D.Estado complejo

import { useState } from "react"

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


//Refactorización de los componentes

import { useState } from "react"

const App = () => {
  const [counter, setCounter] = useState(0)

  console.log('rendering with counter value', counter)

  const increaseByOne = () => {

    console.log('increasing, value before', counter)
    setCounter(counter + 1)
  }

  const decreaseByOne = () => {

    console.log('decreasing, value before', counter)
    setCounter(counter - 1)
  }

  const setToZero = () => {

    console.log('resetting to zero, value before', counter)
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  )
}


//const Display = (props) => {
//  return (
//    <div>{props.counter}</div>
//  )
//}
const Display = ({ counter }) => <div>{counter}</div>

// const Button = (props) => {
//   return (
//     <button onClick={props.onClick}>
//       {props.text}
//     </button>
//   )
// }

//const Button = ({ onClick, text }) => (
//  <button onClick={onClick}>
//    {text}
//  </button>
//)

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//Los cambios en el estado provocan re-renderizado
import { useState } from "react"

const App = () => {
  const [counter, setCounter] = useState(0)

  console.log('rendering with counter value', counter)

  const increaseByOne = () => {

    console.log('increasing, value before', counter)
    setCounter(counter + 1)
  }

  const decreaseByOne = () => { 

    console.log('decreasing, value before', counter)
    setCounter(counter - 1)
  }

  const setToZero = () => {

    console.log('resetting to zero, value before', counter)
    setCounter(0)
  }

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  )
}

const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

export default App


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//Pasando el estado a componentes hijos
import { useState } from "react"

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)
  const decreaseByOne = () => setCounter(counter - 1)
  return (
    <div>
      <Display counter={counter}/>

      <Button onClick={increaseByOne}
        text='plus'
       />

      <Button onClick={setToZero}
        text='zero'
       />
      <Button
        onClick={decreaseByOne}
        text='minus'
      />   
    </div>
  )
}
const Display = (props) => {
  return (
    <div>{props.counter}</div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
export default App

////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//Un controlador de eventos es una función
import { useState } from "react"

const App = () => {
  const [ counter, setCounter ] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={increaseByOne}>
        plus
      </button>
      <button onClick={setToZero}>
        zero
      </button>
    </div>
  )
}
export default App


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//Control de eventos 2
import { useState } from "react"

const App = () => {
  const [ counter, setCounter ] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>
      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}
export default App


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//Control de eventos
import { useState } from "react"

const App = () => {
            const [counter, setCounter] = useState(0)

            const handleClick = () => {
                 console.log('clicked')
//                  setCounter(counter+1)
//                  <button onClick={()=> console.log('clicked')}>
            }
            return (
                 <div>
                        <div>{counter}</div>
                        <button onClick={handleClick}>
                        plus
                        </button>
                </div>
            )
}
export default App





//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//Componente con estado

import { useState } from "react"

const App = () => {
  const [counter, setCounter] = useState(0)

  setTimeout(() => setCounter(counter +1),1000)

  console.log('rendering...', counter)

  return (
    <div>{counter}</div>
  )
}
export default App

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//Re-renderizado de la pagina.

const App = (props) => {
  const {counter} = props
  return (
    <div>{counter}</div>
  )
}

export default App



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//Desestructuración
const Hello = (props) => {

         const { name, age } = props
//          const name = props.name
//          const age  = props.age
          const bornYear =() => new Date().getFullYear() - age
  return (
    <div>
      <p> Hello {name}, you are {age} years old </p>
      <p> So you were probably born in {bornYear()} </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
export default App




//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Funciones auxiliares del componente
const Hello = (props) => {
          const bornYear =() => {
          const yearNow = new Date().getFullYear()
          return yearNow - props.age
        }
  return (
    <div>
      <p> Hello {props.name}, you are {props.age} years old </p>
      <p> So you were probably born in {bornYear()} </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
export default App

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
// Ejercicio Inicial

const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
  */