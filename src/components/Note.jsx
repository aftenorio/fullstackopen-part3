const Note = ({ note, toggleImportance, toggleEraser }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className='note'>
      {note.name + ' :: '} 
      {note.number} 
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={toggleEraser} >Delete</button>
    </li>
  )
}
//const Note = ({ note }) => {
//  return (
//    <li>{note.content}</li>
//  )
//}
export default Note



