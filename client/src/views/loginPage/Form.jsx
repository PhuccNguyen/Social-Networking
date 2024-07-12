import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {  LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  userName: yup.string().required("User Name is required").required("User Name  is required"),
  mobile: yup.string().required("Mobile is required").required("Mobile is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  intro: yup.string(),
  gender: yup.string().required("Gender is required"),
  birthday: yup.date().required("Birthday is required"),
  status: yup.string().required("Status is required"),
  password: yup.string().required("Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup.string().required("Picture is required"),
});

const loginSchema = yup.object().shape({
  userName: yup.string().required("User Name is required").required("User Name  is required"),
  mobile: yup.string().required("Mobile is required").required("Mobile is required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
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

const initialValuesLogin = {
  email: "",
  username: "",
  mobile: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [preview, setPreview] = useState(null);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
        // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };

  // const handlePlaceSelect = (autocomplete, setFieldValue) => {
  //   const place = autocomplete.getPlace();
  //   if (place.formatted_address) {
  //     setAddress(place.formatted_address);
  //     setFieldValue("address", place.formatted_address);
  //   }
  // };

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
        values, errors, touched,
        handleBlur,  handleChange,  handleSubmit,  setFieldValue, resetForm,
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
                  error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  label="User Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userName}
                  name="userName"
                  error={Boolean(touched.userName) && Boolean(errors.userName)}
                  helperText={touched.userName && errors.userName}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  label="Mobile"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.mobile}
                  name="mobile"
                  error={Boolean(touched.mobile) && Boolean(errors.mobile)}
                  helperText={touched.mobile && errors.mobile}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  label="Intro"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.intro}
                  name="intro"
                  error={Boolean(touched.intro) && Boolean(errors.intro)}
                  helperText={touched.intro && errors.intro}
                  sx={{ gridColumn: "span 2" }}
                />
                

                <FormControl fullWidth variant="outlined" error={Boolean(touched.gender) && Boolean(errors.gender)}
                  sx={{ gridColumn: "span 2" }}>
                  <InputLabel>Gender</InputLabel>
                  <Select label="Gender"  name="gender"  value={values.gender} onBlur={handleBlur}
                    onChange={handleChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                  {Boolean(touched.gender) && Boolean(errors.gender) && (
                    <Typography color="error">{errors.gender}</Typography>
                  )}
                </FormControl>
                
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                   <DatePicker
                     sx={{ gridColumn: "span 2" }}
                     // Set the label of the date picker, displayed as a placeholder
                     label="Birthday"
                     // If values.birthday exists, convert it to a dayjs object, otherwise set to null
                     value={values.birthday ? dayjs(values.birthday) : null}
                     // Define the callback function triggered when the date changes
                     onChange={(newValue) => {
                       // Call handleChange function to update the form state
                       handleChange({
                         target: {
                           name: 'birthday',
                           value: newValue ? newValue.format('YYYY-MM-DD') : '',
                         },
                       });
                     }}
                     // Define the function to render the input field
                     renderInput={(params) => (
                       // Render the TextField component as the input field for the date picker
                       <TextField
                         // Spread the params onto the TextField component
                         {...params}
                         // Set the onBlur event handler to handleBlur, triggered when the input loses focus
                         onChange={handleChange}
                         value={values.birthday}
                         onBlur={handleBlur}
                         name="birthday"
                         error={Boolean(touched.birthday) && Boolean(errors.birthday)}
                         helperText={touched.birthday && errors.birthday}
                       />
                    )}
                   />
                </LocalizationProvider>
                
                <FormControl fullWidth variant="outlined" error={Boolean(touched.status) && Boolean(errors.status)}
                  sx={{ gridColumn: "span 2" }}>
                  <InputLabel>Status</InputLabel>
                  <Select label="status"  name="status"  value={values.status} onBlur={handleBlur}
                    onChange={handleChange}
                  >
                    <MenuItem value="male">Sigle</MenuItem>
                    <MenuItem value="male">Married</MenuItem>
                    <MenuItem value="female">Divorce</MenuItem>
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
                  error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 2" }}
                />

               <Box gridColumn="span 2"  border={`1px solid ${palette.neutral.medium}`} borderRadius="5px" p="1rem" >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"                
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                  setFieldValue("picture", acceptedFiles[0]);
                  // Set the preview URL for the selected image
                  setPreview(URL.createObjectURL(acceptedFiles[0]));
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}                
                       border={`2px dashed ${palette.primary.main}`}  p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                        <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                        {/* Conditionally render the preview image */}
                        {preview && (
                       <Box mt="1rem">
                         <img
                           src={preview}
                           alt="Selected"
                           style={{ maxWidth: '100%', borderRadius: '5px' }}
                         />
                       </Box>
                                 )}
                               </Box>
                             )}
                           </Dropzone>
                         </Box>
                       </>
                     )}

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
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
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
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
