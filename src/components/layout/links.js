import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BadgeIcon from "@mui/icons-material/Badge";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const size = "";
export const sidebarLinks = [
  {
    position: 1,
    links: [
      {
        url: "/accounts",
        icon: <ManageAccountsIcon {...(size && { fontSize: size })} />,
        label: "accounts",
      },
      {
        url: "/applicants",
        icon: <GroupIcon {...(size && { fontSize: size })} />,
        label: "applicants",
      },
      {
        url: "/clients",
        icon: <BadgeIcon {...(size && { fontSize: size })} />,
        label: "clients",
      },
      // {
      //   url: "/posts",
      //   icon: <NoteAddIcon {...(size && { fontSize: size })} />,
      //   label: "posts",
      // },
      {
        url: "/jobs",
        icon: <WorkIcon {...(size && { fontSize: size })} />,
        label: "jobs",
      },
      {
        url: "/chats",
        icon: <ChatBubbleIcon {...(size && { fontSize: size })} />,
        label: "chats",
      },
    ],
  },
  {
    position: 2,
    links: [
      // {
      //   url: "/profile",
      //   icon: <AccountCircleIcon {...(size && { fontSize: size })} />,
      //   label: "profile",
      // },
      {
        url: "/chats",
        icon: <ChatBubbleIcon {...(size && { fontSize: size })} />,
        label: "chats",
      },
    ],
  },
  {
    position: 3,
    links: [
      // {
      //   url: "/profile",
      //   icon: <AccountCircleIcon {...(size && { fontSize: size })} />,
      //   label: "profile",
      // },
      {
        url: "/chats",
        icon: <ChatBubbleIcon {...(size && { fontSize: size })} />,
        label: "chats",
      },
    ],
  },
];
