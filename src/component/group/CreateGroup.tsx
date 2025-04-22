import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import useModal from "@/hook/useModal";
import Dialog from "../common/Dialog";
import withFooter from "@/hoc/Layout/withFooter";
import { SocketContext } from "@/context/SocketContext";
import { ResType } from "@/type/Socket";
import { useAuth } from "@/context/AuthContext";

function CreateGroup() {
  const socket = useContext(SocketContext);
  const { user } = useAuth();

  const [newGroupName, setNewGroupName] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  const modal = useModal();

  // socket.on("group", (group: any) => {
  //   console.log("New Group Created:", group.name);
  //   console.log("Members in group:", group.members);
  // });

  function handleChangeNewGroupName(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    if (event.target.value.length === 0) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setNewGroupName(event.target.value);
  }

  function handleCreateGroup() {
    if (!user) {
      console.error("No user logged in");
      return;
    }

    if (newGroupName.length === 0) {
      setIsError(true);
      setErrMsg("group name cannot be blank");
      return;
    }

    // console.log("Create Group Name:", newGroupName);
    socket.once("create_group_response", (res: ResType) => {
      console.log("Create Group Status:", res.message);
      if (res.message === "GroupName already in use") {
        setErrMsg(res.message);
        setIsError(true);
        return;
      }
      setNewGroupName("");
      modal.onClose();
    });
    // console.log("userId", user.userId);

    socket.emit("createGroup", {
      groupName: newGroupName,
      userId: user.userId,
    });
    // console.log("emit createGroup", newGroupName, user.userId);
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <Typography sx={{ alignContent: "center" }}>Create Group</Typography>
        <IconButton
          onClick={() => {
            setNewGroupName("");
            setIsError(false);
            modal.onOpen();
          }}>
          <AddIcon />
        </IconButton>
      </Box>
      <Dialog
        open={modal.open}
        onClose={modal.onClose}
        header={"create new group"}
        content={
          <TextField
            onChange={handleChangeNewGroupName}
            inputProps={{ maxLength: 20 }}
            helperText={!isError ? `${newGroupName.length}/20` : errMsg}
            error={isError}
            autoFocus
          />
        }
        iconAction={[
          [<CloseIcon />, modal.onClose],
          [<CheckIcon />, handleCreateGroup],
        ]}
      />
    </>
  );
}

export default withFooter(CreateGroup);
