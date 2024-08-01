// import node module libraries
import { Col, Row, Card } from "react-bootstrap";
import { React, useEffect, useState } from "react";
import axios from 'axios';
import { getCookie } from 'cookies-next';

const AboutMe = () => {
  const [user, setUser] = useState([]);

    useEffect(() => {
      const userId = getCookie("userId"); 

    if (userId) {
      axios
        .get(`http://localhost:8080/getUserById?userId=${userId}`)
        .then((response) => setUser(response.data))
        .catch((err) => console.log(err));
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <Col xl={6} lg={12} md={12} xs={12} className="mb-6">
      {/* card */}
      <Card>
        {/* card body */}
        <Card.Body>
          {/* card title */}
          <Card.Title as="h4">About Me</Card.Title>
          <span className="text-uppercase fw-medium text-dark fs-5 ls-2">
            Bio
          </span>
          <p className="mt-2 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspen
            disse var ius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare, eros dolor interdum nulla, ut commodo diam libero
            vitae erat.
          </p>
          <Row>
            <Col xs={12} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Position</h6>
              <p className="mb-0">Theme designer at Bootstrap.</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Phone </h6>
              <p className="mb-0">+32112345689</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Date of Birth </h6>
              <p className="mb-0">01.10.1997</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Email </h6>
                <p className="mb-0">{user.email}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Location</h6>
              <p className="mb-0">Ahmedabad, India</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default AboutMe;
