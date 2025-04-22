import Dialog from "@/component/common/Dialog";
import theme from "@/config/theme";
import useModal from "@/hook/useModal";
import { ChatType } from "@/type/Chat";
import { Avatar, Box, Button, ListItem, Stack, Typography } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import BubbleMessage from "./BubbleMessage";
import { useRouter } from "next/router";
import useLocalStorage from "@/hook/useLocalStorage";
import { User } from "@/type/User";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { ResType } from "@/type/Socket";

type props = {
  id: string;
  userId: string;
  text: string;
  isMine: boolean;
  avatar?: string;
  type: ChatType;
  senderName?: string;
  isLiked: boolean;
  totalLiked: number;
};

Message.defaultProps = {
  senderName: "Sender Name",
  avatar: "https://avatars.githubusercontent.com/u/63848208?v=4",
};

export default function Message({ ...props }: props) {
  const socket = useContext(SocketContext);
  const [currentUser, _] = useLocalStorage<User>("user_data");
  const [userChatId, setUserChatId] = useState<string>("");
  const isOwner = props.userId === currentUser.userId

  const router = useRouter();
  const modal = useModal();

  function inspectUser() {
    const ids = {
      myUserId: currentUser.userId,
      userId: props.userId,
    };

    socket.on("get_direct_by_user_id_response", (res: any) => {
      console.log("Get The User Information Status:", res.message);
      setUserChatId(res.chatId);
    });
    socket.emit("getDirectByUserId", ids);
  }

  function likeMessage() {
    const identifier = {
      ownerId: currentUser.userId,
      messageId: props.id,
    };

    socket.on("like_message_response", (res: ResType) =>
      console.log("Toggle Like Message Status:", res.message)
    );
    socket.emit("likeMessage", identifier);
  }

  function clickEmoji(): void {
    console.log("Emoji is clicked");
    likeMessage();
  }

  return (
    <ListItem
      sx={{
        flexDirection: isOwner ? "row-reverse" : "initial",
      }}
    >
      {props.type === "Group" && (
        <>
          <Button
            onClick={() => {
              inspectUser();
              modal.onOpen();
            }}
          >
            <Avatar
              src={props.avatar}
              sx={{
                margin: isOwner ? `0 0 0 ${theme.spacing(2)}` : `0 ${theme.spacing(2)} 0 0`,
              }}
            />
          </Button>
          <Dialog
            open={modal.open}
            onClose={modal.onClose}
            content={
              <>
                <Avatar src={props.avatar} sx={{ margin: "15px auto", width: 56, height: 56 }} />
                <Typography>{isOwner ? currentUser.username : props.senderName}</Typography>
              </>
            }
            iconAction={
              !isOwner
                ? [
                  [
                    <MessageIcon />,
                    () => {
                      router.push(`/chat/${userChatId}`);
                    },
                  ],
                ]
                : null
            }
          />
        </>
      )}
      <Stack>
        {props.type === "Group" && !isOwner && (
          <Typography sx={{ paddingLeft: theme.spacing(2), paddingBottom: 0 }} variant="body2">
            {props.senderName}
          </Typography>
        )}
        <Stack
          direction={isOwner ? "row-reverse" : "row"}
          sx={{
            alignItems: "center",
            "&:hover": {
              ".emoji": {
                visibility: "visible",
                opacity: props.isLiked ? 1 : 0.5,
                cursor: "pointer",
              },
            },
          }}
        >
          <BubbleMessage text={props.text} isMine={isOwner} totalLike={props.totalLiked} />
          <Box
            onClick={clickEmoji}
            sx={{
              visibility: "hidden",
              margin: `0 ${theme.spacing(2)}`,
            }}
            className="emoji"
          >
            &#128077;
          </Box>
        </Stack>
      </Stack>
    </ListItem>
  );
}
