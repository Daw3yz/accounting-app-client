'use client'

import React from "react"
import '/styles/Signup.css'
import '/src/app/globals.css'
import { TextField, Button } from '@mui/material';
import axios from "axios"
import { useRouter } from 'next/navigation'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

function SignInCard() {
  const [errorText, setErrorText] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [username, setUsername] = React.useState(null);

  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault();

    try {
      var config = {
        method: 'post',
        url: serverUrl + '/users/create',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          'email': email,
          'username': username,
          'password': password,
        }
      };

      axios(config)
        .then((response) => {
          router.push('/login')
          alert("Signup successful, please login")

        })
        .catch((error) => {
          console.log(error);
        });


    } catch (error) {
      setErrorText(error.message)
    }
  }

  function handleOnChange(e, input) {
    switch (input) {
      case 'email':
        setEmail(e.target.value)
        return
      case 'password':
        setPassword(e.target.value)
        return
      case 'username':
        setUsername(e.target.value)
        return
    }
  }

  return (
    <div className="center SignInCard">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="textview-container">
          <TextField label="Email" variant="outlined" className="white-textview" name="email" onChange={(e) => { handleOnChange(e, 'email') }} />
          <TextField label="Username" variant="outlined" className="white-textview" name="username" onChange={(e) => { handleOnChange(e, 'username') }} />
          <TextField type="password" label="Password" variant="outlined" className="white-textview" name="password" onChange={(e) => { handleOnChange(e, 'password') }} />
        </div>
        <Button type="submit" variant="outlined" className="green-button-outline sign-up-button">
          Sign Up
        </Button>
      </form>
      <h5>{errorText}</h5>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="LoginPage-header">
      <SignInCard />
    </div>
  )
}