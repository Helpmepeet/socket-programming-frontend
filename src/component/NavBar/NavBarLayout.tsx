import { AppBar, Avatar, Box, Toolbar } from "@mui/material";

type props = {
  avatar?: string,
  displayComponent: JSX.Element,
  children?: JSX.Element
}

export default function ProfileLayout({ ...props }: props) {
  return (
    <AppBar
      position="sticky"
      sx={{
        borderBottom: "2px solid #000000",
      }}>
      <Toolbar>
        {props.avatar &&
          <Avatar src={props.avatar} sx={{ marginRight: "3vw" }} />
        }
        <Box sx={{ flexGrow: 1 }}>
          {props.displayComponent}
        </Box>
        {props.children}
      </Toolbar>
    </AppBar>
  )
}