import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirecter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const initialiser = () => {
      navigate("/login");
    };

    initialiser();
  }, []);
  return <div>Redirecter</div>;
};

export default Redirecter;
