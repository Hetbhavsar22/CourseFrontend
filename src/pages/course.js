import React, { Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import axios from "axios";
import Switch from "react-switch";
import {
  Container,
  Col,
  Row,
  Card,
  Table,
  Form,
  Button,
  Pagination,
} from "react-bootstrap";
import dynamic from "next/dynamic";
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);
const ClassicEditor = dynamic(
  () => import("@ckeditor/ckeditor5-build-classic"),
  { ssr: false }
);

const courselist = () => {
  const [courses, setCourses] = useState([]);
  const [cname, setCname] = useState("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState("");
  const [dprice, setDprice] = useState("");
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
  const [editorData, setEditorData] = useState("<p>Initial content</p>");

  const handleEditorChange = (data) => {
    setEditorData(data);
  };
  // const [searchQuery, setSearchQuery] = useState("");
  // const [filteredCourses, setFilteredCourses] = useState([]);
  // const [editorLoaded, setEditorLoaded] = useState(true);
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;
  // // Calculate the indices of the first and last item on the current page
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = courses.slice(indexOfFirstItem, indexOfLastItem);
  // // Calculate total pages
  // const totalPages = Math.ceil(courses.length / itemsPerPage);

  useEffect(() => {
    fetchCourses();
  }, []);
  const token = localStorage.getItem("token");
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/course/courseList",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []); // Dependency on searchQuery to refetch on change

  // useEffect(() => {
  //   // Set editorLoaded to true after component mounts
  //   setEditorLoaded(true);
  // }, []);

  const validateForm = () => {
    let errors = {};

    if (!cname) {
      errors.cname = "Course Name is required.";
    } else if (cname.length > 50) {
      errors.cname = "Name should be 50 characters or less.";
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

    const user = JSON.parse(localStorage.getItem("userData"));
    console.log(user);
    if (isFormValid) {
      const typeData = {
        courseType: selectedOption,
        ...(selectedOption === "percentage" && { percentage }),
        ...(selectedOption === "timeIntervals" && {
          // startTime: startTime ? startTime.toLocaleTimeString() : null,
          // endTime: endTime ? endTime.toLocaleTimeString() : null,
          startTime: startTime ? startTime : null,
          endTime: endTime ? endTime : null,
        }),
      };
      try {
        const response = await axios.post(
          `http://localhost:8080/course/${user._id}/coursedetails`,
          {
            cname,
            hours,
            description,
            language,
            price,
            dprice,
            ...typeData,
          }
        );

        console.log(response);
        if (response.status == 200) {
          console.log("Course details submitted successfully");
          fetchCourses();
          setCname("");
          setHours("");
          setDescription("");
          setLanguage("");
          setPrice("");
          setDprice("");
          setPercentage("");
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
          formData
        );

        if (response.status === 200) {
          console.log("Course details updated successfully");
          fetchCourses(); // Fetch updated course list or details
          // Reset form fields
          setEditCourseId(null);
          setCname("");
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
    setHours(course.hours);
    setDescription(course.description);
    setLanguage(course.language);
    setPrice(course.price);
    setDprice(course.dprice);
    setCourseType(course.courseType);
    // Handling percentage and time for different types
    if (course.courseType === "percentage") {
      setPercentage(course.percentage); // Set percentage if type is "80% complete"
      setTime(""); // Clear time field if not needed
    } else if (course.courseType === "timeIntervals") {
      setTime(course.time); // Set time if type is "time to time"
      setStartTime(course.startTime); // Set start time if available
      setEndTime(course.endTime); // Set end time if available
      setPercentage(""); // Clear percentage field if not needed
    } else if (course.courseType === "all open") {
      setPercentage(""); // Clear percentage for "all open"
      setTime(""); // Clear time for "all open"
      setStartTime(""); // Clear start time for "all open"
      setEndTime(""); // Clear end time for "all open"
    }
    console.log("Edited course: ", course);
  };

  const handleDelete = async (id) => {
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
  };

  // const handlevideoSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrors({});

  //   const userId = localStorage.getItem("data.user._id");
  //   const courseId = currentCourse._id;
  //   // console.log(courseId);

  //   if (!currentCourse) {
  //     setError("No course selected.");
  //     return;
  //   }

  //   const isFormValid1 = validateForm1();

  //   if (isFormValid1) {
  //     try {
  //       const formData = new FormData();

  //       // Append data to FormData object
  //       formData.append("createdBy", userId);
  //       formData.append("courseId", currentCourse._id);
  //       formData.append("title", title);
  //       formData.append("sdescription", sdescription);
  //       formData.append("ldescription", ldescription);
  //       formData.append("tags", tags);
  //       formData.append("typev", selectedOption);

  //       if (selectedOption === "document") {
  //         formData.append("pdf", pdf);
  //         formData.append("ppt", ppt);
  //         formData.append("doc", doc);
  //       }

  //       if (selectedOption === "video") {
  //         formData.append("dvideo", dvideo ? "true" : "false");
  //         formData.append("thumbnail", thumbnail);
  //         formData.append("videofile", videofile);
  //       }

  //       const response = await axios.post(
  //         `http://localhost:8080/video/${courseId}/upload`,
  //         formData
  //         // {
  //         //   headers: {
  //         //     "Content-Type": "multipart/form-data",
  //         //   },
  //         // }
  //       );

  //       if (response.status === 200) {
  //         // Reset form fields
  //         fetchCourses();
  //         setTitle("");
  //         setSdescription("");
  //         setLdescription("");
  //         setTags([]);
  //         setDvideo("");
  //         setPdf(null);
  //         setPpt(null);
  //         setDoc(null);
  //         setThumbnail(null);
  //         setVideofile(null);
  //         setSelectedOption("");
  //       } else {
  //         setError("Unexpected response status: " + response.status);
  //       }
  //     } catch (err) {
  //       console.error("Submission failed:", err);

  //       if (err.response) {
  //         setError("Video/Document with the same details already exists.");
  //       } else if (err.request) {
  //         setError("No response from server. Please try again later.");
  //       } else {
  //         setError("Error: " + err.message);
  //       }
  //     }
  //   }
  // };

  const handlevideoSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const user = JSON.parse(localStorage.getItem("userData"));
    const courseId = currentCourse._id;

    if (!currentCourse) {
      setError("No course selected.");
      return;
    }

    const isFormValid1 = validateForm1();

    if (isFormValid1) {
      try {
        const formData = new FormData();
        formData.append("createdBy", user._id);
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

  // const filterCourses = () => {
  //   const lowercasedQuery = searchQuery.toLowerCase();
  //   const filtered = courses.filter((course) =>
  //     course.cname.toLowerCase().includes(lowercasedQuery)
  //   );
  //   setFilteredCourses(filtered);
  // };

  // const handlePrevPage = () => {
  //   setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  // };

  // const handleNextPage = () => {
  //   setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  // };

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTags((prevTags) => [...prevTags, value]);
    } else {
      setTags((prevTags) => prevTags.filter((tag) => tag !== value));
    }
  };

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
                                  htmlFor="hours"
                                  className="col-sm-4 col-form-label form-label"
                                >
                                  Hours
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
                                  data-dismiss="modal"
                                  disabled={Object.keys(errors).length !== 0}
                                >
                                  Create
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
                  {/*<div className="mb-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by course name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>*/}
                </Card.Header>
                <Table responsive className="text-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ textAlign: "center" }}>Name</th>
                      <th style={{ textAlign: "center" }}>Hours</th>
                      <th style={{ textAlign: "center" }}>Description</th>
                      <th style={{ textAlign: "center" }}>Language</th>
                      <th style={{ textAlign: "center" }}>Actual Price</th>
                      <th style={{ textAlign: "center" }}>Display Price</th>
                      <th style={{ textAlign: "center" }}>Type</th>
                      <th style={{ textAlign: "center" }}>Additional Info</th>
                      <th style={{ textAlign: "center" }}>Status</th>
                      <th style={{ textAlign: "center" }}>Created By</th>
                      <th style={{ textAlign: "center" }}>Created At</th>
                      <th style={{ textAlign: "center" }}>Updated By</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course._id}>
                        <td style={{ textAlign: "center" }}>{course.cname}</td>
                        <td style={{ textAlign: "center" }}>
                          {course.hours} Hours
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {course.description}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {course.language}
                        </td>
                        <td style={{ textAlign: "center" }}>{course.price}</td>
                        <td style={{ textAlign: "center" }}>{course.dprice}</td>
                        <td style={{ textAlign: "center" }}>
                          {course.courseType}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {course.courseType === "percentage"
                            ? `${course.percentage}%`
                            : ""}
                          {course.courseType === "timeIntervals" &&
                          course.startTime &&
                          course.endTime
                            ? `${new Date(course.startTime).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )} to ${new Date(
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
                        <td style={{ textAlign: "center" }}>{course.user}</td>
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
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-primary me-2 mb-md-0"
                            onClick={() => handleComponents(course)}
                            data-bs-toggle="modal"
                            href="#componentscourseModalToggle"
                            role="button"
                          >
                            Contents
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(course._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* <Row className="mt-3">
                  <Col className="d-flex justify-content-between">
                    <Button
                      variant="primary"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      style={{ marginLeft: "30px" }}
                    >
                      Previous
                    </Button>
                    <Pagination>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                    </Pagination>
                    <Button
                      variant="primary"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </Col>
                </Row> */}
                <Card.Footer className="bg-white text-center">
                  <Link href="#" className="link-primary">
                    View All Projects
                  </Link>
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
                    htmlFor="hours"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Hours
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
                    data-dismiss="modal"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    type="button"
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
                {/* <Row className="mb-3">
                  <label
                    htmlFor="tags"
                    className="col-sm-4 col-form-label form-label"
                  >
                    Tags
                  </label>
                  <div className="col-md-8 col-12">
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      placeholder="Tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
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
                </Row> */}

                <div className="modal-footer">
                  {error && (
                    <p className="error-message" style={{ color: "red" }}>
                      {error}
                    </p>
                  )}
                  <button
                    className="btn btn-primary"
                    type="submit"
                    data-dismiss="modal"
                  >
                    Submit
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
};

export default courselist;
