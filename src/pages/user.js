import React, { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Switch from "react-switch";
import { Container, Col, Row, Card, Table, Form } from "react-bootstrap";

function Video() {
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [videos, setVideos] = useState([]);
  const [editVideoId, setEditVideoId] = useState(null);
  const [title, setTitle] = useState("");
  const [sdescription, setSdescription] = useState("");
  const [ldescription, setLdescription] = useState("");
  const [dvideo, setDvideo] = useState(null);
  const [typev, setTypev] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videofile, setVideofile] = useState(null);
  const [pdf, setPdf] = useState("");
  const [ppt, setPpt] = useState("");
  const [document, setDocument] = useState("");
  const [tags, setTags] = useState("");
  const [selectedOption, setSelectedOption] = useState("pdf");
  const [errors, setErrors] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    let errors = {};

    if (!title) {
      errors.title = "Title is required.";
    }

    if (!sdescription) {
      errors.sdescription = "Short Description is required.";
    }

    if (!ldescription) {
      errors.ldescription = "Long Description is required.";
    }
    if (!tags) {
      errors.tags = "Tags is required.";
    }
    if (!selectedOption) {
      errors.typev = "Type is required.";
    } else if (selectedOption !== "document" && selectedOption !== "video") {
      errors.typev = "Invalid type selected.";
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
      if (!pdf) {
        errors.pdf = "Valid PDF file is required.";
      }
      if (!document) {
        errors.document = "Valid DOC file is required.";
      }
      if (!ppt) {
        errors.ppt = "Valid PPT file is required.";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper function to check valid file types for PDF
  // const isValidFileType = (filename) => {
  //   const allowedExtensions = ["pdf", "doc", "ppt"];
  //   const ext = filename.split(".").pop().toLowerCase();
  //   return allowedExtensions.includes(ext);
  // };

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/video/videodetails"
      );
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching video details:", error);
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
        formData.append("createdBy", userId);
        formData.append("courseId", courseId);
        formData.append("title", title);
        formData.append("sdescription", sdescription);
        formData.append("ldescription", ldescription);
        formData.append("typev", selectedOption);
        formData.append("tags", tags);

        if (selectedOption === "video") {
          if (thumbnail) formData.append("thumbnail", thumbnail);
          if (videofile) formData.append("videofile", videofile);
          if (dvideo) formData.append("dvideo", dvideo); // Uncomment if using demo video
        } else if (selectedOption === "document") {
          if (pdf) formData.append("pdf", pdf);
          if (ppt) formData.append("ppt", ppt);
          if (document) formData.append("document", document);
        }

        // Append videoId if editing an existing video
        if (editVideoId) {
          formData.append("editVideoId", editVideoId);
        }
        console.log(formData);
        const response = await axios.post(
          `http://localhost:8080/video/editvideodetails/${editVideoId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          console.log("Video details updated successfully");
          fetchVideos();
          setEditVideoId(null);
          setTitle("");
          setSdescription("");
          setLdescription("");
          setTypev("");
          setThumbnail(null);
          setVideofile(null);
          setPdf(null);
          setPpt(null);
          setDocument(null);
          setTags("");
        } else {
          setError("Unexpected response status: " + response.status);
        }
      } catch (err) {
        console.error("Update failed:", err);
        if (err.response) {
          setError("Failed to update Video details. Please try again.");
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

  const handleEdit = (video) => {
    setEditVideoId(video._id);
    setCourseId(video.courseId);
    setUserId(video.userId);
    setTitle(video.title);
    setSdescription(video.sdescription);
    setLdescription(video.ldescription);
    setDvideo(video.dvideo);
    setTypev(video.typev);
    setThumbnail(video.thumbnail);
    setVideofile(video.videofile);
    setPdf(video.pdf);
    setPpt(video.ppt);
    setDocument(video.document);
    setTags(video.tags);
    setSelectedOption(video.type || "pdf");
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/video/videodetails/${id}`
      );
      if (response.status === 200) {
        console.log("Video deleted successfully");
        fetchVideos(); // Refresh the list of videos
      } else {
        setError("Failed to delete video");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete video. Please try again.");
    }
  };

  const handleVideoChange = (e) => {
    setSelectedOption(e.target.value);

    // Reset state variables based on selected option
    if (e.target.value !== "document") {
      setPdf(null);
      setPpt(null);
      setDocument(null);
    }
    if (e.target.value !== "video") {
      setDvideo(null);
      setThumbnail(null);
      setVideofile(null);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await axios.patch(`http://localhost:8080/video/${id}/toggle`);
      fetchVideos();
    } catch (error) {
      console.error("Error toggling video status:", error);
    }
  };

  const moveVideo = async (id, direction) => {
    const currentIndex = videos.findIndex((video) => video._id === id);
    if (direction === "up" && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const updatedVideos = [...videos];
      [updatedVideos[currentIndex], updatedVideos[newIndex]] = [
        updatedVideos[newIndex],
        updatedVideos[currentIndex],
      ];
      setVideos(updatedVideos);
      // Update order in backend
      await axios.post(`http://localhost:8080/video/updateorder`, {
        videos: updatedVideos,
      });
    } else if (direction === "down" && currentIndex < videos.length - 1) {
      const newIndex = currentIndex + 1;
      const updatedVideos = [...videos];
      [updatedVideos[currentIndex], updatedVideos[newIndex]] = [
        updatedVideos[newIndex],
        updatedVideos[currentIndex],
      ];
      setVideos(updatedVideos);
      // Update order in backend
      await axios.post(`http://localhost:8080/video/updateorder`, {
        videos: updatedVideos,
      });
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
                    <h3 className="mb-0  text-white">Users</h3>
                  </div>
                  <div></div>
                </div>
              </div>
            </Col>
          </Row>
          {/* Existing Courses Table */}
          <Row className="mt-6">
            <Col md={12} xs={12}>
              <Card>
                <Card.Header className="bg-white  py-4">
                  <h4 className="mb-0">User Table</h4>
                </Card.Header>
                <Table responsive className="text-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ textAlign: "center" }}></th>
                      <th style={{ textAlign: "center" }}>User Name</th>
                      <th style={{ textAlign: "center" }}>Eamil</th>
                      {/* <th style={{ textAlign: "center" }}>Short Description</th>
                      <th style={{ textAlign: "center" }}>Long Description</th>
                      <th style={{ textAlign: "center" }}>Demo Video</th>
                      <th style={{ textAlign: "center" }}>Thumbnails</th>
                      <th style={{ textAlign: "center" }}>Videos</th>
                      <th style={{ textAlign: "center" }}>PDF</th>
                      <th style={{ textAlign: "center" }}>PPT</th>
                      <th style={{ textAlign: "center" }}>Documents</th>
                      <th style={{ textAlign: "center" }}>Tags</th> */}
                      <th style={{ textAlign: "center" }}>Status</th>
                      <th style={{ textAlign: "center" }}>Created By</th>
                      <th style={{ textAlign: "center" }}>Created At</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video, index) => (
                      <tr
                        key={video._id}
                        style={{
                          filter: video.active ? "none" : "blur(1px)",
                          opacity: video.active ? 1 : 0.6,
                          transition: "filter 0.3s ease, opacity 0.3s ease",
                        }}
                      >
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() => moveVideo(video._id, "up")}
                            disabled={index === 0} // Disable if already at the top
                            title="Move Up"
                            style={{color: 'white'}}
                          >
                            <i class="fa fa-arrow-up" aria-hidden="true"></i>
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() => moveVideo(video._id, "down")}
                            disabled={index === videos.length - 1} // Disable if already at the bottom
                            title="Move Down"
                            style={{color: 'white'}}
                          >
                            <i class="fa fa-arrow-down" aria-hidden="true"></i>
                          </button>
                        </td>
                        <td style={{ textAlign: "center" }}>{video.name}</td>
                        <td style={{ textAlign: "center" }}>{video.email}</td>
                        {/* <td style={{ textAlign: "center" }}>
                          {video.sdescription}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {video.ldescription}
                        </td>
                        <td style={{ textAlign: "center" }}>{video.dvideo}</td>
                        
                        <td style={{ textAlign: "center" }}>
                          {video.thumbnail}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {video.videofile}
                        </td>
                        <td style={{ textAlign: "center" }}>{video.pdf}</td>
                        <td style={{ textAlign: "center" }}>{video.ppt}</td>
                        <td style={{ textAlign: "center" }}>
                          {video.document}
                        </td>
                        <td style={{ textAlign: "center" }}>{video.tags}</td> */}
                        <td style={{ textAlign: "center" }}>
                          <Switch
                            checked={video.active}
                            onChange={() => handleToggleActive(video._id)}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
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
                        <td style={{ textAlign: "center" }}>{video.user}</td>
                        <td style={{ textAlign: "center" }}>
                          {new Date(video.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn btn-primary me-2 mb-md-0"
                            onClick={() => handleEdit(video)}
                            data-bs-toggle="modal"
                            href="#editVideoModalToggle"
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(video._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
      {/* Edit Video Modal */}
      <div
        className="modal fade"
        id="editVideoModalToggle"
        aria-hidden="true"
        aria-labelledby="editVideoModalToggle"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editVideoModalToggle">
                Edit Video
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
              <Form method="POST" onSubmit={handleEditSubmit}>
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
                      Document
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
                    {errors.title && (
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
                    <input
                      type="text"
                      className="form-control"
                      id="sdescription"
                      placeholder="Short Description"
                      value={sdescription}
                      onChange={(e) => setSdescription(e.target.value)}
                    />
                    {errors.sdescription && (
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
                    <input
                      type="text"
                      className="form-control"
                      id="ldescription"
                      placeholder="Long Description"
                      value={ldescription}
                      onChange={(e) => setLdescription(e.target.value)}
                    />
                    {errors.ldescription && (
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
                    <Row className="mb-3">
                      <label
                        htmlFor="document"
                        className="col-sm-4 col-form-label form-label"
                      >
                        Upload Document
                      </label>
                      <div className="col-md-8 col-12">
                        <input
                          type="file"
                          className="form-control"
                          id="document"
                          onChange={(e) => setDocument(e.target.files[0])}
                        />
                        {errors.document && (
                          <p
                            style={{
                              color: "red",
                              fontSize: "14px",
                              marginBottom: "6px",
                            }}
                          >
                            {errors.document}
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
                        {errors.dvideo && (
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
                    <input
                      type="text"
                      className="form-control"
                      id="tags"
                      placeholder="Tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                    {errors.tags && (
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
                  <button
                    className="btn btn-primary"
                    type="submit"
                    data-dismiss="modal"
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
