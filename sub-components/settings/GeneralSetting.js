// import node module libraries
import { Col, Row, Form, Card, Button, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

const GeneralSetting = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate the form inputs
    if (newPassword !== confirmPassword) {
        setErrorMessage("Passwords do not match!");
        return;
    }

    if (currentPassword === newPassword) {
        setErrorMessage("New password must be different from current password!");
        return;
    }

    try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            setErrorMessage("User is not authenticated. Please log in.");
            return;
        }

        // Make the API call to change the password
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/change_password`,
            {
                currentPassword: currentPassword,
                newPassword: newPassword,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Check the response status
        if (response.status === 200) {
            setSuccessMessage("Password changed successfully!");
            setErrorMessage("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setErrorMessage("Failed to change password. Please try again.");
            setSuccessMessage("");
        }
    } catch (error) {
        console.error("Error changing password:", error);

        // Check for specific error message
        if (error.response && error.response.data && error.response.data.message === "Current password is incorrect!") {
            setErrorMessage("Incorrect current password. Please try again.");
        } else {
            setErrorMessage("Failed to change password. Please try again.");
        }

        setSuccessMessage("");
    }
};

  return (
    <Row className="mb-8">
      <Col xl={3} lg={4} md={12} xs={12}>
        <div className="mb-4 mb-lg-0">
          <h4 className="mb-1">Change Setting</h4>
          <p className="mb-0 fs-5 text-muted">
            Profile configuration settings{" "}
          </p>
        </div>
      </Col>
      <Col xl={9} lg={8} md={12} xs={12}>
        <Card>
          {/* card body */}
          <Card.Body>
            <Form method="POST" onSubmit={handleSubmit}>
              {/* col */}
              <div>
                {/* border */}
                <div className="mb-6">
                  <h4 className="mb-1">Change Password</h4>
                </div>
                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="currentPassword"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Current Password
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Current Password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                </Row>

                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="newPassword"
                    className="col-sm-4 col-form-label form-label"
                  >
                    New Password
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="New Password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </Row>

                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="confirmnewPassword"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Confirm New Password
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm New Password"
                      id="confirmnewPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </Row>
                {successMessage && (
                  <p className="text-success">{successMessage}</p>
                )}
                {errorMessage && <p className="text-danger">{errorMessage}</p>}

                {/* row */}
                <Row className="align-items-center">
                  <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default GeneralSetting;
