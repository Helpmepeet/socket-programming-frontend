import theme from "@/config/theme";
import { SocketContext } from "@/context/SocketContext";
import { SOCKET_MESSAGE } from "@/type/Constant";
import { ResType } from "@/type/Socket";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function register() {
  const router = useRouter();
  const socket = useContext(SocketContext);
  const [response, setResponse] = useState<ResType>({ message: "" });

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isInputError, setIsInputError] = useState<boolean[]>([false, false]);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState<string>();
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>();

  useEffect(() => {
    // below code set error about "this nickname is already in used"
    if (response.message === SOCKET_MESSAGE.USERNAME_IN_USE) {
      setIsInputError([isInputError[0], true]);
      setPasswordErrorMsg("this nickname is already in used");
    } else if (response.message === SOCKET_MESSAGE.SUCCESS) {
      socket.off("register_response");
      router.push("/login");
      return;
    }
  }, [socket, response]);

  function onSubmit(): void {
    if (!validateInput()) {
      return;
    }
    // socket : register should start here!
    socket.on("register_response", (res: any) => {
      console.log("Register Status:", res.message);
      setResponse(res);
    });
    socket.emit("register", { username: username, password: password });
  }

  function validateInput(): boolean {
    if (username.length === 0) {
      setIsInputError([true, isInputError[1]]);
      setUsernameErrorMsg("nickname cannot be blank");
      return false;
    }
    if (username.length > 20) {
      setIsInputError([true, isInputError[1]]);
      setUsernameErrorMsg("nickname is too long");
      return false;
    }
    if (password.length === 0 || confirmPassword.length === 0) {
      setIsInputError([isInputError[0], true]);
      setPasswordErrorMsg("password and confirmed cannot be blank");
      return false;
    }
    if (password.length < 6 || password.length > 20) {
      setIsInputError([isInputError[0], true]);
      setPasswordErrorMsg("password must be 6-20 char long");
      return false;
    }

    if (password.indexOf(" ") >= 0) {
      setIsInputError([isInputError[0], true]);
      setPasswordErrorMsg("password can not contain space");
      return false;
    }

    if (password !== confirmPassword) {
      setIsInputError([isInputError[0], true]);
      setPasswordErrorMsg("password not match");
      return false;
    }
    return true;
  }
  function clearError() {
    setIsInputError([false, false]);
  }

  return (
    <Stack
      sx={{
        margin: "auto",
      }}
      spacing={3}>
      <Typography align='center'>Sign Up</Typography>
      <Stack sx={{ width: "300px" }} spacing={theme.spacing(2)}>
        <Box
          sx={{
            backgroundColor: "white",
            border: "1px solid #000000",
            borderRadius: "20px",
            padding: "40px 20px",
          }}>
          <Typography align='center'>nickname</Typography>
          <TextField
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              clearError();
            }}
            error={isInputError[0]}
            fullWidth
            helperText={isInputError[0] && usernameErrorMsg}
          />
          <Typography align='center'>password</Typography>
          <TextField
            value={password}
            type={"password"}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError();
            }}
            error={isInputError[1]}
            fullWidth
          />
          <Typography align='center'>confirm password</Typography>
          <TextField
            value={confirmPassword}
            type={"password"}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              clearError();
            }}
            error={isInputError[1]}
            fullWidth
          />
          {isInputError[1] && (
            <Typography
              color={"error"}
              sx={{ marginTop: "30px" }}
              align='center'>
              {passwordErrorMsg}
            </Typography>
          )}
        </Box>

        <Button onClick={onSubmit} variant='contained'>
          Sign up
        </Button>
      </Stack>
      <Button
        variant='text'
        onClick={() => router.push("/login")}
        sx={{
          color: "black",
          position: "fixed",
          bottom: "5vh",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}>
        Log in
      </Button>
    </Stack>
  );
}
