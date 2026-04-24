const EnvioPost = ({ addNote, handleNoteSend, newNote, newNumber,handleNumberSend }) => {
  return (
                  <form onSubmit={addNote}>
                    <div>
                      Nombre::::   
                      <input value={newNote} onChange={handleNoteSend} />
                    </div>
                           <div>
                      Telefono::::   
                      <input value={newNumber} onChange={handleNumberSend} />
                    </div>
                    <div>
                      <button type="submit">Enviar</button>
                    </div>
                  </form>
  );
};
export default EnvioPost;