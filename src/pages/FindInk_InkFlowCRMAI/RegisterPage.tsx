import React from "react";
import RegisterForm from "../../components/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;