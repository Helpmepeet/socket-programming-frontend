import { IconButton, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NavBarLayout from "./NavBarLayout";
import useMenu from "@/hook/useMenu";
import MenuNavBar from "./MenuNavBar";

type props = {
  label?: string,
  avatar: string,
  chatId: string
}

NavBarDirect.defaultProps = {
  label: "LOADING...",
  avatar: "AVATAR",
  chatId: "SHOULD HAVE CHAT ID"
}

export default function NavBarDirect({ ...props }: props) {
  const menu = useMenu()
  return (
    <NavBarLayout
      avatar={props.avatar}
      displayComponent={<Typography>{props.label}</Typography>}>
      <>
        <IconButton onClick={menu.handleOpenMenu}>
          <MoreVertIcon />
        </IconButton>
        <MenuNavBar
          open={menu.openMenu}
          onClose={menu.handleCloseMenu}
          chatId={props.chatId}
          type={"Direct"}
        />
      </>
    </NavBarLayout>
  )
}