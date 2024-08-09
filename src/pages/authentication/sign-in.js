import React, { useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";
import axios from "axios";
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import Link from "next/link";
import AuthLayout from "../../../layouts/AuthLayout";
import { useRouter } from "next/router";
import { useAuth } from "../authentication/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [otp, setOTP] = useState("");
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
  }, []);

  const validateForm = () => {
    let errors = {};

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const isFormValid = validateForm();

    if (isFormValid) {
      try {
        const response = await axios.post("http://localhost:8080/admin/login", {
          email,
          password,
        });

        console.log(response);
        if (response.status == 200) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("adminData", JSON.stringify(response.data.admin));
          setIsAuthenticated(true);
          
        } else {
          setError("Unexpected response status: " + response.status);
        }
      } catch (err) {
        console.error("Login failed:", err);

        if (err.response) {
          setError("Email or Password is incorrect. Please try again.");
        } else if (err.request) {
          setError("No response from server. Please try again later.");
        } else {
          setError("Error: " + err.message);
        }
      }
    } else {
      console.log("Form has errors. Please correct them.");
    }
  };

  return (
    <>
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
          <Card className="smooth-shadow-md">
            <Card.Body className="p-6">
              <div className="mb-4">
                <Link href="/" className="d-flex align-items-center">
                  <Image
                    src="/images/brand/logo/logo.png"
                    className="mb-2"
                    alt=""
                    style={{ width: "70px" }}
                  />
                  <h3 className="ms-3 mb-0">Garbhsanskar Guru</h3>
                </Link>
                <p className="mb-6">Please enter your admin information.</p>
              </div>
              <Form method="POST">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Admin Name or email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your Email here"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "6px",
                      }}
                    >
                      {errors.email}
</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your Password here"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "14px",
                        marginBottom: "6px",
                      }}
                    >
                      {errors.password}
                    </p>
                  )}
                </Form.Group>
                {error && (
                  <p className="error-message" style={{ color: "red" }}>
                    {error}
                  </p>
                )}
                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

SignIn.Layout = AuthLayout;

export default SignIn;