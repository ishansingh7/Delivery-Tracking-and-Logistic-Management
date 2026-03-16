import React from "react";
import "../PagesCss/Process.css";

const processData = [
  {
    number: "01",
    title: "Discover",
    text: "Business is all about solving problems. We start with discovering the logistics problems and pain-points."
  },
  {
    number: "02",
    title: "Define",
    text: "We define what would be the optimal solution to the problems that want solutions for."
  },
  {
    number: "03",
    title: "Design",
    text: "We carefully design the systems that would achieve the defined solution to the problems."
  },
  {
    number: "04",
    title: "Develop",
    text: "We develop the designed systems. We use latest technology to develop the systems and solutions."
  },
  {
    number: "05",
    title: "Deploy",
    text: "We deploy the developed solution. We test, improve, deploy and repeat until the defined standards are achieved."
  },
  {
    number: "06",
    title: "Deliver",
    text: "We deliver solution to the client and continue the 6-D process on a periodic ongoing basis."
  }
];

const Process = () => {
  return (
    <section className="process-section">
      <h2 className="process-title">Our 6-D Process</h2>

      <div className="process-grid">
        {processData.map((item, index) => (
          <div className="process-card" key={index}>
            <span className="process-number">{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Process;