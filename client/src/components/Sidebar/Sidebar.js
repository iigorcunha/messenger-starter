import React from "react";
import { Box, Typography, Drawer, IconButton } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Search, Chat, CurrentUser } from "./index.js";

const useStyles = makeStyles((theme) => ({
  rootUpMd: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    },
    paddingLeft: 21,
    paddingRight: 21,
    flexGrow: 1
  },
  rootDownMd: {
    [theme.breakpoints.up("lg")]: {
      display: "none",
      height: 30
    },
  },
  drawerChat: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.29,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 15
  }
}));

const Sidebar = (props) => {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const conversations = props.conversations || [];
  const { handleChange, searchTerm } = props;

  return (
    <>
    <Box className={classes.rootDownMd}>
      <IconButton onClick={() => setIsDrawerOpen(true)}><MenuIcon fontSize="lg" /></IconButton>
      <Drawer 
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}>
        <Box className={classes.drawerChat}>
        <CurrentUser />
        <Typography className={classes.title}>Chats</Typography>
        <Search handleChange={handleChange} />
        {conversations
          .filter((conversation) => conversation.otherUser.username.includes(searchTerm))
          .map((conversation) => {
            return <Chat conversation={conversation} key={conversation.otherUser.username} handleDrawer={setIsDrawerOpen} />;
          })}
        </Box>
      </Drawer>
    </Box>
    <Box className={classes.rootUpMd}>
      <CurrentUser />
      <Typography className={classes.title}>Chats</Typography>
      <Search handleChange={handleChange} />
      {conversations
        .filter((conversation) => conversation.otherUser.username.includes(searchTerm))
        .map((conversation) => {
          return <Chat conversation={conversation} key={conversation.otherUser.username} />;
        })}
    </Box>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    conversations: state.conversations
  };
};

export default connect(mapStateToProps, null)(Sidebar);
