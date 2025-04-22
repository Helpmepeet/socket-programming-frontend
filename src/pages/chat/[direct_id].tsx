import ChatBox from "@/component/chat/ChatBox";
import Message from "@/component/chat/message/Message";
import NavBar from "@/component/NavBar/NavBarDirect";
import CenterList from "@/component/chat/CenterList";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import useLocalStorage from "@/hook/useLocalStorage";
import { User } from "@/type/User";
import { DEFAULT_CURRENT_USER, SOCKET_MESSAGE } from "@/type/Constant";
import { MessageSocketType, ResType } from "@/type/Socket";
import { Box } from "@mui/material";

export default function Chat() {
  const router = useRouter();
  const socket = useContext(SocketContext);
  const [currentUser, _] = useLocalStorage<User>("user_data");

  const chatId = router.query.direct_id?.toString().replaceAll('"', "");
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: MessageSocketType }>({});
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    if (JSON.stringify(currentUser) === JSON.stringify(DEFAULT_CURRENT_USER)) {
      router.push("/login");
      return;
    }

    if (chatId) {
      getMessages();
      getDirectInformation();
    }
  }, [socket, currentUser, router]);

  function getMessages() {
    const messageListener = (message: MessageSocketType) => {
      setMessages((prevMessages: { [key: string]: MessageSocketType }) => {
        const newMessages = { ...prevMessages };
        newMessages[message._id] = message;
        return newMessages;
      });
    };

    const identifier = {
      type: "Direct",
      ownerId: currentUser.userId,
      chatId: chatId,
    };
    socket.on("get_messages_response", (res: ResType) =>
      console.log("Get Messages Status:", res.message)
    );
    socket.on("message", messageListener);
    socket.emit("getMessages", identifier);
  }

  function getDirectInformation() {
    const ids = {
      myUserId: currentUser.userId,
      chatId: chatId,
    };
    socket.on("get_direct_by_chat_id_response", (res: ResType) => {
      if (chatId === res.chatId) {
        console.log("Get Direct Information", res.message);
        if (res.message === SOCKET_MESSAGE.SUCCESS) {
          setUser({
            username: res.username ? res.username : "",
            userId: res.userId ? res.userId : "",
            profileImage: res.profileImage ? res.profileImage : "",
          });
          setBackgroundImage(res.backgroundImage ? res.backgroundImage : "");
          socket.off("get_messages_response");
        }
      }
    });
    socket.emit("getDirectByChatId", ids);
  }

  return (
    <>
      <NavBar avatar={user?.profileImage} label={user?.username} chatId={chatId} />

      <CenterList>
        <Box sx={{ backgroundImage: `url(${backgroundImage})`, height: "max-content", minHeight: "80vh", paddingTop: "10px" }}>
          {[...Object.values(messages)]
            .sort(
              (a: MessageSocketType, b: MessageSocketType) =>
                a.createdAt.valueOf() - b.createdAt.valueOf()
            )
            .map(
              (message: MessageSocketType) =>
                message.chatId === chatId && (
                  <Message
                    key={message._id}
                    id={message._id}
                    userId={message.userId}
                    text={message.message}
                    isMine={message.isOwner}
                    avatar={message.profileImage}
                    type={"Direct"}
                    senderName={message.username}
                    isLiked={message.isLiked}
                    totalLiked={message.like}
                  />
                )
            )}
        </Box>
      </CenterList>

      <ChatBox chatType="Direct" id={chatId} />
    </>
  );
}
