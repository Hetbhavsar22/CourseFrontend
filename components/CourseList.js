 // components/CourseList.js
import React, { useState, useEffect } from "react";
import { FaClock, FaVideo, FaChalkboardTeacher } from "react-icons/fa";
import { TbMessageLanguage } from "react-icons/tb";
import Link from "next/link";
import LoginModal from "./LoginModal";
import Form from "./form"; // Ensure the correct path

const CourseList = ({ courses }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState();
  const [countryCode, setCountryCode] = useState(91);
  const [courseId, setCourseId] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);

  // Toggle authentication state based on localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userKey = localStorage.getItem("user_key");
    setPhone(localStorage.getItem("phone_number"));
    setIsAuthenticated(token && userKey);
  }, []);

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours} hr${hours > 1 ? "s" : ""} and ${minutes} min${
      minutes > 1 ? "s" : ""
    }`;
  };

  const handlePurchase = (course) => {
    setCourseId(course._id);
    setCoursePrice(course.price);
    if (isAuthenticated) {
      setShowFormModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (token, userKey) => {
    setIsAuthenticated(true);
    localStorage.setItem("token", token);
    localStorage.setItem("user_key", userKey);
    setShowLoginModal(false);
    // setShowFormModal(true);
    window.location.reload(); 
  };

  const toggleExpandCard = (index) => {
    setExpandedCardIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      {courses.length === 0 ? (
        <div className="empty-message d-flex justify-content-center align-items-center">
          <p className="styled-empty-message">No course available!</p>
        </div>
      ) : (
        <div className="course-list">
          {courses.map((course, index) => (
            <div className="course-card" key={course._id}>
              <Link href={`/courses/${course._id}`}>
                {/* <a> */}
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${course.courseImage}`}
                  alt={course.cname}
                  className="course-image"
                />
                {/* </a> */}
              </Link>
              <div className="course-details">
                <Link href={`/courses/${course._id}`}>
                  {/* <a style={{ textDecoration: "none" }}> */}
                  <h2 className="course-title">{course.cname}</h2>
                  {/* </a> */}
                </Link>
                <Link href={`/courses/${course._id}`}>
                  {/* <a style={{ textDecoration: "none" }}> */}
                  <div
                    className={`course-description ${
                      expandedCardIndex === index ? "expanded" : ""
                    }`}
                    onClick={() => toggleExpandCard(index)}
                    dangerouslySetInnerHTML={{
                      __html: course.shortDescription,
                    }}
                  />
                  {course.shortDescription.length > 200 && (
                    <span className="read-more">
                      {expandedCardIndex === index
                        ? " Show Less"
                        : " Read More..."}
                    </span>
                  )}
                  {/* </a> */}
                </Link>
                <Link href={`/courses/${course._id}`}>
                  {/* <a style={{ textDecoration: "none" }}> */}
                  <div className="course-info">
                    <span className="info-item">
                      <FaVideo /> {course.totalVideo} Videos
                    </span>
                    <span className="info-item">
                      <FaClock /> {formatTime(course.hours)}
                    </span>
                  </div>
                  {/* </a> */}
                </Link>
                <Link href={`/courses/${course._id}`}>
                  {/* <a style={{ textDecoration: "none" }}> */}
                  <div className="course-meta">
                    <span className="course-author">
                      <FaChalkboardTeacher /> {course.author}
                    </span>
                    <span className="course-language">
                      <TbMessageLanguage /> {course.language}
                    </span>
                  </div>
                  {/* </a> */}
                </Link>
                <div className="course-price">
                  {course.isEnrolled ? (
                    <Link href={`/courses/${course._id}/learn`}>
                      {/* <a> */}
                      <button className="purchase-button">View Content</button>
                      {/* </a> */}
                    </Link>
                  ) : (
                    <button
                      className="purchase-button"
                      onClick={() => handlePurchase(course)}
                    >
                      Buy Now
                    </button>
                  )}

{/* {course.isEnrolled && course.hasCompleted && (
                    <button
                      className="purchase-button"
                      onClick={() => generateCertificate(course._id)}
                    >
                      Generate Certificate
                    </button>
                  )} */}

                  <Link href={`/courses/${course._id}`}>
                    {/* <a style={{ textDecoration: "none" }}> */}
                    <div className="price-details">
                      <span className="discounted-price">₹{course.price}</span>
                      <span className="original-price">₹{course.dprice}</span>
                    </div>
                    {/* </a> */}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          phone={phone}
          setPhone={setPhone}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Purchase Form Modal */}
      {showFormModal && (
        <Form
          phone={phone}
          setShowFormModal={setShowFormModal}
          courseId={courseId}
          amount={coursePrice}
          countryCode={countryCode}
          city={city}
          state={state}
          setState={setState}
          setCity={setCity}
          email={email}
          setEmail={setEmail}
          name={name}
          setName={setName}
        />
      )}

    </>
  );
};

export default CourseList;