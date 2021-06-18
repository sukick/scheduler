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
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

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
      
      props
        .bookInterview(props.id, interview)
        .then(() => transition("SHOW"))
        .catch(error => transition("ERROR_SAVE", true))
    };

    function deleteInterview() {
      transition("DELETING", true)

      props
        .cancelInterview(props.id)
        .then(() => transition("EMPTY"))
        .catch(error => transition("ERROR_DELETE", true))
    };

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
            onEdit= {() => transition("EDIT")}
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
          onConfirm= {deleteInterview}
          onCancel= {back}
          message= {"Are you sure you would like to delete?"}
          />
         )}
          {mode === EDIT && (
            <Form
            name={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onSave={save}
            onCancel={back}
            />
          )}
          {mode === ERROR_SAVE && (
            <Error
              message= "Could not save appointment."
              onClose= {back}
            />
          )}
          {mode === ERROR_DELETE && (
            <Error
            message="Could not delete appointment."
            onClose= {back}
        />
      )}

  
      </article>
    )
  }