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
      imageCampaing: null,
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
        
        // Append form data
        Object.keys(formData).forEach((key) => {
          if (key === "milestones") {
            campaignForm.append(key, JSON.stringify(formData[key]));  // Milestones should be stringified
          } else {
            campaignForm.append(key, formData[key]);
          }
        });
    
        // Append image file if it exists
        if (image) {
          campaignForm.append("imageCampaing", image);  // Append image with the correct field name
        }
    
        // Append createdBy field
        campaignForm.append("createdBy", createdBy);
    
        // Send POST request to the API
        const response = await fetch("http://localhost:3001/campaigns", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,  // Include the token in the headers
          },
          body: campaignForm,  // Send formData
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
                    
                    {userRole === "user" && (
        <WidgetWrapper
          boxShadow="0px 6px 13px 3px rgba(0, 0, 0, 0.1)"
          margin="-0.5rem 0rem 0rem 0rem"
        >
          <Box display="flex" alignItems="center" gap="1.5rem" width="100%">
            <UserImage image={picturePath} size="60px" />
            <Box>
              <Typography variant="h6" color={palette.neutral.dark} fontWeight="bold">
                Over 1,000 Volunteer Campaigns Across Vietnam Waiting for You!
              </Typography>
              <Typography variant="body2" color={palette.neutral.medium}>
                Discover opportunities to make an impact in major cities, remote regions, and unique destinations.
                Join hands to create a better community!
              </Typography>
            </Box>
          </Box>

          <Box mt="1rem" display="flex" justifyContent="center" width="100%">
      <Button
        variant="contained"
        color="primary"
        sx={{
          background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
          color: "#fff",
          padding: "0.4rem 2rem",
          fontWeight: "bold",
          borderRadius: "50px",
          boxShadow: "0px 4px 15px rgba(121, 40, 202, 0.4)", // Add shadow for depth
          width: "100%",
          maxWidth: "520px", // Limit width for large screens
          textTransform: "uppercase",
          fontSize: "1rem",
          transition: "all 0.3s ease", // Smooth transition
          "&:hover": {
            background: "linear-gradient(310deg, #FF6AB0 0%, #6B28BA 100%)",
            transform: "translateY(-3px)", // Lift effect
            boxShadow: "0px 6px 20px rgba(121, 40, 202, 0.6)", // Stronger shadow on hover
          },
          "&:active": {
            transform: "translateY(1px)", // Slight push down on click
            boxShadow: "0px 3px 10px rgba(121, 40, 202, 0.3)",
          },
        }}
      >
        Explore Campaigns
      </Button>
    </Box>
        </WidgetWrapper>
      )}
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

          <Box display="flex" justifyContent="center" mt="1rem" width="100%" padding="0 9%">
      <Button
        onClick={() => setIsDialogOpen(true)}
        sx={{
          background: "linear-gradient(310deg, #FF0080 0%, #7928CA 100%)",
          color: "white",
          padding: "0.5rem 2rem",
          fontWeight: "bold",
          borderRadius: "50px",
          boxShadow: "0px 4px 15px rgba(121, 40, 202, 0.4)", // Depth effect
          width: "100%",
          maxWidth: "520px", // Limit max width
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "uppercase",
          fontSize: "1rem",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(310deg, #FF6AB0 0%, #6B28BA 100%)",
            transform: "translateY(-3px)", // Hover lift effect
            boxShadow: "0px 6px 20px rgba(121, 40, 202, 0.6)", // Enhanced shadow on hover
          },
          "&:active": {
            transform: "translateY(1px)", // Click effect
            boxShadow: "0px 3px 10px rgba(121, 40, 202, 0.3)",
          },
        }}
      >
        <ImageOutlined sx={{ marginRight: "0.5rem", fontSize: "1.5rem" }} /> {/* Icon with adjusted size */}
        <Typography variant="button" fontWeight="bold">
          Create Campaign
        </Typography>
      </Button>
    </Box>
        </WidgetWrapper>
       )}
  
  <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: "bold",fontSize:"1.2rem", textAlign: "center",
            color: "white",
            background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
            padding: "0.3rem 2rem",
            marginBottom:"1rem",
            fontWeight: "bold",
            boxShadow: "0px 3px 10px rgba(121, 40, 202, 0.3)",
            "&:hover": {
              background: "linear-gradient(310deg, #FF0080 0%, #6B28BA 100%)",
            },
          }}>
          Create a New Campaign</DialogTitle>
      <DialogContent >
        <Box display="flex" flexDirection="column" gap="0.9rem">    
        <Typography variant="h6" sx={{ fontWeight: "bold"}}>
            Campaign Information
          </Typography>
             {/* Campaign Information */}
           <TextField
            name="title"
            label="Campaign Title"
            value={formData.title}
            onChange={handleFormChange}
            fullWidth
            required
            // sx={{ marginTop: "0.5rem" }}
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
           {/* Dates & Times */}
           <Typography variant="h6" sx={{ fontWeight: "bold"}}>
            Campaign Time
          </Typography>

            
          <Box display="flex" gap="1rem" flexDirection={{ xs: "column", sm: "row" }}>
          <TextField
              name="registrationStartDate"
              label="Registration Start Date"
              type="date"
              value={formData.registrationStartDate}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              name="registrationEndDate"
              label="Registration End Date"
              type="date"
              value={formData.registrationEndDate}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
          <Divider/>
            <TextField
              name="campaignStartDate"
              label="Campaign Start Date"
              type="date"
              value={formData.campaignStartDate}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              name="campaignStartTime"
              label="Campaign Start Time"
              type="time"
              value={formData.campaignStartTime}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              name="campaignEndDate"
              label="Campaign End Date"
              type="date"
              value={formData.campaignEndDate}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              name="campaignEndTime"
              label="Campaign End Time"
              type="time"
              value={formData.campaignEndTime}
              onChange={handleFormChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />


          {/* Additional Fields */}
          <Typography variant="h6" sx={{ fontWeight: "bold"}}>
            Campaign Number
          </Typography>

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
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Campaign Milestones
          </Typography>
          <Box display="flex" gap="1rem" flexDirection={{ xs: "column", sm: "row" }}>
            <TextField
              label="Milestone Name"
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Percentage"
              type="number"
              value={milestonePercentage}
              onChange={(e) => setMilestonePercentage(e.target.value)}
              fullWidth
            />
          </Box>
          <TextField
            label="Milestone Description"
            value={milestoneDescription}
            onChange={(e) => setMilestoneDescription(e.target.value)}
            fullWidth
            multiline
            rows={1}
          />
          <Button onClick={addMilestone}  sx={{
            color: "white",
            background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
            borderRadius: "50px",
            padding: "0.5rem 2rem",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(310deg, #FF0080 0%, #6B28BA 100%)",
            },
          }}>
            Add Milestone
          </Button>
          <List sx={{ maxHeight: 150, overflowY: "auto", marginTop: "0.5rem" }}>
            {formData.milestones.map((milestone, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${milestone.name} - ${milestone.percentage}%`}
                  secondary={milestone.description}
                />
              </ListItem>
            ))}
          </List>

          {/* Upload Image Section */}
          <Divider />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Upload Campaign Image</Typography>
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              setImage(file);
              setPreview(URL.createObjectURL(file)); // Preview the selected image
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                border={`2px dashed black`}
                borderRadius="8px"
                p="0.8rem"
                textAlign="center"
                sx={{ "&:hover": { cursor: "pointer", backgroundColor: palette.neutral.light } }}
              >
                <input {...getInputProps()} />
                {!preview ? (
                  <Typography variant="body1" color="textSecondary">
                    Drag & drop or click to select an image
                  </Typography>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" gap="1rem">
                    <img src={preview} alt="Preview" style={{ maxWidth: "400px", maxHeight: "400px", borderRadius: "8px" }} />
                    {/* <Typography>{preview.name}</Typography> */}
                    <EditOutlined sx={{ color: palette.primary.main }} />
                  </Box>
                )}
              </Box>
            )}
          </Dropzone>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => setIsDialogOpen(false)}
          sx={{
            color: palette.neutral.main,
            backgroundColor: palette.neutral.light,
            borderRadius: "50px",
            padding: "0.5rem 2rem",
            "&:hover": { backgroundColor: palette.neutral.dark },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!formData.title || !formData.description}
          sx={{
            color: "white",
            background: "linear-gradient(310deg, #7928CA 0%, #FF0080 100%)",
            borderRadius: "50px",
            padding: "0.5rem 2rem",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(310deg, #FF0080 0%, #6B28BA 100%)",
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
    
  