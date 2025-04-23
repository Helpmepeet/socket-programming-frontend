import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import useModal from "@/hook/useModal";
import Dialog from "../common/Dialog";
import withFooter from "@/hoc/Layout/withFooter";
import { SocketContext } from "@/context/SocketContext";
import { ResType } from "@/type/Socket";
import { useAuth } from "@/context/AuthContext";

function CreateJoinGroup() {
  const socket = useContext(SocketContext);
  const { user } = useAuth();

  const [newGroupName, setNewGroupName] = useState("");
  const [joinGroupName, setJoinGroupName] = useState("");

  const [isError, setIsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const createModal = useModal();
  const joinModal = useModal();

  function handleChangeNewGroupName(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setNewGroupName(value);
    setIsError(value.length === 0);
  }

  function handleChangeJoinGroupName(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setJoinGroupName(value);
    setIsError(false);
  }

  function handleCreateGroup() {
    if (!user) return;
    if (newGroupName.trim().length === 0) {
      setIsError(true);
      setErrMsg("Group name cannot be blank");
      return;
    }

    socket.once("create_group_response", (res: ResType) => {
      if (res.message === "GroupName already in use") {
        setErrMsg(res.message);
        setIsError(true);
        return;
      }
      setNewGroupName("");
      createModal.onClose();
    });

    socket.emit("createGroup", {
      groupName: newGroupName,
      userId: user.userId,
    });
  }

  function handleJoinGroup() {
    if (!user || joinGroupName.trim().length === 0) {
      setIsError(true);
      setErrMsg("Group name is required");
      return;
    }

    socket.once("join_group_response", (res: any) => {
      if (res.message !== "Success") {
        setIsError(true);
        setErrMsg(res.message);
        return;
      }
      setJoinGroupName("");
      joinModal.onClose();
    });

    socket.emit("joinGroup", {
      groupName: joinGroupName,
      userId: user.userId,
    });
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Create / Join Group</Typography>
        <Box>
          <IconButton
            onClick={() => {
              setNewGroupName("");
              setIsError(false);
              createModal.onOpen();
            }}>
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setJoinGroupName("");
              setIsError(false);
              joinModal.onOpen();
            }}>
            <LoginIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Modal for creating a group */}
      <Dialog
        open={createModal.open}
        onClose={createModal.onClose}
        header={"Create New Group"}
        content={
          <TextField
            onChange={handleChangeNewGroupName}
            inputProps={{ maxLength: 20 }}
            helperText={!isError ? `${newGroupName.length}/20` : errMsg}
            value={newGroupName}
            error={isError}
            autoFocus
          />
        }
        iconAction={[
          [<CloseIcon />, createModal.onClose],
          [<CheckIcon />, handleCreateGroup],
        ]}
      />

      {/* Modal for joining a group */}
      <Dialog
        open={joinModal.open}
        onClose={joinModal.onClose}
        header={"Join Group"}
        content={
          <TextField
            onChange={handleChangeJoinGroupName}
            helperText={!isError ? "Enter Group Name" : errMsg}
            value={joinGroupName}
            error={isError}
            autoFocus
          />
        }
        iconAction={[
          [<CloseIcon />, joinModal.onClose],
          [<CheckIcon />, handleJoinGroup],
        ]}
      />
    </>
  );
}

export default withFooter(CreateJoinGroup);
