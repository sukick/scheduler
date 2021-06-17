import React, { useState, useEffect } from "react";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import axios from "axios";
import getAppointmentsForDay from "../helpers/selectors";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//     interview: {
//       student: "Angela Chan",
//       interviewer: {
//         id: 2,
//         name: "Leo",
//         avatar: "https://i.imgur.com/T2WwVfS.png",
//       }
//     }
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Andrew Ho",
//       interviewer: {
//         id: 3,
//         name: "Loki",
//         avatar: "https://i.imgur.com/FK8V841.jpg",
//       }
//     }
//   },
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    // you may put the line below, but will have to remove/comment hardcoded appointments variable
    appointments: {}
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const setDay = day => setState({...state,day});

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
    ])
    .then ((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data }))
    })
    .catch((error) => {
      console.log(error)
    })
  },[])

  const schedule = dailyAppointments.map((appointment) => {
    return (
      <Appointment key={appointment.id} {...appointment} />
    )
  })

  return (
    <main className="layout">
      <section className="sidebar">
      <img
    className="sidebar--centered"
    src="images/logo.png"
    alt="Interview Scheduler"
  />
  <hr className="sidebar__separator sidebar--centered" />
  <nav className="sidebar__menu">
    <DayList
      days={state.days} 
      day={state.day} 
      setDay={setDay}
      />
  </nav>
  <img
    className="sidebar__lhl sidebar--centered"
    src="images/lhl.png"
    alt="Lighthouse Labs"
  />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
    
  );
}

