export interface ResType {
  message: string;
  userId?: string;
  username?: string;
  profileImage?: string;
  backgroundImage?: string;
  chatId?: string;
}

export type UserSocketType = {
  _id: string;
  myUserId: string;
  username: string;
  profileImage: string;
  chatId: string;
};

export type GroupSocketType = {
  _id: string;
  name: string;
  backgroundImage: string;
  members: UserSocketType[];
};

export type MessageSocketType = {
  _id: string;
  message: string;
  userId: string;
  username: string;
  profileImage: string;
  isOwner: boolean;
  isLiked: boolean;
  like: number;
  createdAt: Date;
  chatId: string;
};
