import React from "react";
import styled from "styled-components";
import { Phone } from "lucide-react";

const ContactUsButton = () => {
	return (
		<StyledWrapper>
			<button className="learn-more">
		        <span aria-hidden="true" className="circle">
		          <span className="icon">
		            <Phone className="phone-icon" />
		          </span>
		        </span>
				<span className="button-text">Contact Us</span>
			</button>
		</StyledWrapper>
	);
};

const StyledWrapper = styled.div`
  button {
    position: relative;
    display: inline-block;
    cursor: pointer;
    border: 0;
    background: transparent;
    padding: 0;
    font-family: inherit;
	font-size: larger;
  }

  button.learn-more {
    width: 13rem;
  }

  .circle {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    box-shadow: 0 0 5px 1px white;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background: hsl(var(--accent)); // #282936;
    border-radius: 1.625rem;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  }

  .phone-icon {
    width: 1.2rem;
    height: 1.2rem;
  }

  .button-text {
    transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
    position: absolute;
    inset: 0;
    margin-left: 1.85rem;
    color: rgba(255, 255, 255, 1);
    font-weight: 400;
    line-height: 3rem;
    text-align: center;
    text-transform: uppercase;
  }

  button:hover .circle {
    width: 100%;
    box-shadow: 0 0 10px 2px white;
  }

  button:hover .button-text {
    transform: translateX(-1.7rem);
    color: white;
  }

  button:hover .icon {
    transform: translateX(4.5rem);
  }

  button:active .circle {
    transform: scale(0.9);
  }
`;

export default ContactUsButton;
