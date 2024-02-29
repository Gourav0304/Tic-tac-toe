import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Snackbar,
  Box,
  Link,
} from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useRouter } from "next/router";
import axios from "axios";


function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  

const SignUp = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/user/signup",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response.status", response.status);

      if (response.status === 201) {
        alert("Signup successful. Login now!");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        alert(response.data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An unexpected error occurred");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "98vh",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: 20,
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 4,
          }}
        >
          Tic Tac Toe
        </Typography>
        <Typography variant="h6" align="left">
          SignUp
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: "Username is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
          >
            Sign Up
          </Button>
        </form>
        <Box
          sx={{
            mt: 2,
            mb: 2,
            textAlign: "center",
          }}
        >
          Already have account ?
          <Link onClick={() => router.push("/login")}>Login</Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
