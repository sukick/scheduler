import { useState, useEffect } from 'react';
import axios from "axios";

export default function useApplicatiobData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });


  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then((all) => {
     setState(prev => ({...prev, days:all[0].data, appointments: all[1].data, interviewers:all[2].data }))
    })   
  }, []);


  const getSpotsForDays = function(dayObj, appointments) {
    let count = 0;

    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        count ++;
      }
    }
    return count;
  }

  const updateSpots = function (dayName, days, appointments) {
    const day = days.find(item => item.name === dayName);
    const spotsRemaining = getSpotsForDays(day, appointments);
    const newArray = days.map(item => {
      if (item.name === dayName) {
        return { ...item, spots: spotsRemaining };
      }
      return item;
    });
    return newArray;
  }

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newDays = updateSpots(state.day, state.days, appointments);

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
      setState({ ...state, appointments, days: newDays });
      });
  };


  function cancelInterview(id) {
    
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newDays = updateSpots(state.day, state.days, appointments);

    return axios.delete(`/api/appointments/${id}`)
                .then(() => setState({ ...state, appointments, days: newDays }))

  };
  

  return { state, setDay, bookInterview, cancelInterview };
}