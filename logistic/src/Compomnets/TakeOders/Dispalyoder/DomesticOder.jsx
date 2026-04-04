import { useNavigate } from "react-router-dom";
import "../css/orderoption.css";

export default function DomesticOder() {
  const navigate = useNavigate();

  return (
    <div className="dx-container">
      <div className="dx-inner">
        <h1 className="dx-heading">Select Delivery Mode</h1>
        <p className="dx-subtext">Choose delivery type to accept orders</p>

        <div className="dx-options">
          {/* Domestic Orders */}
          <div
            className="dx-box"
            onClick={() => navigate("/orders/domestic")}
            style={{ cursor: "pointer" }}
          >
            <div className="dx-emoji">🚛</div>
            <h2>Domestic Orders</h2>
            <p>Accept domestic delivery orders</p>
          </div>

          {/* International Orders */}
          <div
            className="dx-box"
            onClick={() => navigate("/orders/international")}
            style={{ cursor: "pointer" }}
          >
            <div className="dx-emoji">🌍</div>
            <h2>International Orders</h2>
            <p>Accept international delivery orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
