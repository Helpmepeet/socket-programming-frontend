import { Menu as MuiMenu } from "@mui/material";

type props = {
  open: boolean,
  onClose: () => void,
  children: any
}

export default function Menu({ ...props }: props) {
  return (
    <MuiMenu
      open={props.open}
      onClose={props.onClose}
      sx={{ mt: '30px' }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {props.children}
    </MuiMenu>
  )
}