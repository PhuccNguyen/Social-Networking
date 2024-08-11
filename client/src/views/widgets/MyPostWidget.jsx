import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import Adjustment from "components/adjustment";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/wrapperuser";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [post, setPost] = useState("");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState(""); // State for custom location
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const { palette } = useTheme();
  const { _id, firstName, lastName } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const availableLocations = [
    "33B, Phùng Khắc Khoan, Phường Ða Kao, Quận 1, Sài Gòn – TP HCM",
    "223 Lý Tự Trọng, Phường Bình Thạnh, Quận 1, Sài Gòn – TP HCM",
    "201 Nguyễn Thị Minh Khai, Quận 1, Sài Gòn – TP HCM",
    "40/ 34 Calmette, Phường NTB, Quận 1, Sài Gòn – TP HCM",
    "27A/ 1 Nguyễn Văn Nguyễn, Phường TĐ, Quận 1, Sài Gòn – TP HCM"
  ];

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    formData.append("destination", location || customLocation || ""); // Allow empty destination
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      const posts = await response.json();
      dispatch(setPosts({ posts }));
      resetPostForm();
    } else {
      console.error("Failed to post");
    }
  };

  const resetPostForm = () => {
    setImage(null);
    setPreview(null);
    setPost("");
    setLocation("");
    setCustomLocation(""); // Clear custom location
    setSearchTerm(""); // Clear search term
    setIsDialogOpen(false);
    setIsLocationDialogOpen(false);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setCustomLocation(""); // Clear custom location if a predefined location is selected
    setIsLocationDialogOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLocations = availableLocations.filter((loc) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>

<WidgetWrapper margin="-0.5rem 0rem 0rem 0rem">
  <Box borderBottom="1px solid grey">
    <Adjustment gap="1.5rem" width="600px" marginBottom="10px">
      <UserImage image={picturePath} />
      <InputBase
        placeholder={`What's on your mind, ${firstName}?`}
        onClick={() => setIsDialogOpen(true)}
        sx={{
          width: "100%",
          backgroundColor: palette.neutral.light,
          borderRadius: "2rem",
          padding: "0.5rem 2rem",
        }}
      />
    </Adjustment>
  </Box>

  <Box display="flex" justifyContent="space-between" maxWidth="100%" padding="0 9%">
    <Button
        onClick={() => setIsDialogOpen(true)}
        sx={{
        marginTop: "10px",
        padding: "0.5rem 1rem",
        width: "45%",
        color: "white",
        background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", 
        "&:hover": {
          background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ImageOutlined sx={{ marginRight: "0.5rem" }} /> Add Image
    </Button>

    <Button
        onClick={() => setIsDialogOpen(true)}
        sx={{
        marginTop: "10px",
        padding: "0.5rem 1rem",
        background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", 
        width: "45%",
        color: "white",
        backgroundColor: palette.primary.main,
        "&:hover": {
          background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LocationOnOutlined sx={{ marginRight: "0.5rem" }} /> Check In
    </Button>
  </Box>
</WidgetWrapper>



      <Dialog
        open={isDialogOpen}
        onClose={resetPostForm}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            borderBottom: "1px solid #999999",
          }}
        >
          Create Post
        </DialogTitle>
        <DialogContent sx={{ padding: "0.7rem" }}>
          <Box display="flex" alignItems="center" mb="0.5rem" mt="0.5rem">
            <UserImage image={picturePath} />
            <Typography variant="h6" ml="1rem">
              {firstName} {lastName} {location || customLocation ? `Volunteer In:  ${location || customLocation}`
              : ``}
            </Typography>
          </Box>
          <InputBase
            placeholder={`What's on your mind, ${firstName}?`}
            onChange={(e) => setPost(e.target.value)}
            value={post}
            multiline
            rows={3}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "0.5rem",
              padding: "1rem",
              fontSize: "22px",
              marginBottom: "1rem",
              border: `1px solid ${palette.neutral.main}`,
            }}
          />
          <Box display="flex" alignItems="center" justifyContent="start" >
            <Box marginRight= "1rem"      > Add Your Post: </Box>
          <Button
          onClick={() => setIsLocationDialogOpen(true)}
          sx={{
          display: "flex",
          alignItems: "center",
          color: "white", 
          background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", 
          borderRadius: "2rem", 
          padding: "0.5rem 0.5rem",
          marginRight: "1rem",
          "&:hover": {
            background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
          },
        }}
       >
         <LocationOnOutlined sx={{ marginRight: "0.5rem" }} /> Check In
       </Button>

            <Button
              onClick={() => setImage(!image)}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "white", 
                background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)", 
                borderRadius: "2rem", 
                padding: "0.5rem 0.5rem",
                "&:hover": {
                  background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
                },
              }}
            >
              <ImageOutlined sx={{ marginRight: "0.5rem" }} /> Add Image
            </Button>
          </Box>

          {image && (
            <Box
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="0.5rem"
              mt="1rem"
              p="0.8rem"
              textAlign="center"
            >
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) => {
                  setImage(acceptedFiles[0]);
                  setPreview(URL.createObjectURL(acceptedFiles[0]));
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <Adjustment>
                    <Box
                      {...getRootProps()}
                      border={`1px dashed ${palette.primary.main}`}
                      p="0.5rem"
                      width="91%"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} />
                      {!image ? (
                        <p>Drag & drop an image here, or click to select one</p>
                      ) : (
                        <Adjustment>
                          <Typography>{image.name}</Typography>
                          <EditOutlined />
                        </Adjustment>
                      )}
                    </Box>
                    {image && (
                      <IconButton
                        onClick={() => {
                          setImage(null);
                          setPreview(null);
                        }}
                        sx={{ width: "9%" }}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    )}
                  </Adjustment>
                )}
              </Dropzone>
              {preview && (
                <Box mt="1rem">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: "250px", borderRadius: "0.5rem" }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ padding: "1.5rem", justifyContent: "space-between" }}
        >
          <Button
            onClick={resetPostForm}
            sx={{ color: palette.neutral.dark }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePost}
            disabled={!post} // Removed location validation
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              padding: "0.5rem 1.5rem",
              "&:hover": {
                backgroundColor: palette.primary.dark,
              },
            }}
          >
            POST
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isLocationDialogOpen}
        onClose={() => setIsLocationDialogOpen(false)}
        maxWidth="xs"
        maxHeight="10000px"
        fullWidth
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            borderBottom: "1px solid #999999",
          }}
        >
          Select or Enter Location
        </DialogTitle>
        <DialogContent>
          <Box mb="1rem">
            <Typography variant="h6">Choose from available locations or enter your own:</Typography>
            <TextField
              placeholder="Search or enter custom location"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              margin="dense"
              sx={{ marginTop: "1rem" }}
            />
          </Box>
          <List>
            {filteredLocations.map((loc) => (
              <ListItem button key={loc} onClick={() => handleLocationSelect(loc)}>
                <ListItemText primary={loc} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLocation(customLocation);
              setCustomLocation(""); // Clear custom location after selection
              setSearchTerm(""); // Clear search term
              setIsLocationDialogOpen(false);
            }}
            disabled={!customLocation && !filteredLocations.length} // Ensure user enters or selects location
            sx={{ color: palette.primary.main }}
          >
            Confirm
          </Button>
          <Button onClick={() => setIsLocationDialogOpen(false)} sx={{ color: palette.neutral.dark }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyPostWidget;
