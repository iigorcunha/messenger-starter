import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";


const useStyles = makeStyles((theme) => ({
  messageContainer: {
    [theme.breakpoints.up("md")]: {
      height: "calc(100vh - 230px)",
      overflowY: "auto",
      '&::-webkit-scrollbar': {
        display: "none",
      }
    }
  }
}));

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const classes = useStyles();

  const lastReadMessage = useMemo(() => {
    const listOfReadMessages = messages.filter(message => message.senderId === userId && message.recipientRead === true)
    const lastReadMessage = listOfReadMessages[listOfReadMessages.length - 1]

    return lastReadMessage;
  } , [messages, userId])

  return (
    <Box className={classes.messageContainer}>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble 
            key={message.id} 
            text={message.text}
            time={time}
            otherUser={otherUser}  
            lastReadMessage={lastReadMessage && lastReadMessage.id === message.id} />
            
        ) : (
          <OtherUserBubble 
            key={message.id} 
            text={message.text} 
            time={time}
            otherUser={otherUser} 
            />
        );
      })}
    </Box>
  );
};

export default Messages;
