import React from "react";
import classnames from "classnames";
import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  const interviewerClass= classnames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });

  return (
    <li className = {interviewerClass} onClick={props.setInterviewer}>
      <img
      className="interviewers_item-image"
      // avatar is a url to an image of the interviewer
      src={props.avatar}
      // name of the interviewer
      alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}

