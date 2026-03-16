import React from "react";
import "./ServicesCss/Service.css";
import ServicesTemp from "./ServicesTemp";
import {
  FaTruck,
  FaGlobeAsia,
  FaBolt,
  FaShoppingCart,
  FaMoneyBillWave,
  FaWarehouse,
  FaRoute
} from "react-icons/fa";

/* ================= SERVICES DATA ================= */

const servicesData = [
  {
    icon: <FaTruck />,
    title: "Domestic Delivery",
    desc: "Fast and secure nationwide delivery services across Nepal with real-time tracking."
  },
  {
    icon: <FaGlobeAsia />,
    title: "International Shipping",
    desc: "Reliable global logistics solutions with customs handling and international partners."
  },
  {
    icon: <FaBolt />,
    title: "Priority Service",
    desc: "Express and urgent delivery options ensuring same-day or next-day shipping."
  },
  {
    icon: <FaShoppingCart />,
    title: "E-Commerce Solutions",
    desc: "Seamless delivery integration for online stores with warehouse and fulfillment support."
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Topay & COD",
    desc: "Flexible payment collection services including Cash on Delivery (COD) solutions."
  },
  {
    icon: <FaWarehouse />,
    title: "Logistics Management",
    desc: "End-to-end logistics planning, warehousing, and supply chain management."
  },
  {
    icon: <FaRoute />,
    title: "Delivery Agency Services",
    desc: "Complete last-mile delivery and transport management for businesses."
  }
];

/* ================= COMPONENT ================= */

const Services = () => {
  return (
    <>
      {/* HERO SECTION */}
       <section className="about-hero">
        <div className="overlay">
          <h1>Services</h1>
          <p className="subtitle">We provide a wide range of Services</p>
          <p className="description">
            We are the Can People with Can Vision. We chase big problems and solve them.
          </p>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section">
        <div className="services-header">
          <h2>What We Provide</h2>
          <p>
            We provide complete logistics and courier solutions tailored to your business needs.
          </p>
        </div>

        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <span className="service-hover-line"></span>
            </div>
          ))}
        </div>
      </section>
      <ServicesTemp />
      
    </>
  );
};

export default Services;