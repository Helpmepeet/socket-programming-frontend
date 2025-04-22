import { List as MuiList } from "@mui/material";
import { ReactNode } from "react";

type props = {
  children: ReactNode[]
}

export default function List({ ...props }: props) {
  return (
    <MuiList disablePadding>
      {props.children}
    </MuiList>
  )
}