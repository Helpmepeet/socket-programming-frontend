import { Box, Typography, styled } from "@mui/material"

type props = {
  text: string,
  isMine: boolean,
  totalLike: number
}

export default function BubbleMessage({ ...props }: props) {
  const CSSmessage = styled(Typography)`
    background-color: ${props.isMine ? "#FFFFFF" : "#278EFF"} ;
    color: ${props.isMine ? "#000000" : "#FFFFFF"};
    padding: 10px 14px;
    border-radius: 20px;
  `

  return (
    <Box sx={{ position: "relative" }}>
      {props.totalLike > 0 &&
        <Box
          sx={{
            position: "absolute",
            bottom: "30px",
            left: props.isMine ? "-10px" : "auto",
            right: !props.isMine ? "-10px" : "auto"
          }}>
          &#128077; {props.totalLike}
        </Box>
      }
      <CSSmessage>{props.text}</CSSmessage>
    </Box>
  )
}