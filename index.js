
const express = require('express')
const app = express()
//const http = require('http')

const cors = require('cors')
app.use(cors())
app.use(express.json())

let notes = [   
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

//Compacta
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
    if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


//const PORT = 3001
//app.listen(PORT)
//console.log(`Server running on port ${PORT}`)


//app.post('/api/notes', (request, response) => {
//  const note = request.body
//  console.log(note)
//  response.json(note)
//})

//app.post('/api/notes', (request, response) => {
//  const maxId = notes.length > 0
//    ? Math.max(...notes.map(n => n.id)) 
//    : 0
//
//  const note = request.body
//  note.id = maxId + 1
//  notes = notes.concat(note)
//  response.json(note)
//})
/////////////////////////////////////////////////
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }
  notes = notes.concat(note)
  response.json(note)
})





/////////////////////////////////////////////////////////////////
//No Compacta
//app.get('/api/notes/:id', (request, response) => {
//  const id = Number(request.params.id)
//  const note = notes.find(note => {
//    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
//    return note.id === id
//  })
//  console.log(note)
//  response.json(note)
//})


//const app = http.createServer((request, response) => {
//  response.writeHead(200, { 'Content-Type': 'application/json' })
//  response.end(JSON.stringify(notes))
//})

//app.get('/', (request, response) => {
//  response.send('<h1>Hello World!</h1>')
//})


