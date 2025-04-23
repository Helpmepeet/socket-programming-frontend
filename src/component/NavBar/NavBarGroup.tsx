import { IconButton, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavBarLayout from "./NavBarLayout";
import useMenu from "@/hook/useMenu";
import MenuNavBar from "./MenuNavBar";

type props = {
  label?: string;
  chatId: string;
  onMembersClick?: () => void;
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
        {/* Members display toggle button /}
        {props.onMembersClick && (
          <IconButton 
            onClick={props.onMembersClick}
            sx={{ mr: 1 }}
            aria-label="Toggle members list"
          >
            <PeopleIcon />
          </IconButton>
        )}

        {/ Settings menu button */}
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
