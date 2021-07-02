import React from "react";
import {
  Box,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import BgImage from "../assets/images/bg-img.png";
import BubbleSvg from "../assets/images/bubble.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh"
  },
  leftSide: {
    backgroundImage: `url(${BgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: "cover",
    width: "35%",
    [theme.breakpoints.down("md")]: {
      display: "none",
    }
  },
  cover: {
    background: "linear-gradient(0deg, rgba(134,185,255,1) 0%, rgba(58,141,255,1) 100%)",
    height: "100%",
    opacity: 0.85,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  chatBubbleImg: {
    height: "96px",
    marginBottom: "2rem",
  },

  title: {
    fontSize: 36,
    color: theme.palette.primary.contrastText
  },

  rightSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
}));

export const AuthLayout = ({children}) => {
  const classes = useStyles();
  return (
  <Box justify="center" className={classes.root}>
  <Box component="div" className={classes.leftSide}>
    <Box component="div" className={classes.cover}>
    <Box component="img" className={classes.chatBubbleImg} src={BubbleSvg} alt="bubble chat" />
    <Typography color="textPrimary" className={classes.title}>Converse with anyone</Typography>
    <Typography className={classes.title}>with any language</Typography> 
    </Box>   
  </Box>
  <Box component="div" className={classes.rightSide}>
    {children}
  </Box>
</Box>
);
}