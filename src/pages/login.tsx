import theme from "@/config/theme";
import { SocketContext } from "@/context/SocketContext";
import useLocalStorage from "@/hook/useLocalStorage";
import { SOCKET_MESSAGE } from "@/type/Constant";
import { ResType } from "@/type/Socket";
import { User } from "@/type/User";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const socket = useContext(SocketContext);
  const [_, setCurrentUser] = useLocalStorage<User>("user_data");
  const [response, setResponse] = useState<ResType>({
    message: "",
    userId: "",
    profileImage: "",
  });

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isInputError, setIsInputError] = useState<boolean>(false);

  useEffect(() => {
    if (response.message === SOCKET_MESSAGE.NOT_FOUND) {
      setIsInputError(true);
    } else if (
      response.message === SOCKET_MESSAGE.SUCCESS &&
      response.userId &&
      response.username === username
    ) {
      setCurrentUser({
        username: username,
        userId: response.userId,
        profileImage: response.profileImage ? response.profileImage : "",
      });
      socket.off("login_response");
      router.push("/");
      return;
    }
  }, [socket, response]);

  function onSubmit(): void {
    if (
      username.length === 0 ||
      username.length > 20 ||
      password.length < 6 ||
      password.length > 20
    ) {
      setIsInputError(true);
      return;
    }
    socket.on("login_response", (res: ResType) => {
      console.log("Login Status:", res.message);
      setResponse(res);
    });
    socket.emit("login", { username: username, password: password });
    return;
  }

  return (
    <>
      <Stack
        sx={{
          margin: "auto",
        }}
        spacing={3}>
        <Typography align='center'>Login</Typography>
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
                setIsInputError(false);
              }}
              error={isInputError}
              fullWidth
            />
            <Typography align='center'>password</Typography>
            <TextField
              value={password}
              type={"password"}
              onChange={(event) => {
                setPassword(event.target.value);
                setIsInputError(false);
              }}
              error={isInputError}
              fullWidth
            />
            {isInputError && (
              <Typography
                color={"error"}
                sx={{ marginTop: "30px" }}
                align='center'>
                wrong nickname or password
              </Typography>
            )}
          </Box>

          <Button onClick={onSubmit} variant='contained'>
            Login
          </Button>
        </Stack>
      </Stack>
      <Button
        variant='text'
        onClick={() => router.push("/register")}
        sx={{
          color: "black",
          position: "fixed",
          bottom: "5vh",
          left: "50%",
          transform: "translate(-50%, 0)",
        }}>
        Sign Up
      </Button>
    </>
  );
}
