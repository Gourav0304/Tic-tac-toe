import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Link,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/router";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/auth/login",
        data
      );
      const token = response.data.user.access_token;
      const userId = response.data.user._id
      console.log('userId', userId)
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      console.log('response', response)

      if (response.status === 201) {
        alert('Login successful!');
        router.push('/game');
    } else {
        alert('Login failed');
    }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
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
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                type="password"
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
          Already have an account ?
          <Link onClick={() => router.push("/signup")}>Sign up</Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
