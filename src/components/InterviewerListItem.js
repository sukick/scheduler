import React from "react";
import classnames from "classnames";
import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  const interviewerClass= classnames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });

  return (
    <li className = {interviewerClass} onClick={props.setINterviewer}>
      <img
      className="interviewers_item-image"
      src={props.avatar}
      alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
