import { useState } from "react";

export default function useModal() {
  const [open, setOpen] = useState<boolean>(false);

  function onClick(): void {
    setOpen(true);
  }

  function handleClose(): void {
    setOpen(false);
  }

  const inputProps = {
    open: open,
    onOpen: onClick,
    onClose: handleClose,
  };
  return inputProps;
}
