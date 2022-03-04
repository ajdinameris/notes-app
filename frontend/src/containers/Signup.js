import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
// import { useAppContext } from "../lib/contextLib";
// import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import { Auth } from "aws-amplify";
import "./Signup.css";

export default function Signup() {
  // const [fields, handleFieldChange] = useFormFields({
  //   number: "",
  //   otp: "",
  // });
  const [otp, setOtp] = useState('');
  const [number, setNumber] = useState('');
  const history = useHistory();
  const [user, setUser] = useState(null);
  // const { userHasAuthenticated } = useAppContext();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const password = Math.random().toString(10) + 'Abc#';

  function validateForm() {
    return (
      number.length > 0 
    );
  }

  function validateConfirmationForm() {
    return otp.length > 0;
  }
// Handles the signup or sign in of a number
  const signIn = (event) => {
    event.preventDefault();
  
	  setIsLoading(true);

    Auth.signIn(number)
      .then((result) => {
        setSession(result)
      })
      .catch((e) => {
        if (e.code === 'UserNotFoundException') {
          signUp();
        } else if (e.code === 'UsernameExistsException') {
          signIn();
        } else {
          onError(e);
        }
      })
  }  
	const signUp = async () => {
	  const result = await Auth.signUp({
		username: number,
		password,
	  }).then(() => signIn());
	  setIsLoading(false);
	  return result;
	};

  const verifyOtp = (event) => {
    event.preventDefault();
    setIsLoading(false);
    Auth.sendCustomChallengeAnswer(session, otp)
    .then((user) => {
      setUser(user);
      history.push("/");
    })
    .catch((err) => {
      setOtp('');
      onError(err);
      setIsLoading(false);
    })
  }
  
// Handles the confirmation of OTP
  // async function handleConfirmationSubmit(event) {
	// event.preventDefault();
  
	// setIsLoading(true);
  
	// try {
	//   await Auth.confirmSignUp(number, otp);
	//   await Auth.signIn(number);
  
	//   userHasAuthenticated(true);
	//   history.push("/");
	// } catch (e) {
	//   onError(e);
	//   setIsLoading(false);
	// }
  // }

  // function renderConfirmationForm() {
  //   return (
  //     <Form onSubmit={verifyOtp}>
  //       <Form.Group controlId="confirmationCode" size="lg">
  //         <Form.Label>Confirmation Code</Form.Label>
  //         <Form.Control
  //           autoFocus
  //           type="tel"
  //           onChange={(event) => setOtp(event.target.value)}
  //           value={otp}
  //         />
  //         <Form.Text muted>Please check your phone for the code.</Form.Text>
  //       </Form.Group>
  //       <LoaderButton
  //         block
  //         size="lg"
  //         type="submit"
  //         variant="success"
  //         isLoading={isLoading}
  //         disabled={!validateConfirmationForm()}
  //       >
  //         Verify
  //       </LoaderButton>
  //     </Form>
  //   );
  // }

  // function renderForm() {
  //   return (
  //     <Form onSubmit={signIn}>
  //       <Form.Group controlId="phone" size="lg">
  //         <Form.Label>Phone Number</Form.Label>
  //         <Form.Control
  //           autoFocus
  //           placeholder='Phone Number (+XX)'
  //           value={number}
  //           onChange={(event) => setNumber(event.target.value)}
  //         />
  //       </Form.Group>
  //       <LoaderButton
  //         block
  //         size="lg"
  //         type="submit"
  //         variant="success"
  //         isLoading={isLoading}
  //         disabled={!validateForm()}
  //       >
  //         Send Code
  //       </LoaderButton>
  //     </Form>
  //   );
  // }

  return (
    <div className="Signup">
      {!user && !session && (<Form onSubmit={signIn}>
        <Form.Group controlId="phone" size="lg">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            autoFocus
            placeholder='Phone Number (+XX)'
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Send Code
        </LoaderButton>
      </Form>)}
      {!user && session && (
        <Form onSubmit={verifyOtp}>
        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={(event) => setOtp(event.target.value)}
            value={otp}
          />
          <Form.Text muted>Please check your phone for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
      )}
    </div>
  );
}