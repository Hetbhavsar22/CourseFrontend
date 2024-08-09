import React, { Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import axios from "axios";
import Switch from "react-switch";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  Container,
  Col,
  Row,
  Card,
  Table,
  Form,
  Modal,
  Button,
  // Pagination,
  ProgressBar,
} from "react-bootstrap";

const courselist = () => {
  const [courses, setCourses] = useState([]);
  const [cname, setCname] = useState("");
  const [totalVideo, setTotalVideo] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState("");
  const [dprice, setDprice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [courseType, setCourseType] = useState("");
  const [title, setTitle] = useState("");
  const [sdescription, setSdescription] = useState("");
  const [ldescription, setLdescription] = useState("");
  const [typev, setTypev] = useState("");
  const [dvideo, setDvideo] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [videofile, setVideofile] = useState(null);
  const [pdf, setPdf] = useState("");
  const [ppt, setPpt] = useState("");
  const [doc, setDoc] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [percentage, setPercentage] = useState("");
  const [time, setTime] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [editCourseId, setEditCourseId] = useState(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [sortBy, setSortBy] = useState("cname");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, page, sortBy, order]);

  const token = localStorage.getItem("token");
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/course/courseList?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: searchQuery,
            sortBy,
            order,
          },
        }
      );
      setCourses(response.data.courses);
      setTotalPages(response.data.pageCount);
      setTotalCourses(response.data.totalCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!cname) {
      errors.cname = "Course Name is required.";
    } else if (cname.length > 50) {
      errors.cname = "Name should be 50 characters or less.";
    }

    if (!totalVideo) {
      errors.totalVideo = "Number of Course Videos are required.";
    }

    if (!courseImage) {
      errors.courseImage = "Course Image is required.";
    }

    if (!hours) {
      errors.hours = "Course Hours are required.";
    }

    if (!description) {
      errors.description = "Course Description is required.";
    } else if (description.length > 500) {
      errors.description =
        "Course Description should be 500 characters or less.";
    }

    if (!language) {
      errors.language = "Course Language is required.";
    }

    if (!price) {
      errors.price = "Course Actual Fees is required.";
    }

    if (!dprice) {
      errors.dprice = "Course Display Fees is required.";
    }

    if (selectedOption === "percentage") {
      if (!percentage) {
        errors.percentage = "Percentage is required.";
      } else if (percentage < 10 || percentage > 100) {
        errors.percentage = "Percentage should be between 10 and 100.";
      }
    }

    if (selectedOption === "timeIntervals") {
      if (!startTime) {
        errors.startTime = "Start time is required.";
      }
      if (!endTime) {
        errors.endTime = "End time is required.";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm1 = () => {
    let errors = {};

    if (!selectedOption) {
      errors.typev = "Type is required.";
    } else if (selectedOption !== "document" && selectedOption !== "video") {
      errors.typev = "Invalid type selected.";
    }

    if (!title) {
      errors.title = "Title is required.";
    }

    if (!sdescription) {
      errors.sdescription = "Short Description is required.";
    }

    if (!ldescription) {
      errors.ldescription = "Long Description is required.";
    }

    if (selectedOption === "video") {
      if (!dvideo) {
        errors.dvideo = "Demo Video is required.";
      }
      if (!thumbnail) {
        errors.thumbnail = "Thumbnail of video is required.";
      }
      if (!videofile) {
        errors.videofile = "Video file is required.";
      }
    } else if (selectedOption === "document") {
      if (!pdf && !ppt && !doc) {
        errors.pdf = "Select any one document type.";
      }
    }

    if (!tags) {
      errors.tags = "Tags is required.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlecourseSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    const isFormValid = validateForm();
    const token = localStorage.getItem("token");

    const admin = JSON.parse(localStorage.getItem("adminData"));
    console.log(admin);
    if (isFormValid) {
      const typeData = {
        courseType: selectedOption,
        ...(selectedOption === "percentage" && { percentage }),
        ...(selectedOption === "timeIntervals" && {
          startTime: startTime ? startTime : null,
          endTime: endTime ? endTime : null,
        }),
      };

      const formData = new FormData();
      formData.append("cname", cname);
      formData.append("totalVideo", totalVideo);
      formData.append("courseImage", courseImage);
      formData.append("hours", hours);
      formData.append("description", description);
      formData.append("language", language);
      formData.append("price", price);
      formData.append("dprice", dprice);
      formData.append("createdBy", createdBy);
      formData.append("courseType", selectedOption);
      if (selectedOption === "percentage") {
        formData.append("percentage", percentage);
      } else if (selectedOption === "timeIntervals") {
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);
      }

      try {
        const response = await axios.post(
          `http://localhost:8080/course/${admin._id}/coursedetails`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);
        if (response.status == 200) {
          console.log("Course details submitted successfully");
          fetchCourses();
          setCname("");
          setTotalVideo("");
          setCourseImage("");
          setHours("");
          setDescription("");
          setLanguage("");
          setPrice("");
          setDprice("");
          setPercentage("");
          setCreatedBy("");
          setTime("");
          setStartTime(null);
          setEndTime(null);
          setSelectedOption("");
        } else {
          setError("Unexpected response status: " + response.status);
        }
      } catch (err) {
        console.error("Submission failed:", err);

        if (err.response) {
          console.error("Response errors:", err.response.data.errors);
          setError(err.response.data?.errors?.map((e) => e.msg).join(", "));
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        const formData = new FormData();
        formData.append("cname", cname);
        formData.append("totalVideo", totalVideo);
        formData.append("courseImage", courseImage);
        formData.append("hours", hours);
        formData.append("description", description);
        formData.append("language", language);
        formData.append("price", price);
        formData.append("dprice", dprice);
        formData.append("courseType", courseType);
        if (courseType === "percentage") {
          formData.append("percentage", percentage);
        } else if (courseType === "timeIntervals") {
          formData.append("startTime", startTime);
          formData.append("endTime", endTime);
        } else if (courseType === "allOpen") {
          // No additional fields required
        }

        // Append editCourseId if editing an existing course
        if (editCourseId) {
          formData.append("editCourseId", editCourseId);
        }

        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        const response = await axios.post(
          `http://localhost:8080/course/coursedetails/${editCourseId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          console.log("Course details updated successfully");
          fetchCourses(); // Fetch updated course list or details
          // Reset form fields
          setEditCourseId(null);
          setCname("");
          setTotalVideo("");
          setCourseImage("");
          setHours("");
          setDescription("");
          setLanguage("");
          setPrice("");
          setDprice("");
          setCourseType("");
          setPercentage("");
          setStartTime("");
          setEndTime("");
        } else {
          setError("Unexpected response status: " + response.status);
        }
      } catch (err) {
        console.error("Update failed:", err);
        if (err.response) {
          setError("Failed to update course details. Please try again.");
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

  const handleEdit = (course) => {
    setEditCourseId(course._id);
    setCname(course.cname);
    setTotalVideo(course.totalVideo);
    setCourseImage(course.courseImage);
    setHours(course.hours);
    setDescription(course.description);
    setLanguage(course.language);
    setPrice(course.price);
    setDprice(course.dprice);
    setCourseType(course.courseType);
    // Handling percentage and time for different types
    if (course.courseType === "percentage") {
      setPercentage(course.percentage); // Set percentage if type is "percentage"
      setTime(""); // Clear time field if not needed
    } else if (course.courseType === "timeIntervals") {
      setTime(course.time); // Set time if type is "timeIntervals"
      setStartTime(course.startTime); // Set start time if available
      setEndTime(course.endTime); // Set end time if available
      setPercentage(""); // Clear percentage field if not needed
    } else if (course.courseType === "allOpen") {
      setPercentage(""); // Clear percentage for "allOpen"
      setTime(""); // Clear time for "allOpen"
      setStartTime(""); // Clear start time for "allOpen"
      setEndTime(""); // Clear end time for "allOpen"
    }
    console.log("Edited course: ", course);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8080/course/coursedetails/${id}`
        );
        if (response.status === 200) {
          console.log("Course deleted successfully");
          fetchCourses();
        } else {
          setError("Failed to delete course");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        setError("Failed to delete course. Please try again.");
      }
    }
  };

  const handlevideoSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const admin = JSON.parse(localStorage.getItem("adminData"));
    const courseId = currentCourse._id;

    if (!currentCourse) {
      setError("No course selected.");
      return;
    }

    const isFormValid1 = validateForm1();

    if (isFormValid1) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("createdBy", admin._id);
        formData.append("courseId", currentCourse._id);
        formData.append("title", title);
        formData.append("sdescription", sdescription);
        formData.append("ldescription", ldescription);
        formData.append("tags", tags);
        formData.append("typev", selectedOption);
        formData.append("dvideo", dvideo ? "true" : "false");

        if (selectedOption === "document") {
          if (pdf) formData.append("pdf", pdf);
          if (ppt) formData.append("ppt", ppt);
          if (doc) formData.append("doc", doc);
        }

        if (selectedOption === "video") {
          if (thumbnail) formData.append("thumbnail", thumbnail);
          if (videofile) formData.append("videofile", videofile);
        }

        const response = await axios.post(
          `http://localhost:8080/video/${courseId}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          fetchCourses();
          setTitle("");
          setSdescription("");
          setLdescription("");
          setTags([]);
          setDvideo("");
          setPdf(null);
          setPpt(null);
          setDoc(null);
          setThumbnail(null);
          setVideofile(null);
          setSelectedOption("");
        } else {
          setError("Unexpected response status: " + response.status);
        }
      } catch (err) {
        console.error("Submission failed:", err);

        if (err.response) {
          setError("Video/Document with the same details already exists.");
        } else if (err.request) {
          setError("No response from server. Please try again later.");
        } else {
          setError("Error: " + err.message);
        }
      } finally {
        setLoading(false); // Hide loader
      }
    }
  };

  const handleComponents = (course) => {
    setCurrentCourse(course);
  };

  const handleToggleActive = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/course/${id}/toggle`);
      fetchCourses(); // Refresh the list of courses
    } catch (error) {
      console.error("Error toggling course status:", error);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setCourseType(e.target.value);
    if (e.target.value === "percentage") {
      setPercentage("");
    }
    if (e.target.value === "timeIntervals") {
      setStartTime(null);
      setTime(null);
      setEndTime(null);
    }
  };

  const handleVideoChange = (e) => {
    setSelectedOption(e.target.value);

    // Reset state variables based on selected option
    if (e.target.value !== "document") {
      setPdf(null);
      setDoc(null);
      setPpt(null);
    }
    if (e.target.value !== "video") {
      // setDvideo(null);
      setThumbnail(null);
      setVideofile(null);
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
    fetchCourses(); // Fetch sorted data
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags((prevTags) => [...prevTags, value]);
    } else {
      setTags((prevTags) => prevTags.filter((tag) => tag !== value));
    }
  };

  const handleImageClick = (courseImage) => {
    setSelectedImage(courseImage);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <>
      <Fragment>
        <div className="bg-primary pt-10 pb-21"></div>
        <Container fluid className="mt-n22 px-6">
          <Row>
            <Col lg={12} md={12} xs={12}>
              {/* Page header */}
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="mb-2 mb-lg-0">
                    <h3 className="mb-0  text-white">Courses</h3>
                  </div>
                  <div>
                    {/* <Link href="#" className="btn btn-white">
                      Post New Course
                    </Link> */}

                    <div
                      className="modal fade"
                      id="addcourseModalToggle"
                      aria-hidden="true"
                      aria-labelledby="addcourseModalToggle"
                      tabIndex="-1"
                    >
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              id="addcourseModalToggle"
                            >
                              New Course
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <Form method="POST">
                              {/* row */}
                              <Row className="mb-3">
                                <label
                                  htmlFor="cname"
                                  className="col-sm-4 col-form-label form-label"
                                >
                                  Course Name
                                </label>
                                <div className="col-md-8 col-12">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Course Name"
                                    id="cname"
                                    onChange={(e) => setCname(e.target.value)}
                                    required
                                  />
                                  {errors.cname && (
                                    <p
                                      style={{
                                        color: "red",
                                        fontSize: "14px",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {errors.cname}
                                    </p>
                                  )}
                                </div>
                              </Row>
                              {/* row */}
                              <Row className="mb-3">
                                <label
                                  htmlFor="totalVideo"
                                  className="col-sm-4 col-form-label form-label"
                                >
                                  Total Video
                                </label>
                                <div className="col-md-8 col-12">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Total Video"
                                    id="totalVideo"
                                    onChange={(e) =>
                                      setTotalVideo(e.target.value)
                                    }
                                    required
                                  />
                                  {errors.totalVideo && (
                                    <p
                                      style={{
                                        color: "red",
                                        fontSize: "14px",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {errors.totalVideo}
                                    </p>
                                  )}
                                </div>
                              </Row>
                              {/* row */}
                              <Row className="mb-3">
                                <label
                                  htmlFor="courseImage"
                                  className="col-sm-4 col-form-label form-label"
                                >
                                  Course Image
                                </label>
                                <div className="col-md-8 col-12">
                                  <input
                                    type="file"
                                    className="form-control"
                                    id="courseImage"
                                    onChange={(e) =>
                                      setCourseImage(e.target.files[0])
                                    }
                                  />
                                  {errors.courseImage && (
                                    <p
                                      style={{
                                        color: "red",
                                        fontSize: "14px",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {errors.courseImage}
                                    </p>
                                  )}
                                </div>
                              </Row>
                              {/* row */}
                              <Row className="mb-3">
                                <label
                                  htmlFor="hours"
                                  className="col-sm-4 col-form-label form-label"
                                >
                                  Total Hours
                                </label>
                                <div className="col-md-8 col-12">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Hours"
                                    id="hours"
                                    onChange={(e) => setHours(e.target.value)}
                                    required
                                  />
                                  {errors.hours && (
                                    <p
                                      style={{
                                        color: "red",
                                        fontSize: "14px",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {errors.hours}
                                    </p>
                                  )}
                                </div>
                              </Row>
                              {/* row */}
                              <Row className="mb-3">
                                <label
                                  htmlFor="description"
                                  className="col-sm-4 col-form-label form-label"
                                >
                                  Description
                                </label>
                                <div className="col-md-8 col-12">
                                  <textarea
                                    type="text"
                                    className="form-control"
                                    placeholder="Description"
                                    id="description"
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    required
                                  />
                                  {errors.description && (
                                    <p
                                      style={{
                                        color: "red",
                                        fontSize: "14px",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {errors.description}
                                    </p>
                                  )}
                                </div>
                              </Row>
                              {/* row */}
                              <Row className="mb-3">
                                <label
                                  htmlFor="language"
                                  className="col-sm-4 col-form-label form-label"
                                >
                                  Language
                                </label>
                                <div className="col-md-8 col-12">
                                  <select
                                    className="form-select"
                                    id="language"
                                    onChange={(e) =>
                                      setLanguage(e.target.value)
                                    }
                                    required
                                  >
                                    <option value="">Select Language</option>
                                    <option value="english">English</option>
                                    <option value="hindi">Hindi</option>
                                    <option value="gujarati">Gujarati</option>
                                    {/* Add other language options as needed */}
                                  </select>
                                  {errors.language && (
                                    <p
                                      style={{
                                        color: "red",
                                        fontSize: "14px",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {errors.language}
                                    </p>
                                  )}
                                </div>
                              </Row>
                              {/* row */}
                              <Row className="mb-3">
                                <label
                                  htmlFor="price"
                                  className="col-sm-4 col-form-label form-label"
                                >
                                  Actual Price
                                </label>
                                <div className="col-md-8 col-12">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Price"
                                    id="price"
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                  />
                                  {errors.price && (
                                    <p
                                      style={{
                                        color: "red",
                                        fontSize: "14px",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {errors.price}
                                    </p>
                                  )}
                                </div>
                              </Row>
                              {/* row */}
                              <Row className="mb-3">
                                <label
                                  htmlFor="dprice"
                                  className="col-sm-4 col-form-label form-label"
                                >
                                  Display Price
                                </label>
                                <div className="col-md-8 col-12">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Display Price"
                                    id="dprice"
                                    onChange={(e) => setDprice(e.target.value)}
                                    required
                                  />
                                  {errors.dprice && (
                                    <p
                                      style={{
                                        color: "red",
                                        fontSize: "14px",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      {errors.dprice}
                                    </p>
                                  )}
                                </div>
                              </Row>
                              {/* row */}
                              <Row className="mb-3">
                                <label className="col-sm-4 col-form-label form-label">
                                  Type
                                </label>
                                <div className="col-md-8 col-12">
                                  <div>
                                    <input
                                      type="radio"
                                      value="percentage"
                                      checked={selectedOption === "percentage"}
                                      onChange={handleOptionChange}
                                    />{" "}
                                    Percentage
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      value="allOpen"
                                      checked={selectedOption === "allOpen"}
                                      onChange={handleOptionChange}
                                    />{" "}
                                    All Open
                                  </div>
                                  <div>
                                    <input
                                      type="radio"
                                      value="timeIntervals"
                                      checked={
                                        selectedOption === "timeIntervals"
                                      }
                                      onChange={handleOptionChange}
                                    />{" "}
                                    Time Intervals
                                  </div>

                                  {selectedOption === "percentage" && (
                                    <div>
                                      <input
                                        type="number"
                                        className="form-control mt-2"
                                        placeholder="Enter percentage"
                                        value={percentage}
                                        onChange={(e) =>
                                          setPercentage(e.target.value)
                                        }
                                      />
                                      {errors.percentage && (
                                        <p
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                            marginBottom: "6px",
                                          }}
                                        >
                                          {errors.percentage}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {selectedOption === "timeIntervals" && (
                                    <div>
                                      <div>
                                        <label>Start Time</label>
                                        <DatePicker
                                          selected={startTime}
                                          onChange={(date) =>
                                            setStartTime(date)
                                          }
                                          showTimeSelect
                                          showTimeSelectOnly
                                          timeIntervals={15}
                                          timeCaption="Time"
                                          dateFormat="h:mm aa"
                                          className="form-control mt-2"
                                          placeholderText="Select start time"
                                        />
                                      </div>
                                      <br />
                                      <div>
                                        <label>End Time</label> <br />
                                        <DatePicker
                                          selected={endTime}
                                          onChange={(date) => setEndTime(date)}
                                          showTimeSelect
                                          showTimeSelectOnly
                                          timeIntervals={15}
                                          timeCaption="Time"
                                          dateFormat="h:mm aa"
                                          className="form-control mt-2"
                                          placeholderText="Select end time"
                                        />
                                      </div>
                                      {errors.time && (
                                        <p
                                          style={{
                                            color: "red",
                                            fontSize: "14px",
                                            marginBottom: "6px",
                                          }}
                                        >
                                          {errors.time}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </Row>
                              {error && (
                                <p
                                  className="error-message"
                                  style={{ color: "red" }}
                                >
                                  {error}
                                </p>
                              )}
                              <div className="modal-footer">
                                <button
                                  className="btn btn-primary"
                                  type="submit"
                                  onClick={handlecourseSubmit}
                                  data-bs-dismiss="modal"
                                  style={{ color: "white" }}
                                  // disabled={Object.keys(errors).length !== 0}
                                >
                                  Create
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                  onClick={() => setErrors({})}
                                >
                                  Close
                                </button>
                              </div>
                            </Form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a
                      data-bs-toggle="modal"
                      href="#addcourseModalToggle"
                      role="button"
                      className="btn btn-white"
                    >
                      Add New Course
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Existing Courses Table */}
          <Row className="mt-6">
            <Col md={12} xs={12}>
              <Card>
                <Card.Header className="bg-white py-4 d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Course</h4>
                  <div className="mb-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by course name"
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
                        onClick={() => handleSort("cname")}
                      >
                        Name{" "}
                        {sortBy === "cname" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("totalVideo")}
                      >
                        Total Video{" "}
                        {sortBy === "totalVideo" &&
                          (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ textAlign: "center" }}>Course Image</th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("hours")}
                      >
                        Total Hours{" "}
                        {sortBy === "hours" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("description")}
                      >
                        Description{" "}
                        {sortBy === "description" &&
                          (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("language")}
                      >
                        Language{" "}
                        {sortBy === "language" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("price")}
                      >
                        Actual Price{" "}
                        {sortBy === "price" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("dprice")}
                      >
                        Display Price{" "}
                        {sortBy === "dprice" && (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("courseType")}
                      >
                        Type{" "}
                        {sortBy === "courseType" &&
                          (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ textAlign: "center" }}>Additional Info</th>
                      <th style={{ textAlign: "center" }}>Status </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("createdBy")}
                      >
                        Created By{" "}
                        {sortBy === "createdBy" &&
                          (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("createdAt")}
                      >
                        Created At{" "}
                        {sortBy === "createdAt" &&
                          (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th
                        style={{ textAlign: "center", cursor: "pointer" }}
                        onClick={() => handleSort("updatedBy")}
                      >
                        Updated By{" "}
                        {sortBy === "updatedBy" &&
                          (order === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <tr key={course._id}>
                          <td style={{ textAlign: "center" }}>
                            {course.cname}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {course.totalVideo}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div>
                              <img
                                className="rounded-circle"
                                src={`http://localhost:8080/${course.courseImage}`}
                                alt={course.cname}
                                width={50}
                                height={50}
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleImageClick(course.courseImage)
                                }
                              />
                            </div>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {course.hours} Hours
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {course.description}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {course.language}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {course.price}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {course.dprice}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {course.courseType}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div className="float-start me-3">
                              {course.courseType === "percentage"
                                ? `${course.percentage}%`
                                : ""}
                            </div>
                            <div className="mt-2">
                              {course.courseType === "percentage" && (
                                <ProgressBar
                                  now={course.percentage}
                                  style={{ height: "5px" }}
                                />
                              )}
                            </div>
                            {course.courseType === "timeIntervals" &&
                            course.startTime &&
                            course.endTime
                              ? `${new Date(
                                  course.startTime
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })} to ${new Date(
                                  course.endTime
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`
                              : ""}
                            {course.courseType === "allOpen" ? "allOpen" : ""}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            <Switch
                              checked={course.active}
                              onChange={() => handleToggleActive(course._id)}
                              onColor="#e1a6bf"
                              onHandleColor="#dc4282"
                              handleDiameter={30}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                              height={20}
                              width={48}
                              className="react-switch"
                              id="material-switch"
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {course.createdBy}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {new Date(course.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {course.updatedBy}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              className="btn btn-primary me-2 mb-md-0"
                              onClick={() => handleEdit(course)}
                              data-bs-toggle="modal"
                              href="#editcourseModalToggle"
                              role="button"
                              style={{ color: "white" }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-primary me-2 mb-md-0"
                              onClick={() => handleComponents(course)}
                              data-bs-toggle="modal"
                              href="#componentscourseModalToggle"
                              role="button"
                              style={{ color: "white" }}
                            >
                              Contents
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(course._id)}
                              style={{ color: "white" }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{textAlign: "right"}}>No Course available.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Card.Footer className="bg-white text-center">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <p className="mb-0">Total Courses: {totalCourses}</p>
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

      {/* Edit Course Modal */}
      <div
        className="modal fade"
        id="editcourseModalToggle"
        aria-hidden="true"
        aria-labelledby="editcourseModalToggle"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editcourseModalToggle">
                Edit Course
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Form method="POST" onSubmit={handleEditSubmit}>
                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="cname"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Course Name
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Course Name"
                      id="cname"
                      value={cname}
                      onChange={(e) => setCname(e.target.value)}
                    />
                    {errors && errors.cname && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.cname}
                      </p>
                    )}
                  </div>
                </Row>
                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="totalVideo"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Total Video
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Total Video"
                      id="totalVideo"
                      value={totalVideo}
                      onChange={(e) => setTotalVideo(e.target.value)}
                    />
                    {errors && errors.totalVideo && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.totalVideo}
                      </p>
                    )}
                  </div>
                </Row>
                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="courseImage"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Course Image
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="file"
                      className="form-control"
                      id="courseImage"
                      onChange={(e) => setCourseImage(e.target.files[0])}
                    />
                    {errors.courseImage && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.courseImage}
                      </p>
                    )}
                  </div>
                </Row>
                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="hours"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Total Hours
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Hours"
                      id="hours"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                    />
                    {errors.hours && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.hours}
                      </p>
                    )}
                  </div>
                </Row>
                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="description"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Description
                  </label>
                  <div className="col-md-8 col-12">
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="Description"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.description}
                      </p>
                    )}
                  </div>
                </Row>
                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="language"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Language
                  </label>
                  <div className="col-md-8 col-12">
                    <select
                      className="form-select"
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Language
                      </option>
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="gujarati">Gujarati</option>
                      {/* Add other language options as needed */}
                    </select>
                    {errors.language && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.language}
                      </p>
                    )}
                  </div>
                </Row>
                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="price"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Actual Price
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    {errors.price && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.price}
                      </p>
                    )}
                  </div>
                </Row>
                {/* row */}
                <Row className="mb-3">
                  <label
                    htmlFor="dprice"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Display Price
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Display Price"
                      id="dprice"
                      value={dprice}
                      onChange={(e) => setDprice(e.target.value)}
                    />
                    {errors.dprice && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.dprice}
                      </p>
                    )}
                  </div>
                </Row>
                {/* row */}
                <Row className="mb-3">
                  <label className="col-sm-4 col-form-label form-label">
                    Type
                  </label>
                  <div className="col-md-8 col-12">
                    <div>
                      <input
                        type="radio"
                        value="percentage"
                        checked={selectedOption === "percentage"}
                        onChange={handleOptionChange}
                      />{" "}
                      Percentage
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="allOpen"
                        checked={selectedOption === "allOpen"}
                        onChange={handleOptionChange}
                      />{" "}
                      All Open
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="timeIntervals"
                        checked={selectedOption === "timeIntervals"}
                        onChange={handleOptionChange}
                      />{" "}
                      Time Intervals
                    </div>

                    {selectedOption === "percentage" && (
                      <div>
                        <input
                          type="number"
                          className="form-control mt-2"
                          placeholder="Enter percentage"
                          value={percentage}
                          onChange={(e) => setPercentage(e.target.value)}
                        />
                        {errors.percentage && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginBottom: "6px",
                            }}
                          >
                            {errors.percentage}
                          </p>
                        )}
                      </div>
                    )}

                    {selectedOption === "timeIntervals" && (
                      <div>
                        <div>
                          <label>Start Time</label>
                          <DatePicker
                            selected={startTime}
                            onChange={(date) => setStartTime(date)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            className="form-control mt-2"
                            placeholderText="Select start time"
                          />
                        </div>
                        <br />
                        <div>
                          <label>End Time</label> <br />
                          <DatePicker
                            selected={endTime}
                            onChange={(date) => setEndTime(date)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            className="form-control mt-2"
                            placeholderText="Select end time"
                          />
                        </div>
                        {errors.time && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginBottom: "6px",
                            }}
                          >
                            {errors.time}
                          </p>
                        )}
                      </div>
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
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    type="button"
                    onClick={() => setErrors({})}
                  >
                    Close
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* Components Course Modal */}
      <div
        className="modal fade"
        id="componentscourseModalToggle"
        aria-hidden="true"
        aria-labelledby="componentscourseModalToggle"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="componentscourseModalToggle">
                Course Components
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Form method="POST" onSubmit={handlevideoSubmit}>
                {/* Radio button selection */}
                <Row className="mb-3">
                  <label className="col-sm-4 col-form-label form-label">
                    Type
                  </label>
                  <div className="col-md-8 col-12">
                    <div>
                      <input
                        type="radio"
                        value="document"
                        checked={selectedOption === "document"}
                        onChange={handleVideoChange}
                      />{" "}
                      Documents
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="video"
                        checked={selectedOption === "video"}
                        onChange={handleVideoChange}
                      />{" "}
                      Video
                    </div>
                    {errors.typev && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.typev}
                      </p>
                    )}
                  </div>
                </Row>
                <Row className="mb-3">
                  <label
                    htmlFor="title"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Title
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors?.title && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.title}
                      </p>
                    )}
                  </div>
                </Row>
                <Row className="mb-3">
                  <label
                    htmlFor="sdescription"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Short Description
                  </label>
                  <div className="col-md-8 col-12">
                    {/* {editorLoaded ? ( */}
                    <textarea
                      className="form-control"
                      id="sdescription"
                      placeholder="Short Description"
                      value={sdescription}
                      onChange={(e) => setSdescription(e.target.value)}
                      rows="3"
                    />
                    {/* <CustomCKEditor
                      editorConfig={{
                        // Your custom CKEditor configuration
                        toolbar: ["heading", "|", "bold", "italic", "link"],
                      }}
                      data={sdescription}
                      onChange={handleEditorChange}
                    /> */}
                    {/* <CKEditor
                        editor={ClassicEditor}
                        data={sdescription}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setSdescription(data);
                        }}
                      /> */}
                    {/* ) : (
                      <p>Loading editor...</p>
                    )} */}
                    {errors?.sdescription && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.sdescription}
                      </p>
                    )}
                  </div>
                </Row>
                <Row className="mb-3">
                  <label
                    htmlFor="ldescription"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Long Description
                  </label>
                  <div className="col-md-8 col-12">
                    <textarea
                      className="form-control"
                      id="ldescription"
                      placeholder="Long Description"
                      value={ldescription}
                      onChange={(e) => setLdescription(e.target.value)}
                      rows="3"
                    />
                    {/* <CustomCKEditor
                      editorConfig={{
                        // Your custom CKEditor configuration
                        toolbar: ["heading", "|", "bold", "italic", "link"],
                      }}
                      data={ldescription}
                      onChange={handleEditorChange}
                    /> */}
                    {/* <CKEditor
                      editor={ClassicEditor}
                      data={ldescription}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setLdescription(data);
                      }}
                    /> */}
                    {errors?.ldescription && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.ldescription}
                      </p>
                    )}
                  </div>
                </Row>
                {/* PDF Input Fields */}
                {selectedOption === "document" && (
                  <div>
                    <Row className="mb-3">
                      <label
                        htmlFor="pdf"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Upload PDF
                      </label>
                      <div className="col-md-8 col-12">
                        <input
                          type="file"
                          className="form-control"
                          id="pdf"
                          onChange={(e) => setPdf(e.target.files[0])}
                        />
                        {errors.pdf && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginBottom: "6px",
                            }}
                          >
                            {errors.pdf}
                          </p>
                        )}
                      </div>
                    </Row>
                    <p style={{ textAlign: "center" }}>OR</p>
                    <Row className="mb-3">
                      <label
                        htmlFor="ppt"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Upload PPT
                      </label>
                      <div className="col-md-8 col-12">
                        <input
                          type="file"
                          className="form-control"
                          id="ppt"
                          accept=".ppt, .pptx"
                          onChange={(e) => setPpt(e.target.files[0])}
                        />
                        {errors.ppt && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginBottom: "6px",
                            }}
                          >
                            {errors.ppt}
                          </p>
                        )}
                      </div>
                    </Row>
                    <p style={{ textAlign: "center" }}>OR</p>
                    <Row className="mb-3">
                      <label
                        htmlFor="doc"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Upload Document
                      </label>
                      <div className="col-md-8 col-12">
                        <input
                          type="file"
                          className="form-control"
                          id="doc"
                          accept=".doc, .docx"
                          onChange={(e) => setDoc(e.target.files[0])}
                        />
                        {errors.doc && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginBottom: "6px",
                            }}
                          >
                            {errors.doc}
                          </p>
                        )}
                      </div>
                    </Row>
                  </div>
                )}

                {/* Video Input Fields */}
                {selectedOption === "video" && (
                  <div>
                    <Row className="mb-3">
                      <div className="col-md-8 col-12">
                        <input
                          type="checkbox"
                          id="dvideo"
                          name="dvideo"
                          value={dvideo}
                          checked={dvideo}
                          onChange={(e) => setDvideo(e.target.checked)}
                        />
                        <label htmlFor="dvideo" className="form-label">
                          Use video as Demo Video
                        </label>
                        {errors?.dvideo && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginBottom: "6px",
                            }}
                          >
                            {errors.dvideo}
                          </p>
                        )}
                      </div>
                    </Row>
                    <Row className="mb-3">
                      <label
                        htmlFor="thumbnail"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Thumbnail
                      </label>
                      <div className="col-md-8 col-12">
                        <input
                          type="file"
                          className="form-control"
                          id="thumbnail"
                          onChange={(e) => setThumbnail(e.target.files[0])}
                        />
                        {errors.thumbnail && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginBottom: "6px",
                            }}
                          >
                            {errors.thumbnail}
                          </p>
                        )}
                      </div>
                    </Row>

                    <Row className="mb-3">
                      <label
                        htmlFor="videofile"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Upload Video
                      </label>
                      <div className="col-md-8 col-12">
                        <input
                          type="file"
                          className="form-control"
                          id="videofile"
                          onChange={(e) => setVideofile(e.target.files[0])}
                        />
                        {errors.videofile && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginBottom: "6px",
                            }}
                          >
                            {errors.videofile}
                          </p>
                        )}
                      </div>
                    </Row>
                  </div>
                )}
                <Row className="mb-3">
                  <label
                    htmlFor="tags"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Tags
                  </label>
                  <div className="col-md-8 col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="tag1"
                        value="tag1"
                        checked={tags.includes("tag1")}
                        onChange={(e) => handleCheckboxChange(e)}
                      />
                      <label className="form-check-label" htmlFor="tag1">
                        Tag 1
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="tag2"
                        value="tag2"
                        checked={tags.includes("tag2")}
                        onChange={(e) => handleCheckboxChange(e)}
                      />
                      <label className="form-check-label" htmlFor="tag2">
                        Tag 2
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="tag3"
                        value="tag3"
                        checked={tags.includes("tag3")}
                        onChange={(e) => handleCheckboxChange(e)}
                      />
                      <label className="form-check-label" htmlFor="tag3">
                        Tag 3
                      </label>
                    </div>
                    {errors?.tags && (
                      <p
                        style={{
                          color: "red",
                          fontSize: "14px",
                          marginBottom: "6px",
                        }}
                      >
                        {errors.tags}
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
                  {loading && (
                    <div className="d-flex justify-content-center align-items-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                  <button
                    className="btn btn-primary"
                    type="submit"
                    data-bs-dismiss="modal"
                    style={{ color: "white" }}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => setErrors({})}
                  >
                    Close
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for displaying full-size image */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Course Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`http://localhost:8080/${selectedImage}`}
            alt="Course"
            style={{ width: "100%", height: "auto" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default courselist;
