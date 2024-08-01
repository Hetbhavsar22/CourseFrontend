import React, { Fragment, useEffect } from "react";

import { Container, Col, Row } from "react-bootstrap";

import { StatRightTopIcon } from "../../widgets";

import { ActiveProjects, Teams, TasksPerformance } from "../../sub-components";

import ProjectsStatsData from "../../data/dashboard/ProjectsStatsData";

import SignIn from './authentication/sign-in';

// import Link from "next/link";

function index() {

    useEffect(() => {
        // Ensure Bootstrap JS is initialized
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
      }, []);

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
                      class="modal fade"
                      id="exampleModalToggle"
                      aria-hidden="true"
                      aria-labelledby="exampleModalToggleLabel"
                      tabindex="-1"
                    >
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            {ProjectsStatsData.map((item, index) => {
              return (
                <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
                  <StatRightTopIcon info={item} />
                </Col>
              );
            })}
          </Row>

          {/* Active Projects  */}
          <ActiveProjects />

          <Row className="my-6">
            <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
              {/* Tasks Performance  */}
              <TasksPerformance />
            </Col>
            {/* card  */}
            <Col xl={8} lg={12} md={12} xs={12}>
              {/* Teams  */}
              <Teams />
            </Col>
          </Row>
        </Container>
      </Fragment>
    </>
  );
}

export default index;
