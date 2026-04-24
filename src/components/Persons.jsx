import Agenda from "./Agenda";

const Persons = ({ notesToShow }) => {
  return (
    <ul>
      {notesToShow.map(person => 
        <Agenda key={person.id} agendacomp={person} />
      )}
    </ul>
  );
};

export default Persons;



//Esto estaba en App.jsx
//                  <ul>
//                    {notesToShow.map(agendarender => 
//                    <Agenda key={agendarender.id} agendacomp={agendarender} />
//
//                    )}
//                  </ul>  