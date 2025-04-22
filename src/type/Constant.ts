export enum SOCKET_MESSAGE {
  SUCCESS = "Success",
  USERNAME_IN_USE = "Username already in use",
  NOT_FOUND = "Not found matching username and password",
}

export const DEFAULT_CURRENT_USER = {
  username: "",
  userId: "",
  profileImage: "",
};
