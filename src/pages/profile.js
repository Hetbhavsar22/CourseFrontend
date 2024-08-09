// import node module libraries
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  Container,
  Image,
} from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

// import widget as custom components
// import { PageHeading } from "../../widgets/PageHeading";

// import sub components
// import AboutMe from "../../sub-components/profile/AboutMe";
// import ActivityFeed from "../../sub-components/profile/ActivityFeed";
// import MyTeam from "../../sub-components/profile/MyTeam";
import ProfileHeader from "../../sub-components/profile/ProfileHeader";
// import ProjectsContributions from "../../sub-components/profile/ProjectsContributions";
// import RecentFromBlog from "../../sub-components/profile/RecentFromBlog";

const Profile = () => {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState();
  const admin = JSON.parse(localStorage.getItem("adminData"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Admin is not authenticated. Please log in.");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      if (file) {
        formData.append("profileImage", file);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/update_details`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Details changed successfully!");
        setErrorMessage("");
        setName("");
        setFile(null); // Clear file after successful upload
        setProfileImage(response.data.profileImage); // Assuming the response contains updated profile image URL
      } else {
        setErrorMessage("Failed to change details. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error changing details:", error);
      setErrorMessage("Failed to change details. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      {/* <PageHeading heading="Overview"/> */}

      {/* Profile Header  */}
      <ProfileHeader />
      <br />
      <Row className="mb-8">
        <Col xl={12} lg={8} md={12} xs={12}>
          <Card>
            {/* card body */}
            <Card.Body>
              <Form method="POST" onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h4 className="mb-1">Change Profile Image</h4>
                </div>
                <Row className="align-items-center mb-8">
                  <Col md={3} className="mb-3 mb-md-0">
                    <h5 className="mb-0">Avatar</h5>
                  </Col>
                  <Col md={9}>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <img
                          className="rounded-circle"
                          src={`http://localhost:8080/${admin.profileImage}`}
                          alt={admin.name}
                          width={50}
                          height={50}
                          style={{ cursor: "pointer" }}
                        />
                        <input
                          type="file"
                          style={{ marginLeft: "20px" }}
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <div>
                  <div className="mb-6">
                    <h4 className="mb-1">Change Details</h4>
                  </div>
                  <Row className="mb-3">
                    <label
                      htmlFor="name"
                      className="col-sm-4 col-form-label form-label"
                    >
                      Name
                    </label>
                    <div className="col-md-8 col-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </Row>
                  <Row className="mb-3">
                    <label
                      htmlFor="email"
                      className="col-sm-4 col-form-label form-label"
                    >
                      Email
                    </label>
                    <div className="col-md-8 col-12">
                      <input
                        type="email"
                        className="form-control"
                        value={admin.email}
                        id="email"
                        readOnly
                      />
                    </div>
                  </Row>
                  {successMessage && (
                    <p className="text-success">{successMessage}</p>
                  )}
                  {errorMessage && (
                    <p className="text-danger">{errorMessage}</p>
                  )}
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

      {/* content */}
      {/* <div className="py-6"> */}
      {/* <Row> */}

      {/* About Me */}
      {/* <AboutMe /> */}

      {/* Projects Contributions */}
      {/* <ProjectsContributions /> */}

      {/* Recent From Blog */}
      {/* <RecentFromBlog /> */}

      {/* <Col xl={6} lg={12} md={12} xs={12} className="mb-6"> */}

      {/* My Team */}
      {/* <MyTeam /> */}

      {/* Activity Feed */}
      {/* <ActivityFeed /> */}

      {/* </Col> */}
      {/* </Row> */}
      {/* </div> */}
    </Container>
  );
};

export default Profile;
