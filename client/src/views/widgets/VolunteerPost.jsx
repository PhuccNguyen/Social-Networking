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
  import {
    ImageOutlined,
    LocationOnOutlined, 
  } from "@mui/icons-material";
  import Dropzone from "react-dropzone";
  import UserImage from "components/UserImage";
  import Adjustment from "components/Adjustment";
  import WidgetWrapper from "components/WrapperUser";
  import { useState, SVGProps } from "react";
  import { useDispatch, useSelector } from "react-redux";

  
  const CreateCampaignWidget = ({ picturePath }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    });
  
    const token = useSelector((state) => state.token);
    const { _id: createdBy } = useSelector((state) => state.user);

    const { palette } = useTheme();
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    // const main = palette.neutral.main;
    const { _id, firstName, lastName } = useSelector((state) => state.user);
  
  
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
          { name: milestoneName, description: milestoneDescription, percentage: milestonePercentage, completed: false }
        ]
      });
      // Reset milestone input fields
      setMilestoneName("");
      setMilestonePercentage("");
      setMilestoneDescription("");
    };
  
    const handleSubmit = async () => {
      const campaignForm = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "milestones") {
          campaignForm.append(key, JSON.stringify(formData[key]));
        } else {
          campaignForm.append(key, formData[key]);
        }
      });
  
      campaignForm.append("createdBy", createdBy);
  
      try {
        const response = await fetch("http://localhost:3001/campaigns", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: campaignForm,
        });
  
        if (response.ok) {
          // Handle success (e.g., close the dialog, show a success message, etc.)
          setIsDialogOpen(false);
        } else {
          console.error("Failed to create campaign");
        }
      } catch (error) {
        console.error("Error creating campaign:", error);
      }
    };
  
    return (
      <>
       <WidgetWrapper boxShadow= "0px 6px 13px 3px rgba(0, 0, 0, 0.1)" margin="-0.5rem 0rem 0rem 0rem">
        <Box>
          <Adjustment gap="1.5rem" width="600px" marginBottom="10px">
            <UserImage image={picturePath} />
            <InputBase
              placeholder={`Do you have any new campain, ${firstName}?`}
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

  
        {/* Dialog for creating a campaign */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
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
                  name="campaignEndDate"
                  label="Campaign End Date"
                  type="date"
                  value={formData.campaignEndDate}
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
                onDrop={(acceptedFiles) => handleFileUpload(acceptedFiles[0])}
                multiple={false}
                accept=".jpg,.jpeg,.png"
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    border="2px dashed #888"
                    padding="1rem"
                    textAlign="center"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!formData.image ? (
                      <Typography>Upload Campaign Image</Typography>
                    ) : (
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Preview"
                          style={{ maxHeight: "100px", marginRight: "10px" }}
                        />
                        <Typography>{formData.image.name}</Typography>
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
  