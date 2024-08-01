import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";

const OTPVerification = () => {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedOTP = localStorage.getItem("otp");
      const email = localStorage.getItem("email");

      if (otp === storedOTP) {
        // Perform login success actions (set isAuthenticated, redirect to dashboard, etc.)
        console.log("OTP verified successfully!");

        // Example: Set isAuthenticated state using context
        // This should be implemented in your AuthContext
        // setIsAuthenticated(true);

        // Redirect to dashboard or any protected route
        router.push("/dashboard");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Error verifying OTP. Please try again.");
    }
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <h3 className="mb-0">OTP Verification</h3>
              <p className="mb-6">Please enter the OTP sent to your email.</p>
            </div>
            <Form method="POST" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="otp">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  name="otp"
                  placeholder="Enter OTP here"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                />
              </Form.Group>
              {error && (
                <p className="error-message" style={{ color: "red" }}>
                  {error}
                </p>
              )}
              <div className="d-grid">
                <Button variant="primary" type="submit">
                  Verify OTP
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OTPVerification;
