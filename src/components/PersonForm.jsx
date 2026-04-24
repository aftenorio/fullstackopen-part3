const PersonForm = ({
  newNote,
  newphone,
  handleNoteChange,
  handlePhoneChange,
  addAgenda
}) => {
  return (
    <form onSubmit={addAgenda}>
      <div>
        Name: <input value={newNote} onChange={handleNoteChange} />
      </div>

      <div>
        Phone: <input value={newphone} onChange={handlePhoneChange} />
      </div>

      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default PersonForm;


//Esto estaba en App.jsx
//                  <form onSubmit={addAgenda}>
//                            <div>
//                              Name: <input value={newNote} onChange={handleNoteChange}/>
//                            </div>
//                            <div>
//                              Phone: <input value={newphone} onChange={handlePhoneChange}/>
//                            </div>
//                            <div>
//                              <button type="submit">Add</button>
//                            </div>
//                  </form>