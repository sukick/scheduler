import { useState, useEffect } from 'react';
import axios from "axios";
// separation of concerns

export default function useApplicationData() {
  // respoinsible for loading the initial data from API, when any of the provided actions are called the state updates, causing the component to render
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    // this is the axios.get request to my api-server to the /api/ URL
    // axios can be used to make a request as a side effect and update the component when data is retrieved
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
    // This shows how many spots there is for the appointments remaining
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        count ++;
      }
    }
    return count;
  }

  const updateSpots = function (dayName, days, appointments) {
    // update how many spots is there for that day
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
    // appointment object with values copied from existing appointment
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newDays = updateSpots(state.day, state.days, appointments);
    // this makes sure that when browser refreshes, data is still persistent
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
      setState({ ...state, appointments, days: newDays });
      });
  };


  function cancelInterview(id) {
    // when we cancel an interview, it iwll have it's value set to null.
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