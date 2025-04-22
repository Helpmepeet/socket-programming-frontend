import theme from "@/config/theme";
import { IconButton, TextField as MuiTextField, styled } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useState } from "react";
import withFooter from "@/hoc/Layout/withFooter";
import { ChatType } from "@/type/Chat";
import { SocketContext } from "@/context/SocketContext";
import useLocalStorage from "@/hook/useLocalStorage";
import { User } from "@/type/User";

const TextField = styled(MuiTextField)({
  ".MuiOutlinedInput-root": {
    "&": {
      borderColor: "none",
      backgroundColor: theme.palette.background.default,
      borderRadius: "30px",
    },
    "&:hover": {
      borderColor: "none",
    },
  },
});

type props = {
  chatType: ChatType;
  id: string;
};

function ChatBox({ ...props }: props) {
  const socket = useContext(SocketContext);
  const [currentUser, _] = useLocalStorage<User>("user_data");

  const [value, setValue] = useState<string>("");

  function sendMessage() {
    console.log(`Send ${props.chatType} message: ${props.id}`);

    const messageInfo = {
      type: props.chatType,
      ownerId: currentUser.userId,
      ownerName: currentUser.username,
      ownerProfileImage: currentUser.profileImage,
      chatId: props.id,
      message: value,
    };
    socket.emit("createMessage", messageInfo);

    setValue("");
  }

  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter message here!"
      fullWidth
      sx={{ borderRadius: 8 }}
      InputProps={{
        endAdornment: value.length > 0 && (
          <IconButton onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        ),
      }}
    />
  );
}

export default withFooter(ChatBox);
