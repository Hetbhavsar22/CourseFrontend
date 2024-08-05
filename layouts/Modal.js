import React, { useState } from "react";
import styled from "styled-components";
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const Modal = styled.div`
  background-color: #f1f1f1;
  border-radius: 12px;
  padding: 20px;
  margin: 50px;
  width: 80%;
  max-width: 600px;
  height: auto;
  max-height: 80vh;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #888;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
`;

const ModalContent = styled.div`
  height: calc(100% - 110px);
  overflow-y: auto;
  position: relative;
`;

const ModalInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const ModalButton = styled.button`
  background-color: #e75b82;
  color: #fff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  transition: background-color 0.3s;
  font-size: 16px;

  &:hover {
    background-color: #005582;
  }
`;

const CancelIcon = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  cursor: pointer;
  color: #888;
`;

const AddPostModal = () => {
  const handleClose = () => {
    setContent("");
    setImage(null);
    onClose();
  };

  return (
    <ModalOverlay>
      <Modal>
        <ModalHeader>
          <ModalTitle>New Course</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>
        <ModalContent>
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
                  onChange={(e) => setDescription(e.target.value)}
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
                  onChange={(e) => setLanguage(e.target.value)}
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
              <label className="col-sm-4 col-form-label form-label">Type</label>
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
            {error && (
              <p className="error-message" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={handlecourseSubmit}
                data-bs-dismiss={submissionSuccess ? "modal" : undefined}
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
        </ModalContent>
        <ModalActions>
          <ModalButton>Post</ModalButton>
        </ModalActions>
      </Modal>
    </ModalOverlay>
  );
};

export default AddPostModal;
