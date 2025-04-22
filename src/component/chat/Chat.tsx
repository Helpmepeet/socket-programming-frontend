import { Avatar, ListItemButton, Typography } from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';
import { ChatType } from "@/type/Chat";
import Link from "next/link";

type props = {
  href: string,
  label: string,
  type: ChatType,
  avatar?: string
}

Chat.defaultProps = {
  avatar: "https://avatars.githubusercontent.com/u/62459518?v=4"
}

export default function Chat({ ...props }: props) {
  return (
    <Link style={{ textDecoration: "none", color: "black" }} href={props.href}>
      <ListItemButton sx={{ minHeight: "56px", margin: 0 }}>
        {props.type === "Direct" &&
          <Avatar src={props.avatar} sx={{ marginRight: "3vw" }} />
        }
        <Typography sx={{ flexGrow: 1 }}>{props.label}</Typography>
        <MessageIcon />
      </ListItemButton>
    </Link>
  )
}