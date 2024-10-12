import React from "react";
import styled from "styled-components";
import { BookmarkBorderOutlined, BookmarkOutlined } from "@mui/icons-material";

const SaveButton = ({ isSaved, handleSaveToggle }) => {
  return (
    <StyledWrapper>
      <div className="save-container" title="Save">
        <input
          type="checkbox"
          className="checkbox"
          id="save-checkbox"
          checked={isSaved}
          onChange={handleSaveToggle}
        />
        <div className="svg-container">
          <BookmarkBorderOutlined className="svg-outline" />
          <BookmarkOutlined className="svg-filled" />
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .save-container {
    position: relative;
    width: 50px;
    height: 50px;
    transition: .3s;
  }

  .checkbox {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 20;
    cursor: pointer;
  }

  .svg-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .svg-outline,
  .svg-filled {
    fill: var(--bookmark-color, black);
    position: absolute;
  }

  .svg-filled {
    display: none;
  }

  .checkbox:checked ~ .svg-container .svg-filled {
    display: block;
  }
`;

export default SaveButton;
