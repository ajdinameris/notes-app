// import React, { useState, useEffect } from "react";
// // import Form from "react-bootstrap/Form";
// import { useHistory } from "react-router-dom";
// // import LoaderButton from "../components/LoaderButton";
// // import { useAppContext } from "../lib/contextLib";
// // import { useFormFields } from "../lib/hooksLib";
// // import { onError } from "../lib/errorLib";
// import Button from 'react-bootstrap/Button';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
// import { Auth } from "aws-amplify";
// import "./Signup.css";

// const NOTSIGNIN = 'You are NOT logged in';
// const SIGNEDIN = 'You have logged in successfully';
// const SIGNEDOUT = 'You have logged out successfully';
// const WAITINGFOROTP = 'Enter OTP number';
// const VERIFYNUMBER = 'Verifying number (Country code +XX needed)';

// export default function Login() { 
//     const [message, setMessage] = useState('Welcome to Demo');
//     const history = useHistory();
//     const [user, setUser] = useState(null);
//     const [session, setSession] = useState(null);
//     const [otp, setOtp] = useState('');
//     const [number, setNumber] = useState('');
//     const password = Math.random().toString(10) + 'Abc#';
//     useEffect(() => {
//       verifyAuth();
//     }, []);
//     const verifyAuth = () => {
//       Auth.currentAuthenticatedUser()
//         .then((user) => {
//           setUser(user);
//           setMessage(SIGNEDIN);
//           setSession(null);
//         })
//         .catch((err) => {
//           console.error(err);
//           setMessage(NOTSIGNIN);
//         });
//     };
//     const signOut = () => {
//       if (user) {
//         Auth.signOut();
//         setUser(null);
//         setOtp('');
//         setMessage(SIGNEDOUT);
//       } else {
//         setMessage(NOTSIGNIN);
//       }
//     };
//     const signIn = () => {
//       setMessage(VERIFYNUMBER);
//       Auth.signIn(number)
//         .then((result) => {
//           setSession(result);
//           setMessage(WAITINGFOROTP);
//         })
//         .catch((e) => {
//           if (e.code === 'UserNotFoundException') {
//             signUp();
//           } else if (e.code === 'UsernameExistsException') {
//             setMessage(WAITINGFOROTP);
//             signIn();
//           } else {
//             console.log(e.code);
//             console.error(e);
//           }
//         });
//     };
//     const signUp = async () => {
//       const result = await Auth.signUp({
//         username: number,
//         password,
//         attributes: {
//           phone_number: number,
//         },
//       }).then(() => signIn());
//       return result;
//     };
//     const verifyOtp = () => {
//       Auth.sendCustomChallengeAnswer(session, otp)
//         .then((user) => {
//           setUser(user);
//           setMessage(SIGNEDIN);
//           setSession(null);
//           history.push("/");
//         })
//         .catch((err) => {
//           setMessage(err.message);
//           setOtp('');
//           console.log(err);
//         });
//     };
//     return (
//       <div className='App'>
//         <header className='App-header'>
//           <p>{message}</p>
//           {!user && !session && (
//             <div>
//               <InputGroup className='mb-3'>
//                 <FormControl
//                   placeholder='Phone Number (+XX)'
//                   onChange={(event) => setNumber(event.target.value)}
//                 />
//                 <InputGroup.Append>
//                   <Button variant='outline-secondary'
//                        onClick={signIn}>
//                     Get OTP
//                   </Button>
//                 </InputGroup.Append>
//               </InputGroup>
//             </div>
//           )}
//           {!user && session && (
//             <div>
//               <InputGroup className='mb-3'>
//                 <FormControl
//                   placeholder='Your OTP'
//                   onChange={(event) => setOtp(event.target.value)}
//                   value={otp}
//                 />
//                 <InputGroup.Append>
//                   <Button variant='outline-secondary'
//                        onClick={verifyOtp}>
//                     Confirm
//                   </Button>
//                 </InputGroup.Append>
//               </InputGroup>
//             </div>
//           )}
//           <div>
//             <ButtonGroup>
//               <Button variant='outline-primary' onClick={verifyAuth}>
//                 Am I signed in?
//               </Button>
//               <Button variant='outline-danger' onClick={signOut}>
//                 Sign Out
//               </Button>
//             </ButtonGroup>
//           </div>
//         </header>
//       </div>
//     );

// }