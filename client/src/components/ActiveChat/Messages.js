import React, { useMemo } from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  const lastReadMessage = useMemo(() => {
    const listOfReadMessages = messages.filter(message => message.senderId === userId && message.recipientRead === true)
    const lastReadMessage = listOfReadMessages[listOfReadMessages.length - 1]

    return lastReadMessage;
  } , [messages, userId])

  return (
    <Box>
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
