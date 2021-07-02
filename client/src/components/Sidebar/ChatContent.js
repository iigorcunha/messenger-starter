import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: props => (
    {
      fontSize: 12,
      color: props.unreadMessages ? "" : "#9CADC8",
      fontWeight: "bold",
      letterSpacing: -0.17,
    }
  ),
  notification: {
    height: 20,
    width: 20,
    backgroundColor: "#3F92FF",
    marginRight: 10,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  badge: {
    top: 10,
    right: 30,
  }
}));

const ChatContent = (props) => {
  const classes = useStyles(props);

  const { conversation, unreadMessages } = props;
  const { latestMessageText, otherUser } = conversation;


  return (
    <Box className={classes.root} >
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      <Box>
        <Badge className={classes.badge} badgeContent={unreadMessages} color="primary" max={999} />
      </Box>
    </Box>
  );
};

export default ChatContent;
