import React from "react";
import "./Loader.css"; // Import CSS for styling

const Loader: React.FC = () => {
  return (
    <div
      className="d-flex w-100 justify-content-center  align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
