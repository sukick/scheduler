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

export function getInterviewersForDay(state, day) { 
  let interviewerstList = [];

  const dayObj = state.days.find(singleDay =>  singleDay.name === day)
    if(!dayObj) {
      return [];
    }
    for (let id of dayObj.interviewers) {
      interviewerstList.push(state.interviewers[id]);
    }

  return interviewerstList;
};

export function getInterview(state, interview) {
  if(!interview) {
    return null;
  }

  const newInterviewObj = {
    ...interview,
    interviewer: {...state.interviewers[interview.interviewer]}
  }
  return newInterviewObj
}