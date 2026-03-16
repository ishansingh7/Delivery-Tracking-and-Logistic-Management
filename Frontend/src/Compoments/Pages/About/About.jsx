import React from "react";
import "../PagesCss/About.css";
import ProcessD6 from "./D-6Process";
import WhyChooseUs from "./Whytochoose";

const About = () => {
  return (
    <div className="about-container">
      
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="overlay">
          <h1>About Us</h1>
          <p className="subtitle">You are in the company of MoveEasy people</p>
          <p className="description">
            We are the Can People with Can Vision. We chase big problems and solve them.
          </p>
        </div>
      </section>

      {/* INFO CARDS */}
      <section className="about-cards">
        <div className="card">
          <div className="card-line"></div>
          <h2>Who Are We</h2>
          <p>
            We focus on the major problems in trade, commerce and logistics and solve them 
            using Modern and AI management, and technology.We think business in terms of systems. 
            The better the system is the better the business is. Our systems offer you a complete
             solution with predicable outcomes in record times. Give us your problems. We use our systems i.e. the
             power of tech and good management to plan a predictable and consistent solution every time.
          </p>
        </div>

        <div className="card">
          <div className="card-line"></div>
          <h2>Our Mission</h2>
          <p>
           Everyday, more than 1500+ staff driven with MoveEasy culture are out there at your service.
            We believe prosperity comes from logistic, trade and Move to Mobile Application
             , create 1,000 new jobs and facilitate trade and commerce by connecting 90% people 
           through our massive network. We dream big for the good of country and we have a clear plan.
          </p>
        </div>

        <div className="card">
          <div className="card-line"></div>
          <h2>What We Do</h2>
          <ul>
            <li>Cargo which includes import and export.</li>
            <li>Courier & delivery - we can deliver to most locations in Nepal.</li>
            <li>Logistics & warehousing - we can receive, manage and fulfill.</li>
            <li>Transport - we can provide you fleet management & transport solutions.</li>
            <li>Technology - advanced eCommerce banking and logistic tech</li>
            <li>Projects - we deliver aid and help meet your project logistics needs</li>
          </ul>
        </div>
      </section>

      {/* 6-D PROCESS SECTION */}
      <ProcessD6 />
        {/* WHY CHOOSE US SECTION */}
        <WhyChooseUs />

    </div>
  );
};

export default About;