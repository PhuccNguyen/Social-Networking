import React from "react";
import styled from "styled-components";

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card" >
        <div className="card_title__container">

          <span className="card_title">Admin Role</span>
          <span className="check_icon">
            <svg
              className="check_svg"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                fillRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    --white: hsl(0, 0%, 100%);
    --black: hsl(240, 15%, 9%);
    --paragraph: hsl(0, 0%, 83%);
    --line: hsl(240, 9%, 17%);
    --primary: hsl(189, 92%, 58%);

    position: absolute;
    display: flex;
    padding: 0.17rem;
    margin: -35px 30px 300px -30px ;
    width: 4.6rem;
    background-color: hsla(240, 15%, 9%, 1);
    background-image: radial-gradient(
        at 88% 40%,
        hsla(240, 15%, 9%, 1) 0px,
        transparent 85%
      ),
      radial-gradient(at 49% 30%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
      radial-gradient(at 14% 26%, hsla(240, 15%, 9%, 1) 0px, transparent 85%),
      radial-gradient(at 0% 64%, hsl(189, 99%, 26%) 0px, transparent 85%),
      radial-gradient(at 41% 94%, hsl(189, 97%, 36%) 0px, transparent 85%),
      radial-gradient(at 100% 99%, hsl(188, 94%, 13%) 0px, transparent 85%);
    border-radius: 4px;
    box-shadow: 0px -16px 24px 0px rgba(255, 255, 255, 0.25) inset;
  }

  .card_title__container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.3rem; /* Adds space between the check icon and text */
  }

  .check_icon {
    width: 0.7rem;
    height: 0.7rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }

  .check_svg {
    width: 0.7rem;
    height: 0.7rem;
    fill: var(--white);
  }

  .card_title {
    font-size: 0.6rem;
    color: var(--white);
  }
`;

export default Card;
