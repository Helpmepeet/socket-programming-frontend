import { useState } from "react";

export default function useMenu() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  function handleOpenMenu() {
    setOpenMenu(true);
  }
  function handleCloseMenu() {
    setOpenMenu(false);
  }
  return {
    openMenu,
    handleOpenMenu,
    handleCloseMenu,
  };
}
