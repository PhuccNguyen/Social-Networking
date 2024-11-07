import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  IconButton,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import AdjustContent from "components/Adjustment";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import the icons for show/hide

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  userName: yup.string().required("User Name is required"),
  mobile: yup.string().required("Mobile is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  intro: yup.string(),
  gender: yup.string().required("Gender is required"),
  birthday: yup.date().required("Birthday is required"),
  status: yup.string().required("Status is required"),
  password: yup.string().required("Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup.string().required("Picture is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  userName: "",
  mobile: "",
  email: "",
  intro: "",
  gender: "",
  birthday: null,
  status: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const loginSchema = yup.object().shape({
  identifier: yup.string().required("Email, Mobile, or User Name is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesLogin = {
  identifier: "",
  password: "",
};

const Form = (handleBlur, handleChange, values, touched, errors) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const [pageType, setPageType] = useState("login");
  const [preview, setPreview] = useState(null);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  // Function to toggle the show/hide password
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const [alertSeverity, setAlertSeverity] = useState("success"); // 'success' or 'error'
  const [alertMessage, setAlertMessage] = useState("");

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    try {
      const savedUserResponse = await fetch(
        "http://localhost:3001/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!savedUserResponse.ok) {
        throw new Error(`HTTP error! Status: ${savedUserResponse.status}`);
      }

      const savedUser = await savedUserResponse.json();
      console.log("Saved User:--- ", savedUser); // Log saved user for debugging
      onSubmitProps.resetForm();

      if (savedUser) {
        setAlertSeverity("success");
        setAlertMessage("Registration successful! Redirecting to login...");
        setOpenSnackbar(true);
        setPageType("login"); // Navigate to login page after successful registration
      }
    } catch (error) {
      console.error("Register Error:-->", error);
      setAlertSeverity("error");
      setAlertMessage("Registration failed. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await loggedInResponse.json();

      // Handle errors and display specific messages
      if (!loggedInResponse.ok) {
        if (result.msg) {
          if (result.msg === "User is banned") {
            setAlertMessage(
              "Your account has been banned by the administrator. Please contact support."
            );
          } else if (result.msg === "User does not exist!") {
            setAlertMessage(
              "This user does not exist. Please check your username, email, or mobile."
            );
          } else if (result.msg === "Invalid credentials") {
            setAlertMessage("Incorrect password. Please try again.");
          } else {
            setAlertMessage(
              result.msg || "Unable to log in. Please check your credentials."
            );
          }
        } else {
          setAlertMessage(
            "An error occurred. Please check your credentials and try again."
          );
        }

        setAlertSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // Reset the form on successful login
      onSubmitProps.resetForm();

      // If login is successful, save the token and user data, and navigate to home
      dispatch(
        setLogin({
          user: result.user,
          token: result.token,
        })
      );

      setAlertSeverity("success");
      setAlertMessage("Login successful! Redirecting to home...");
      setOpenSnackbar(true);
      navigate("/home"); // Redirect to home after successful login
    } catch (error) {
      console.error("Login Error:", error);
      setAlertSeverity("error");
      setAlertMessage("An error occurred during login. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{
                    gridColumn: "span 2",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                    "& .MuiInputLabel-root": {
                      color: "gray",
                    },
                    "& .MuiFormHelperText-root": {
                      fontStyle: "italic",
                    },
                  }}
                />

                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{
                    gridColumn: "span 2",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                    "& .MuiInputLabel-root": {
                      color: "gray",
                    },
                    "& .MuiFormHelperText-root": {
                      fontStyle: "italic",
                    },
                  }}
                />

                <TextField
                  label="User Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userName}
                  name="userName"
                  error={Boolean(touched.userName) && Boolean(errors.userName)}
                  helperText={touched.userName && errors.userName}
                  sx={{
                    gridColumn: "span 2",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                    "& .MuiInputLabel-root": {
                      color: "gray",
                    },
                    "& .MuiFormHelperText-root": {
                      fontStyle: "italic",
                    },
                  }}
                />

                <TextField
                  label="Mobile"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.mobile}
                  name="mobile"
                  error={Boolean(touched.mobile) && Boolean(errors.mobile)}
                  helperText={touched.mobile && errors.mobile}
                  sx={{
                    gridColumn: "span 2",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                    "& .MuiInputLabel-root": {
                      color: "gray",
                    },
                    "& .MuiFormHelperText-root": {
                      fontStyle: "italic",
                    },
                  }}
                />
                <TextField
                  label="Intro"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.intro}
                  name="intro"
                  error={Boolean(touched.intro) && Boolean(errors.intro)}
                  helperText={touched.intro && errors.intro}
                  sx={{
                    gridColumn: "span 2",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                />

                <FormControl
                  fullWidth
                  variant="outlined"
                  error={Boolean(touched.gender) && Boolean(errors.gender)}
                  sx={{
                    gridColumn: "span 2",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                    "& .MuiInputLabel-root": {
                      color: "gray",
                      fontSize: "0.9rem",
                    },
                    "& .MuiSelect-root": {
                      "&:hover": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                >
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    name="gender"
                    value={values.gender}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    sx={{
                      "&:focus": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                  {Boolean(touched.gender) && Boolean(errors.gender) && (
                    <Typography
                      color="error"
                      sx={{ mt: 1, fontSize: "0.8rem" }}
                    >
                      {errors.gender}
                    </Typography>
                  )}
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ gridColumn: "span 2" }}
                    label="Birthday"
                    value={values.birthday ? dayjs(values.birthday) : null}
                    onChange={(newValue) => {
                      handleChange({
                        target: {
                          name: "birthday",
                          value: newValue ? newValue.format("YYYY-MM-DD") : "",
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={handleChange}
                        value={values.birthday}
                        onBlur={handleBlur}
                        name="birthday"
                        error={
                          Boolean(touched.birthday) && Boolean(errors.birthday)
                        }
                        helperText={touched.birthday && errors.birthday}
                      />
                    )}
                  />
                </LocalizationProvider>

                <FormControl
                  fullWidth
                  variant="outlined"
                  error={Boolean(touched.status) && Boolean(errors.status)}
                  sx={{ gridColumn: "span 2" }}
                >
                  <InputLabel>Status</InputLabel>

                  <Select
                    label="status"
                    name="status"
                    value={values.status}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="married">Married</MenuItem>
                    <MenuItem value="divorce">Divorce</MenuItem>
                  </Select>

                  {Boolean(touched.status) && Boolean(errors.status) && (
                    <Typography color="error">{errors.status}</Typography>
                  )}
                </FormControl>

                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  name="confirmPassword"
                  error={
                    Boolean(touched.confirmPassword) &&
                    (Boolean(errors.confirmPassword) ||
                      values.password !== values.confirmPassword)
                  }
                  helperText={
                    touched.confirmPassword &&
                    ((values.password !== values.confirmPassword &&
                      "Passwords do not match") ||
                      errors.confirmPassword)
                  }
                  sx={{ gridColumn: "span 2" }}
                />

                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) => {
                      setFieldValue("picture", acceptedFiles[0]);
                      const file = acceptedFiles[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <AdjustContent>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </AdjustContent>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                  {preview && (
                    <Box mt={2} display="flex" justifyContent="center">
                      <img
                        src={preview}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                    </Box>
                  )}
                </Box>
              </>
            )}

            {isLogin && (
              <>
                {/* Email Field */}
                <Box sx={{ gridColumn: "span 4", width: "100%" }}>
                  <Typography variant="body1" fontWeight="600" gutterBottom>
                    Email
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1.5px solid #ecedec",
                      borderRadius: "10px",
                      paddingLeft: "10px",
                      height: "50px",
                    }}
                  >
                    <svg
                      height={20}
                      viewBox="0 0 32 32"
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: "10px" }}
                    >
                      <g id="Layer_3" data-name="Layer 3">
                        <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
                      </g>
                    </svg>
                    <TextField
                      placeholder="Enter your Email, Mobile Or Username"
                      variant="standard"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.identifier}
                      name="identifier"
                      error={
                        Boolean(touched.identifier) &&
                        Boolean(errors.identifier)
                      }
                      helperText={touched.identifier && errors.identifier}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{
                        flex: 1, // Allow TextField to expand to full width within the container
                        "& .MuiInputBase-input": {
                          padding: 0,
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Password Field */}
                <Box sx={{ gridColumn: "span 4", width: "100%" }}>
                  <Typography variant="body1" fontWeight="600" gutterBottom>
                    Password
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1.5px solid #ecedec",
                      borderRadius: "10px",
                      paddingLeft: "10px",
                      height: "50px",
                    }}
                  >
                    <svg
                      height={20}
                      viewBox="-64 0 512 512"
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: "10px" }}
                    >
                      <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
                      <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
                    </svg>
                    <TextField
                      placeholder="Enter your Password"
                      variant="standard"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      type={showPassword ? "text" : "password"} // Toggle between text and password type
                      name="password"
                      error={
                        Boolean(touched.password) && Boolean(errors.password)
                      }
                      helperText={touched.password && errors.password}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{
                        flex: 1, // Allow TextField to expand to full width within the container
                        "& .MuiInputBase-input": {
                          padding: 0,
                        },
                      }}
                    />

                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ padding: 3 }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ gridColumn: "span 4", mt: 1, width: "100%", px: 2 }} // Add padding for spacing
                >
                  <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
                    {" "}
                    {/* Add margin-right for space between items */}
                    <input type="checkbox" id="remember" name="remember" />
                    <label htmlFor="remember" style={{ marginLeft: "8px" }}>
                      Remember me
                    </label>
                  </Box>

                  <Typography
                    sx={{
                      color: "#2d79f3",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", // Set gradient background
                color: "#FFFFFF", // Ensure text is visible over gradient
                "&:hover": {
                  background:
                    "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)", // Reverse gradient on hover
                  color: "#FFFFFF", // Keep text color consistent
                },
                borderRadius: "8px", // Optional: add slight rounding for a modern look
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>

            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                fontWeight: 500,
                letterSpacing: "0.5px",
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent",
                display: "inline-block",
                transition: "transform 0.2s ease", 
                "&:hover": {
                  cursor: "pointer",
                  textDecoration: "underline",
                  transform: "scale(1.02)", 
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={alertSeverity}
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </form>
      )}
    </Formik>
  );
};

export default Form;
