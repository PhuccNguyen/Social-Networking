// src/components/HeroSection.js
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const styles = {
    heroSection: {
      position: "relative",
      height: "100vh",
      background: "linear-gradient(310deg, #7928CA, #FF0080)",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "2rem",
      overflow: "hidden",
      animation: "fadeIn 1.2s ease-in-out",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: 1,
    },
    heroContent: {
      position: "relative",
      zIndex: 2,
      maxWidth: "800px",
      animation: "slideUp 1.5s ease-in-out",
    },
    title: {
      fontSize: "3.5rem",
      fontWeight: "bold",
      lineHeight: "1.2",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      animation: "slideUp 1.5s ease-in-out",
    },
    subtitle: {
      fontSize: "1.8rem",
      fontWeight: "300",
      marginBottom: "1.5rem",
      opacity: 0.85,
    },
    description: {
      fontSize: "1.1rem",
      lineHeight: "1.6",
      marginTop: "1rem",
      maxWidth: "600px",
      margin: "0 auto 2rem",
      opacity: 0.9,
    },
    heroButtons: {
      display: "flex",
      justifyContent: "center",
      marginTop: "2rem",
    },
    btnPrimary: {
      padding: "0.75rem 3rem",
      borderRadius: "30px",
      background: "linear-gradient(90deg, #7928CA, #FF0080)",
      color: "#FFFFFF",
      fontWeight: "600",
      textDecoration: "none",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "0.5rem",
      cursor: "pointer",
      animation: "fadeIn 1.2s ease-in-out",
    },
    btnPrimaryHover: {
      transform: "scale(1.05)",
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
    },
    gradientIcon: {
      fontSize: "1.8rem",
      background: "linear-gradient(90deg, #7928CA, #FF0080)", // Gradient background
      WebkitBackgroundClip: "text", // Clips the background to the text
      WebkitTextFillColor: "transparent", // Makes the text itself transparent
    },
    "@keyframes fadeIn": {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    "@keyframes slideUp": {
      from: { opacity: 0, transform: "translateY(20px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  };

  return (
    <section style={styles.heroSection} id="home">
      <div style={styles.overlay}></div>
      <div style={styles.heroContent}>
        <h1 style={styles.title}>
          <AiOutlineHeart style={{ fontSize: "1.5rem", color: "#FF0080" }} />
          Join Hands, Make a Difference
        </h1>
        <p style={styles.subtitle}>Empower Communities, Inspire Change</p>
        <p style={styles.description}>
          From organizing local clean-ups to managing impactful events,{" "}
          <strong>EX</strong> provides a platform for volunteers and organizers
          to connect, collaborate, and drive positive change. Join us to create
          a meaningful impact.
        </p>

        <div style={styles.heroButtons}>
          <a
            onClick={() => navigate("/LoginPage")}
            href="#get-started"
            style={styles.btnPrimary}
            onMouseEnter={(e) => {
              e.target.style.transform = styles.btnPrimaryHover.transform;
              e.target.style.boxShadow = styles.btnPrimaryHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.2)";
            }}
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
