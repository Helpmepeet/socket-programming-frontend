import theme from "@/config/theme";
import { Box } from "@mui/material";
import { ComponentType } from "react";

export default function withFooter<T>(WrapperComponent: ComponentType<T>) {
  const withFooter = (props: any) => {
    return (
      <Box position={"relative"}
        sx={{
          width: "100%",
          backgroundColor: theme.palette.primary.main,
          padding: `${theme.spacing(3)} ${theme.spacing(5)}`,
          bottom: 0
        }}>
        <WrapperComponent
          {...props}
        />
      </Box>
    )
  }
  return withFooter
}