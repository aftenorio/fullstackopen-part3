const Filter = ({ findName, handleNoteFind, findAgenda }) => {
  return (
    <form onSubmit={findAgenda}>
      <div>
        Filter Shown With: 
        <input value={findName} onChange={handleNoteFind} />
      </div>
      <div>
        <button type="submit">find</button>
      </div>
    </form>
  );
};

export default Filter;

//Esto estaba en App.jsx
//                  <form onSubmit={findAgenda}>
//                            <div>
//                              Filter Shown With: 
//                              <input value={findName} onChange={handleNoteFind}/>
//                            </div>
//                            <div>
//                              <button type="submit">find</button>
//                            </div>
//                  </form>