import { IconButton, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavBarLayout from "./NavBarLayout";
import useMenu from "@/hook/useMenu";
import MenuNavBar from "./MenuNavBar";

type props = {
  label?: string;
  chatId: string;
};

NavBarGroup.defaultProps = {
  label: "Loading...",
  chatId: "SHOULD HAVE CHAT_ID",
};

export default function NavBarGroup({ ...props }: props) {
  const menu = useMenu();
  return (
    <NavBarLayout displayComponent={<Typography>{props.label}</Typography>}>
      <>
        <IconButton onClick={menu.handleOpenMenu}>
          <MoreVertIcon />
        </IconButton>
        <MenuNavBar
          open={menu.openMenu}
          onClose={menu.handleCloseMenu}
          chatId={props.chatId}
          type={"Group"}
        />
      </>
    </NavBarLayout>
  );
}
