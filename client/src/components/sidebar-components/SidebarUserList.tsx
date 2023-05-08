import { Box } from "@mui/material";
import { useSocket } from "../../context/SocketContext";

export default function SidebarUserList() {
  const { userList } = useSocket();
  
  return (
    <Box>
      <div>SidebarUserList</div>
      <ul>
        {userList !== undefined ? (
          userList.map((user, index) => (
            <li key={index}>{user.username}</li>
          ))
        ) : (
          <li>Ingen användare ansluten</li>
        )}
      </ul>
    </Box>
  )
}
