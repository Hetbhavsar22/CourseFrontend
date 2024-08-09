import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Switch from "react-switch";
import { Container, Col, Row, Card, Table, Form } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function Video() {
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [enrolledCourse, setEnrolledCourse] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalUser, setTotalUser] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("cname");
  const [order, setOrder] = useState("asc");
  const [errors, setErrors] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    let errors = {};

    if (!name) {
      errors.name = "Course Name is required.";
    } else if (name.length > 50) {
      errors.name = "Name should be 50 characters or less.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone Number is required.";
    }

    if (!enrolledCourse) {
      errors.enrolledCourse = "Enrolled Course is required.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/userList?page=${page}`,
        {
          params: {
            search: searchQuery,
            sortBy,
            order,
          },
        }
      );
      setUsers(response.data.users);
      setTotalPages(response.data.pageCount);
      setTotalUser(response.data.totalVideo);
    } catch (error) {
      console.error("Error fetching Users details:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const isFormValid = validateForm();

    if (isFormValid) {
      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("enrolledCourse", enrolledCourse);

        // Append videoId if editing an existing video
        if (editUserId) {
          formData.append("editUserId", editUserId);
        }
        console.log(formData);
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/editUser`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          console.log("Video details updated successfully");
          fetchUsers();
          setEditUserId(null);
          setName("");
          setEmail("");
          setPhoneNumber("");
          setEnrolledCourse("");
        } else {
          setError("Unexpected response status: " + response.status);
        }
      } catch (err) {
        console.error("Update failed:", err);
        if (err.response) {
          setError("Failed to update User details. Please try again.");
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

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setCourseId(user.courseId);
    setUserId(user.userId);
    setName(user.name);
    setEmail(user.email);
    setPhoneNumber(user.phoneNumber);
    setEnrolledCourse(user.enrolledCourse);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/deleteUser/${id}`
        );
        if (response.status === 200) {
          console.log("User deleted successfully");
          fetchUsers(); // Refresh the list of videos
        } else {
          setError("Failed to delete user");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        setError("Failed to delete user. Please try again.");
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}/toggle`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleSort = (column) => {
    // Toggle between ascending and descending order
    const newOrder = sortBy === column && order === "asc" ? "desc" : "asc";
    setSortBy(column);
    setOrder(newOrder);
  };

  return (
    <>
      <Fragment>
        <div className="bg-primary pt-10 pb-21"></div>
        <Container fluid className="mt-n22 px-6">
          <Row>
            <Col lg={12} md={12} xs={12}>
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="mb-2 mb-lg-0">
                    <h3 className="mb-0  text-white">Users</h3>
                  </div>
                  <div></div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-6">
            <Col md={12} xs={12}>
              <Card>
                <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">User Table</h4>
                  <div className="mb-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by video name"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </Card.Header>
                <Table responsive className="text-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("name")}
                      >
                        User Name{" "}
                        {sortBy === "name" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("email")}
                      >
                        Email{" "}
                        {sortBy === "email" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("phoneNumber")}
                      >
                        Phone Number{" "}
                        {sortBy === "phoneNumber" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("otp")}
                      >
                        OTP{" "}
                        {sortBy === "otp" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("enrolledCourse")}
                      >
                        Enrolled Course{" "}
                        {sortBy === "enrolledCourse" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center" }}
                      >
                        Status
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("createdAt")}
                      >
                        Created At{" "}
                        {sortBy === "createdAt" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center" }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users &&
                      users.map((user) => (
                        <tr key={user._id}>
                          <td style={{ textAlign: "center" }}>{user.name}</td>
                          <td style={{ textAlign: "center" }}>{user.email}</td>
                          <td style={{ textAlign: "center" }}>
                            {user.phoneNumber}
                          </td>
                          <td style={{ textAlign: "center" }}>{user.otp}</td>
                          <td style={{ textAlign: "center" }}>
                            {user.enrolledCourse}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Switch
                              checked={user.active}
                              onChange={() => handleToggleActive(user._id)}
                              onColor="#e1a6bf"
                              onHandleColor="#dc4282"
                              handleDiameter={30}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              height={20}
                              width={48}
                              className="react-switch"
                              id="material-switch"
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              className="btn btn-primary me-2 mb-md-0"
                              onClick={() => handleEdit(user)}
                              data-bs-toggle="modal"
                              href="#editUserModalToggle"
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(user._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "right" }}>
                          No User available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Card.Footer className="bg-white text-center">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0">Total Courses: {totalUser}</p>
                    <Stack spacing={2} className="pagination">
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        style={{ color: "white" }}
                        siblingCount={1}
                        boundaryCount={1}
                        showFirstButton
                        showLastButton
                      />
                    </Stack>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </Fragment>
      {/* Edit Video Modal */}
      <div
        className="modal fade"
        id="editUserModalToggle"
        aria-hidden="true"
        aria-labelledby="editUserModalToggle"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editUserModalToggle">
                Edit Users
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <Form method="PUT" onSubmit={handleEditSubmit}>
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
                      id="name"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>
                </Row>
                <Row className="mb-3">
                  <label
                    htmlFor="email"
                    className="col-sm-4 col-form-label form-label"
                  >
                    email
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                  </div>
                </Row>
                <Row className="mb-3">
                  <label
                    htmlFor="phoneNumber"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Phone Number
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="number"
                      className="form-control"
                      id="phoneNumber"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    {errors.phoneNumber && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </Row>
                <Row className="mb-3">
                  <label
                    htmlFor="enrolledCourse"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Enrolled Course
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="text"
                      className="form-control"
                      id="enrolledCourse"
                      placeholder="Enrolled Course"
                      value={enrolledCourse}
                      onChange={(e) => setEnrolledCourse(e.target.value)}
                    />
                    {errors.enrolledCourse && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.enrolledCourse}
                      </p>
                    )}
                  </div>
                </Row>
                <div className="modal-footer">
                  {error && (
                    <p className="error-message" style={{ color: "red" }}>
                      {error}
                    </p>
                  )}
                  <button
                    className="btn btn-primary"
                    type="submit"
                    data-bs-dismiss="modal"
                    style={{ color: "white" }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Video;
