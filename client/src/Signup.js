import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { register } from "./store/utils/thunkCreators";
import { AuthLayout } from "./components/AuthLayout";

const useStyles = makeStyles((theme) => ({
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
    color: theme.palette.grey[400]
  },
  loginButtonRoute: {
    marginLeft: "4rem",
    width: "12rem",
    height: "3rem",
    boxShadow: "0 2px 5px rgba(80,80,80,0.1)",
    color: theme.palette.primary.main,
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

const SignUp = (props) => {
  const history = useHistory();
  const { user, register } = props;

  const classes = useStyles(props);

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <AuthLayout>
      <Box component="div" className={classes.header}>
        <Typography>Already have an account?</Typography>
        <Button color="inherit" className={classes.loginButtonRoute} onClick={() => history.push("/login")}>Login</Button>
      </Box>
      <Box component="form" className={classes.form} onSubmit={handleRegister}>
        <Box component="div" className={classes.titleFormContainer}>
          <Typography className={classes.titleForm}>Create an account.</Typography>
        </Box>
        <Box component="div" className={classes.inputContainer}>
        <FormControl margin="normal" required>
                <TextField
                  className={classes.input}
                  aria-label="username"
                  label="Username"
                  name="username"
                  type="text"
                />
        </FormControl>
          <FormControl margin="normal" required>
                <TextField
                  className={classes.input}
                  aria-label="email"
                  label="E-mail address"
                  name="email"
                  type="text"
                />
        </FormControl>
        <FormControl margin="normal" required>
              <TextField
                className={classes.input}
                label="Password"
                aria-label="password"
                fullWidth
                type="password"
                name="password"
              />
            </FormControl>
        </Box>
        <Button color="primary" className={classes.buttonSubmit} type="submit" variant="contained" size="large">
              Login
        </Button>
      </Box>
  </AuthLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
