import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  Link,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { login } from "./store/utils/thunkCreators";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BgImage from "./assets/images/bg-img.png";
import BubbleSvg from "./assets/images/bubble.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh"
  },
  leftSide: {
    backgroundImage: `url(${BgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: "cover",
    width: "35%",
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

  image: {
    height: "96px",
    marginBottom: "2rem",
  },

  title: {
    fontFamily: "Open Sans",
    fontSize: 36,
    color: "#fff",

  },

  rightSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  inputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: "4rem"
  },
  input: {
    paddingTop: "1rem",
  },
  header: {
    width: "100%",
    display: "flex",
    margin: "4rem",
    marginRight: "12rem",
    alignItems: "center",
    justifyContent: "flex-end",
    color: "#c7c7c7"
  },
  registerButton: {
    marginLeft: "4rem",
    width: "12rem",
    height: "3rem",
    boxShadow: "0 2px 5px rgba(80,80,80,0.1)",
    color: "#3A8DFF"
  },
  form: {
    width: "40%",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  titleFormContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "4rem",
  },
  titleForm: {
    fontSize: "3rem",
  },
  buttonSubmit: {
    height: "4.5rem",
    width: "14rem",
  }
}));

const Login = (props) => {
  const history = useHistory();
  const { user, login } = props;
  const classes = useStyles(props);
  const matches = useMediaQuery('(min-width:720px)');

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    await login({ email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Box container justify="center" className={classes.root}>
      {matches && (
      <Box component="div" className={classes.leftSide}>
        <Box component="div" className={classes.cover}>
        <Box component="img" className={classes.image} src={BubbleSvg} alt="bubble chat" />
        <Typography className={classes.title}>Converse with anyone</Typography>
        <Typography className={classes.title}>with any language</Typography> 
        </Box>   
      </Box>
      )}
      <Box component="div" className={classes.rightSide}>
        <Box component="div" className={classes.header}>
          <Typography>Don't have an account?</Typography>
          <Button color="inherit" className={classes.registerButton} onClick={() => history.push("/register")}>Create account</Button>
        </Box>
        <Box component="form" className={classes.form} onSubmit={handleLogin}>
          <Box component="div" className={classes.titleFormContainer}>
            <Typography className={classes.titleForm}>Welcome back!</Typography>
          </Box>
          <Box component="div" className={classes.inputContainer}>
            <FormControl margin="normal" required>
                  <TextField
                    className={classes.input}
                    color="primary"
                    aria-label="email"
                    label="E-mail address"
                    name="email"
                    type="text"
                  />
          </FormControl>
          <FormControl margin="normal" required>
                <TextField
                  className={classes.input}
                  color="primary"
                  label="Password"
                  aria-label="password"
                  fullWidth
                  type="password"
                  name="password"
                  InputProps={{
                    endAdornment: <Link>Forgot?</Link>,
                  }}
                />
              </FormControl>
          </Box>
          <Button color="primary" className={classes.buttonSubmit} type="submit" variant="contained" size="large">
                Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
