import React from "react";
import styled from "styled-components";
import { useTheme } from "@mui/material";
import { BookmarkBorderOutlined, BookmarkOutlined } from "@mui/icons-material";


const SaveButton = ({ isSaved, handleSaveToggle, postId }) => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  return (
    <StyledWrapper>
      <>
        <input
          type="checkbox"
          checked={isSaved}
          id={`save-${postId}`} 
          name={`save-checkbox-${postId}`}
          onChange={handleSaveToggle}
        />
        <label htmlFor={`save-${postId}`} className="container">
          {isSaved ? (
            <BookmarkOutlined className="icon" />
          ) : (
            <BookmarkBorderOutlined className="icon" />
          )}
          <div className="action">
            <span className="option-1">Save to Favorites</span>
            <span className="option-2">Saved to Favorites</span>
          </div>
        </label>
      </>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 15px 10px 10px;
    cursor: pointer;
    user-select: none;
  }

  input {
    display: none;
  }

  .icon {
    font-size: 24px;
    transition: fill 0.5s ease;
  }

  input:checked + label .icon {
    fill: hsl(0deg 100% 50%);
    stroke: hsl(0deg 100% 50%);
    animation: bookmarkButton 1s;
  }

  @keyframes bookmarkButton {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.3);
    }
    50% {
      transform: scale(1);
    }
    75% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  input + label .action {
    position: relative;
    overflow: hidden;
    display: grid;
  }

  input + label .action span {
    grid-column-start: 1;
    grid-column-end: 1;
    grid-row-start: 1;
    grid-row-end: 1;
    transition: all 0.5s;
  }

  input + label .action span.option-1 {
    transform: translate(0px, 0%);
    opacity: 1;
  }

  input:checked + label .action span.option-1 {
    transform: translate(0px, -100%);
    opacity: 0;
  }

  input + label .action span.option-2 {
    transform: translate(0px, 100%);
    opacity: 0;
  }

  input:checked + label .action span.option-2 {
    transform: translate(0px, 0%);
    opacity: 1;
  }
`;

export default SaveButton;
