import ChatBox from "@/component/chat/ChatBox";
import CenterList from "@/component/chat/CenterList";
import Message from "@/component/chat/message/Message";
import NavBar from "@/component/NavBar/NavBarGroup";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/SocketContext";
import { useRouter } from "next/router";
import useLocalStorage from "@/hook/useLocalStorage";
import { User } from "@/type/User";
import { GroupSocketType, MessageSocketType, ResType } from "@/type/Socket";
import { DEFAULT_CURRENT_USER, SOCKET_MESSAGE } from "@/type/Constant";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

// Add type for group member
interface GroupMember {
  userId: string;
  username: string;
  profileImage: string;
  isOnline?: boolean;
  role?: string; // admin, moderator, member, etc.
}

export default function GroupChat() {
  const router = useRouter();
  const socket = useContext(SocketContext);
  const [currentUser, _] = useLocalStorage<User>("user_data");
  const chatId = router.query.group_id?.toString().replaceAll('"', "");
  const [messages, setMessages] = useState<{
    [key: string]: MessageSocketType;
  }>({});
  const [groupName, setGroupName] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [showMembers, setShowMembers] = useState<boolean>(true);

  useEffect(() => {
    if (JSON.stringify(currentUser) === JSON.stringify(DEFAULT_CURRENT_USER)) {
      router.push("/login");
      return;
    }
    if (chatId) {
      getMessages();
      getGroupInformation();
      getGroupMembers();
    }
  }, [socket, currentUser, router]);
  console.log("currentUser", currentUser);

  function getMessages() {
    const messageListener = (message: MessageSocketType) => {
      setMessages((prevMessages: { [key: string]: MessageSocketType }) => {
        const newMessages = { ...prevMessages };
        newMessages[message._id] = message;
        return newMessages;
      });
    };
    const identifier = {
      type: "Group",
      ownerId: currentUser.userId,
      chatId: chatId,
    };
    socket.on("get_messages_response", (res: ResType) =>
      console.log("Get Messages Status:", res.message)
    );
    socket.on("message", messageListener);
    socket.emit("getMessages", identifier);
  }

  function getGroupInformation() {
    const groupListener = (group: GroupSocketType) => {
      if (chatId === group._id) {
        setGroupName(group.name);
        setBackgroundImage(group.backgroundImage);
      }
    };
    socket.on("group", groupListener);
    socket.on("get_group_by_id_response", (res: ResType) =>
      console.log("Get Group Information Status:", res.message)
    );
    socket.emit("getGroupById", chatId);
  }

  // Add function to get group members
  function getGroupMembers() {
    const membersListener = (members: GroupMember[]) => {
      setGroupMembers(members);
    };

    socket.on("group_members", membersListener);
    socket.on("get_group_members_response", (res: ResType) =>
      console.log("Get Group Members Status:", res.message)
    );
    socket.emit("getGroupMembers", chatId);

    // Clean up listener when component unmounts
    return () => {
      socket.off("group_members", membersListener);
    };
  }

  // Toggle members sidebar
  const toggleMembersList = () => {
    setShowMembers(!showMembers);
  };

  return (
    <>
      <NavBar
        label={groupName}
        chatId={chatId}
        onMembersClick={toggleMembersList}
      />
      <Box sx={{ display: "flex", height: "80vh" }}>
        {/* Members sidebar */}
        {showMembers && (
          <Paper
            elevation={3}
            sx={{
              width: "250px",
              overflowY: "auto",
              height: "100%",
              borderRight: "1px solid #e0e0e0",
            }}>
            <Typography variant='h6' sx={{ p: 2, fontWeight: "bold" }}>
              Group Members ({groupMembers.length})
            </Typography>
            <Divider />
            <List>
              {groupMembers.map((member) => (
                <ListItem key={member.userId} alignItems='flex-start'>
                  <ListItemAvatar>
                    <Avatar src={member.profileImage} alt={member.username} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        component='span'
                        variant='body1'
                        fontWeight={
                          member.role === "admin" ? "bold" : "regular"
                        }>
                        {member.username}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component='span'
                          variant='body2'
                          color={
                            member.isOnline ? "success.main" : "text.secondary"
                          }>
                          {/* {member.isOnline ? "Online" : "Offline"} */}
                        </Typography>
                        {member.role && (
                          <Typography
                            component='span'
                            variant='body2'
                            color='primary'
                            sx={{ ml: 1 }}>
                            {member.role}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* Chat area */}
        <CenterList>
          <Box
            sx={{
              backgroundImage: `url(${backgroundImage})`,
              height: "max-content",
              minHeight: "80vh",
              paddingTop: "10px",
              width: "100%",
            }}>
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
                      type={"Group"}
                      senderName={message.username}
                      isLiked={message.isLiked}
                      totalLiked={message.like}
                    />
                  )
              )}
          </Box>
        </CenterList>
      </Box>
      <ChatBox chatType='Group' id={chatId} />
    </>
  );
}
