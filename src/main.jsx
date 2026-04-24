import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(<App />);


//1
//const promise = axios.get('http://localhost:3001/notes')
//console.log(promise)
//promise.then(response => {
//  console.log(response)
//})

//2
//axios.get('http://localhost:3001/notes').then(response => {
//  const notes = response.data
//  console.log('Axios:::',notes)
//})

//3
//axios
//  .get('http://localhost:3001/notes')
//  .then(response => {
//    const notes = response.data
//    console.log(notes)
//  })
//
//const promise2 = axios.get('http://localhost:3001/foobar')
//console.log(promise2)


//const agendas = [
//  {
//    id: 1,
//    name: 'Arto Hellas',
//    phone:'3001122334',
//    important: true
//  },
//  {
//    id: 2,
//    name: 'Marcos chang',
//    phone:'3001122334',
//    important: false
//  }
//]


//1
//ReactDOM.createRoot(document.getElementById('root')).render(<App />)

//2
//ReactDOM.createRoot(document.getElementById('root')).render(
//  <App agendasApp={agendas} autosApp={autos}/>
//)

//3
//axios.get('http://localhost:3001/notes').then(response => {
//  const notes = response.data
//  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
//})