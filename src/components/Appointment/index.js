import React from "react";
import "components/Appointment/style.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const EDIT = "EDIT";

export default function Appointment(props) {
   // console.log("props interviewer", props.interviewer)

   const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
    );
    
    function save(name, interviewer) {
      const interview = {
        student: name,
        interviewer
      };

      transition("SAVING");
      props.bookInterview(props.id, interview)
        .then(() => transition("SHOW"))
    }

    function deleteInterview() {
      transition("DELETING")
      props.cancelInterview(props.id)
        .then(() => transition("EMPTY"))
    }

    return (
      <article className="appointment">
        <Header time={props.time} />
  
        {mode === EMPTY && <Empty onAdd={() => transition("CREATE")} />}
        {mode === SHOW && props.interview && (
          <Show
            student={props.interview.student}
            interview={props.interview}
            interviewer={props.interview.interviewer}
            onDelete={() => transition("CONFIRM")}
          />
        )}
        {mode === CREATE && (
          <Form 
           interviewers={props.interviewers}
           onSave={save}
           onCancel={back}
  
          />
        )}
         {mode === SAVING && <Status message="Saving" />}
         {mode === DELETING && <Status message="Deleting" />}
         {mode === CONFIRM && (
        <Confirm
          message= {"Are you sure you would like to delete?"}
          onConfirm= {deleteInterview}
          onCancel= {back}
          message= {"Are you sure you would like to delete?"}
        />
      )}
  
  
      </article>
    )
  }