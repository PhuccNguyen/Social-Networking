import React from "react";
import styled from "styled-components";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";

const LikeButton = ({ isLiked, handleLikeToggle }) => {
  return (
    <StyledWrapper>
      <div className="heart-container" title="Like">
        <input
          type="checkbox"
          className="checkbox"
          id="Give-It-An-Id"
          checked={isLiked}
          onChange={handleLikeToggle} // This ensures the heart fills when clicked
        />
        <div className="svg-container">
          {/* Outline of the heart */}
          <FavoriteBorderOutlined className="svg-outline" />

          {/* Filled heart */}
          <FavoriteOutlined className="svg-filled" />

          {/* Celebrate effect */}
          <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="10,10 20,20" />
            <polygon points="10,50 20,50" />
            <polygon points="20,80 30,70" />
            <polygon points="90,10 80,20" />
            <polygon points="90,50 80,50" />
            <polygon points="80,80 70,70" />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .heart-container {
    --heart-color: rgb(255, 91, 137);
    position: relative;
    width: 50px;
    height: 50px;
    transition: 0.3s;
  }

  .heart-container .checkbox {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 20;
    cursor: pointer;
  }

  .heart-container .svg-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .heart-container .svg-outline {
    fill: transparent;
    stroke: var(--heart-color);
    position: absolute;
  }

  .heart-container .svg-filled {
    fill: var(--heart-color);
    position: absolute;
    animation: keyframes-svg-filled 1s ease-out;
    display: none;
  }

  .heart-container .svg-celebrate {
    position: absolute;
    animation: keyframes-svg-celebrate 0.7s ease-out;
    animation-fill-mode: forwards;
    display: none;
    stroke: var(--heart-color);
    fill: var(--heart-color);
    stroke-width: 2px;
  }

  .heart-container .checkbox:checked ~ .svg-container .svg-filled {
    display: block;
  }

  .heart-container .checkbox:checked ~ .svg-container .svg-celebrate {
    display: block;
  }

  @keyframes keyframes-svg-filled {
    0% {
      transform: scale(0);
    }
    25% {
      transform: scale(1.2);
    }
    50% {
      transform: scale(1);
      filter: brightness(1.5);
    }
  }

  @keyframes keyframes-svg-celebrate {
    0% {
      transform: scale(0);
    }
    50% {
      opacity: 1;
      filter: brightness(1.5);
    }
    100% {
      transform: scale(1.4);
      opacity: 0;
      display: none;
    }
  }
`;

export default LikeButton;
