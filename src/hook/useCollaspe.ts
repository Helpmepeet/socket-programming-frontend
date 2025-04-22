import { useState } from "react";

export default function useCollaspe() {
  const [open, setOpen] = useState<boolean>(false);

  function onClick(): void {
    setOpen(!open);
  }

  return {
    open: open,
    onClick: onClick,
  };
}
