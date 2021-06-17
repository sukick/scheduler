export function getAppointmentsForDay(state, day) {
  let appointmentList = [];

  const dayObj = state.days.find(singleDay => singleDay.name === day)

  if(!dayObj) {
    return[];
  }

  for (let id of dayObj.appointments) {
    appointmentList.push(state.appointments[id]);
  }

  return appointmentList;
};