import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, useTheme } from "@mui/system";



const ManageCampaign = ({
  campaignId,
  title,
  description,
  location,
  campaignStartDate,
  campaignStartTime,
  campaignEndDate,
  campaignEndTime,
  registrationStartDate,
  registrationEndDate,
  maxVolunteers,
  imageCampaing,
  handleDelete,
  handleEdit,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editableFields, setEditableFields] = useState({
    title,
    description,
    location,
  });

  const openDeleteDialog = () =>  {
     console.log("Deleting campaign with ID:", campaignId); 
  setDeleteDialogOpen(true); 
  };

  const saveEditChanges = () => {
    console.log("Editing campaign with ID:", campaignId); // Log campaignId
    handleEdit(campaignId, editableFields);
    closeEditDialog();
  };

  const closeDeleteDialog = () => setDeleteDialogOpen(false);
  const openEditDialog = () => setEditDialogOpen(true);
  const closeEditDialog = () => setEditDialogOpen(false);



  // Custom styled components for a more modern look
const StyledCard = styled(Card)(({ theme }) => ({
  width: "95%",
  margin: "1rem auto",
  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)", // Slightly deeper shadow
  borderRadius: "8px", // Rounded corners for a modern look
  backgroundColor: theme.palette.background.paper, // Use theme background color
  padding: "0.7rem", // Tighter padding for a compact design
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)", // Subtle lift effect
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
  },
}));  

  return (
    <>
      <StyledCard>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="1rem">
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Box>
          <IconButton onClick={() => openEditDialog()}>
           <EditIcon color="primary" />
          </IconButton>

          <IconButton onClick={() => openDeleteDialog()}>
            <DeleteIcon color="error" />
          </IconButton>
          </Box>
        </Box>

        {imageCampaing && (
          <CardMedia
            component="img"
            height="220"
            image={`http://localhost:3001/assets/${imageCampaing}`}
            alt={title}
            sx={{ borderRadius: "8px", objectFit: "cover", marginBottom: "0.8rem" }}
          />
        )}

        <CardContent>
          <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}>
            {description}
          </Typography>

          <Divider sx={{ marginBottom: "0.5rem" }} />

          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Campaign Details
              </Typography>
              <Typography variant="body2">
                <strong>Location:</strong> {location}
              </Typography>
              <Typography variant="body2">
                <strong>Start:</strong> {new Date(campaignStartDate).toLocaleDateString()} at {campaignStartTime}
              </Typography>
              <Typography variant="body2">
                <strong>End:</strong> {new Date(campaignEndDate).toLocaleDateString()} at {campaignEndTime}
              </Typography>
              <Typography variant="body2">
                <strong>Max Volunteers:</strong> {maxVolunteers}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">Registration</Typography>
              <Typography variant="body2"><strong>Start:</strong> {registrationStartDate ? new Date(registrationStartDate).toLocaleDateString() : "N/A"}</Typography>
              <Typography variant="body2"><strong>End:</strong> {registrationEndDate ? new Date(registrationEndDate).toLocaleDateString() : "N/A"}</Typography>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the campaign <strong>{title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={() => { handleDelete(campaignId); closeDeleteDialog(); }} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Campaign</DialogTitle>
        <DialogContent>
          <TextField label="Campaign Title" 
          defaultValue={editableFields.title} 
          fullWidth variant="outlined" 
          sx={{ marginTop: "0.5rem" }}            
          onChange={(e) => setEditableFields({...editableFields, 
          title: e.target.value })}/>
<TextField
  label="Description"
  defaultValue={editableFields.description}
  fullWidth
  variant="outlined"
  multiline
  rows={4}
  onChange={(e) => setEditableFields({ ...editableFields, description: e.target.value })}
  sx={{ marginTop: "1rem" }}
/>
<TextField
  label="Location"
  defaultValue={editableFields.location}
  fullWidth
  variant="outlined"
  onChange={(e) => setEditableFields({ ...editableFields, location: e.target.value })}
  sx={{ marginTop: "1rem" }}
/>
<TextField
  label="Max Volunteers"
  type="number"
  defaultValue={editableFields.maxVolunteers}
  fullWidth
  variant="outlined"
  onChange={(e) => setEditableFields({ ...editableFields, maxVolunteers: e.target.value })}
  sx={{ marginTop: "1rem" }}
/>
{/* Add any other fields for editing as needed */}
</DialogContent>
<DialogActions>

<Button onClick={closeEditDialog} color="primary">
  Cancel
</Button>
<Button onClick={saveEditChanges} color="primary">
  Save Changes
</Button>

</DialogActions>
</Dialog>
</>
);};
export default ManageCampaign;

