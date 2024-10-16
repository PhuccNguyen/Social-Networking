import {
    Box,
    Typography,
    InputBase,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    useTheme,
    Divider,
    List,
    ListItem,
    ListItemText,
  } from "@mui/material";
  import { ImageOutlined,EditOutlined } from "@mui/icons-material";
  import Dropzone from "react-dropzone";
  import UserImage from "components/UserImage";
  import Adjustment from "components/Adjustment";
  import WidgetWrapper from "components/WrapperUser";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";

  
  const CreateCampaignWidget = ({ picturePath }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      registrationStartDate: "",
      registrationEndDate: "",
      maxVolunteers: "",
      location: "",
      campaignStartDate: "",
      campaignStartTime: "",
      campaignEndDate: "",
      campaignEndTime: "",
      image: null,
      milestones: [], // Initialize milestones as an empty array
    });
  
    const user = useSelector((state) => state.user); // Get user info from state
    const token = useSelector((state) => state.token);
    const { _id: createdBy, _id, firstName, lastName  } = useSelector((state) => state.user);
    const userRole = user.role;
    const { role } = useSelector((state) => state.user); // Ensure 'role' is here

    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    
  
    const [milestoneName, setMilestoneName] = useState("");
    const [milestonePercentage, setMilestonePercentage] = useState("");
    const [milestoneDescription, setMilestoneDescription] = useState("");
  
    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleFileUpload = (file) => {
      setFormData({ ...formData, image: file });
    };
  
    const addMilestone = () => {
      setFormData({
        ...formData,
        milestones: [
          ...formData.milestones,
          {
            name: milestoneName,
            description: milestoneDescription,
            percentage: milestonePercentage,
            completed: false,
          },
        ],
      });
      setMilestoneName("");
      setMilestonePercentage("");
      setMilestoneDescription("");
    };
  
    const handleSubmit = async () => {
        try {
          const campaignForm = new FormData();
      
          // Append all form data to FormData object
          Object.keys(formData).forEach((key) => {
            if (key === "milestones") {
              campaignForm.append(key, JSON.stringify(formData[key]));
            } else {
              campaignForm.append(key, formData[key]);
            }
          });
      
          // Append the image file if it exists
          if (formData.image) {
            campaignForm.append("image", formData.image);  // Make sure the field name is 'image'
          }
    
          // Append the `createdBy` field, which should be the current user's ID
          campaignForm.append("createdBy", createdBy);  // This is critical
    
          // Send POST request to the API
          const response = await fetch("http://localhost:3001/volunteer/campaigns", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,  // Ensure the token is sent
            },
            body: campaignForm,  // Send the formData object
          });
      
          if (response.ok) {
            const result = await response.json();
            console.log("Campaign created successfully:", result);
            setIsDialogOpen(false);  // Close the dialog on success
          } else {
            const errorResponse = await response.json();
            console.error("Failed to create campaign:", errorResponse);
          }
        } catch (error) {
          console.error("Error creating campaign:", error);
        }
    };
    
           
      
      
  
    return (
      <>
                {/* Hiển thị nút Admin nếu role là admin */}
                {(userRole === "assistantAdmin" || userRole === "admin") && (
   
        <WidgetWrapper boxShadow="0px 6px 13px 3px rgba(0, 0, 0, 0.1)" margin="-0.5rem 0rem 0rem 0rem">
          <Box>
            <Adjustment gap="1.5rem" width="600px" marginBottom="10px">
              <UserImage image={picturePath} />
              <InputBase
                placeholder={`Do you have any new campaigns, ${firstName}?`}
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
          <Divider />
          <Box display="flex" justifyContent="space-between" maxWidth="100%" padding="0 9%">
            <Button
              onClick={() => setIsDialogOpen(true)}
              sx={{
                marginTop: "10px",
                padding: "0.5rem 1rem",
                width: "100%",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                color={dark}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                <ImageOutlined sx={{ marginRight: "0.5rem" }} />
                Create Campaign
              </Typography>
            </Button>
          </Box>
        </WidgetWrapper>
       )}
  
        {/* Dialog for creating a campaign */}
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>Create a New Campaign</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap="1rem">
              <TextField
                name="title"
                label="Campaign Title"
                value={formData.title}
                onChange={handleFormChange}
                fullWidth
                required
              />
              <TextField
                name="description"
                label="Campaign Description"
                value={formData.description}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={3}
                required
              />
              <Box display="flex" gap="1rem">
                <TextField
                  name="registrationStartDate"
                  label="Registration Start Date"
                  type="date"
                  value={formData.registrationStartDate}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
                <TextField
                  name="registrationEndDate"
                  label="Registration End Date"
                  type="date"
                  value={formData.registrationEndDate}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Box>
              <Box display="flex" gap="1rem">
                <TextField
                  name="campaignStartDate"
                  label="Campaign Start Date"
                  type="date"
                  value={formData.campaignStartDate}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
                <TextField
                  name="campaignStartTime"
                  label="Campaign Start Time"
                  type="time"
                  value={formData.campaignStartTime}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Box>
              <Box display="flex" gap="1rem">
                <TextField
                  name="campaignEndDate"
                  label="Campaign End Date"
                  type="date"
                  value={formData.campaignEndDate}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
                <TextField
                  name="campaignEndTime"
                  label="Campaign End Time"
                  type="time"
                  value={formData.campaignEndTime}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Box>
              <TextField
                name="maxVolunteers"
                label="Max Volunteers"
                type="number"
                value={formData.maxVolunteers}
                onChange={handleFormChange}
                fullWidth
                required
              />
              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleFormChange}
                fullWidth
                required
              />
  
              {/* Milestones Section */}
              <Box>
                <Typography variant="h6">Campaign Milestones</Typography>
                <Box display="flex" gap="1rem">
                  <TextField
                    label="Milestone Name"
                    value={milestoneName}
                    onChange={(e) => setMilestoneName(e.target.value)}
                  />
                  <TextField
                    label="Percentage"
                    value={milestonePercentage}
                    onChange={(e) => setMilestonePercentage(e.target.value)}
                    type="number"
                  />
                </Box>
                <TextField
                  label="Milestone Description"
                  value={milestoneDescription}
                  onChange={(e) => setMilestoneDescription(e.target.value)}
                  fullWidth
                />
                <Button onClick={addMilestone}>Add Milestone</Button>
  
                <List>
                  {formData.milestones.map((milestone, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${milestone.name} - ${milestone.percentage}%`}
                        secondary={milestone.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
  
              {/* Upload Image */}
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) => {
                  const file = acceptedFiles[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file)); // Generate preview URL
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
                    {!preview ? (
                      <Typography>Add Image Here</Typography>
                    ) : (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <img
                          src={preview}
                          alt="Preview"
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </Box>
                    )}
                  </Box>
                )}
              </Dropzone>

              </Box>
            </DialogContent>
    
            <DialogActions>
              <Button
                onClick={() => setIsDialogOpen(false)}
                sx={{
                  backgroundColor: "#999",
                  color: "white",
                  "&:hover": { backgroundColor: "#666" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.title || !formData.description}
                sx={{
                  backgroundColor: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
                  },
                }}
              >
                Create Campaign
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
    };
    
    export default CreateCampaignWidget;
    
  