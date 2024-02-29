import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { base_url } from "../../utils/common";

const TicTacToeGame = () => {
  const router = useRouter();
  const [latestBoard, setLatestBoard] = useState(Array(9).fill("E"));
  const [turn, setTurn] = useState("X");
  const [isComplete, setIsComplete] = useState(false);
  const [winner, setWinner] = useState(null);
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [gameId, setGameId] = useState("");
  const [userId, setUserId] = useState("");

  const getGameBoardData = async (id) => {
    try {
      const response = await axios.get(
        `${base_url}/tic-tac-toe/getGameBoardData/${id}`
      );
      const data = response.data;
      setLatestBoard(data.board || Array(9).fill("E"));
      setDifficultyLevel(data?.difficultyLevel)
      setGameId(data.gameId)
      setIsComplete(data.complete)
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const makeMove = async (cellIndex) => {
    const requestBody = {
      userId: userId,
      gameid: gameId || null,
      cellindex: cellIndex,
      difficultylevel: difficultyLevel,
    };

    try {
      const response = await axios.post(
        `${base_url}/tic-tac-toe/game`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      setIsComplete(data.complete);
      setGameId(data.gameId);
      setWinner(data.winner);
      getGameBoardData(userId);
    } catch (error) {
      console.error("Error making a move:", error);
    }
  };

  const startGame = async (userId) => {
    const requestBody = {
      userId: userId,
      gameid: null,
      cellindex: null,
      difficultylevel: difficultyLevel,
    };

    try {
      const response = await axios.post(
        `${base_url}/tic-tac-toe/game`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      setGameId(data.gameId)
      getGameBoardData(userId);
      setDifficultyLevel("");
    } catch (error) {
      console.error("Error making a move:", error);
    }
  };

  const handleDifficultyChange = (event) => {
    setDifficultyLevel(event.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    getGameBoardData(userId);
  }, [userId]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUserId(userId);
  }, []);

  return (
    <Box
      sx={{
        textAlign: "center",
        width: "100%",
        height: "98vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormControl
        sx={{
          width: "300px",
        }}
      >
        <InputLabel id="difficulty-label">Choose Difficulty Level</InputLabel>
        <Select
          labelId="difficulty-label"
          id="difficulty-select"
          value={difficultyLevel}
          onChange={handleDifficultyChange}
        >
          <MenuItem value="easy">Easy</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="h4" style={{ margin: "20px 0" }}>
        {difficultyLevel && (winner ? `Winner: ${winner}` : `Turn: ${turn}`)}
      </Typography>

      <Paper elevation={3} style={{ width: 300, margin: "0 auto" }}>
        {difficultyLevel &&
          latestBoard?.map((cell, index) => (
            <Button
              key={index}
              variant="outlined"
              style={{ width: "100px", height: "100px", fontSize: "24px" }}
              onClick={() => makeMove(index)}
            >
              {cell === "E" ? "" : cell}
            </Button>
          ))}
      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "300px",
          margin: "0 auto",
          marginTop: "42px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={!isComplete}
          onClick={() => startGame(userId)}
        >
          Start New Game
        </Button>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default TicTacToeGame;
