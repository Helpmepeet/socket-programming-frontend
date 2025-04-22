import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  IconButton,
  Stack,
} from "@mui/material";

type props = {
  open: boolean;
  onClose: () => void;
  header?: string;
  content: JSX.Element;
  iconAction: [JSX.Element, () => void][] | null;
};

export default function Dialog({ ...props }: props) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <MuiDialog open={props.open} onClose={props.onClose}>
        <DialogTitle sx={{ margin: "auto" }}>{props.header}</DialogTitle>
        <Stack spacing={0}>
          <DialogContent sx={{ padding: "0 50px" }}>
            {props.content}
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            {props.iconAction?.map(([Icon, onClick], index) => (
              <IconButton key={index} onClick={onClick}>
                {Icon}
              </IconButton>
            ))}
          </DialogActions>
        </Stack>
      </MuiDialog>
    </Box>
  );
}
