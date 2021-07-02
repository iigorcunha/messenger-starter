import React from "react";
import { connect } from "react-redux";
import { Grid, CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    }
  },
}));

const Home = (props) => {
  const classes = useStyles();
  const { fetchConversations } = props;

  React.useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <SidebarContainer />      
      <ActiveChat />
    </Grid>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
