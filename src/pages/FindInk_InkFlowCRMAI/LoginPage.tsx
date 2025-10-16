import React from "react";
import LoginForm from "../../components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;