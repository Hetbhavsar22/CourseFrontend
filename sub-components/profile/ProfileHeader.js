import Link from "next/link";
import { React, useEffect, useState } from "react";
import axios from "axios";
import { Col, Row, Image } from "react-bootstrap";

const ProfileHeader = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("data.token"); // Get token from local storage

        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getUserById`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Error fetching user data");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <Row className="align-items-center">
      <Col xl={12} lg={12} md={12} xs={12}>
        {/* Bg */}
        <div
          className="pt-20 rounded-top"
          style={{
            background: "url(/images/background/profile-cover.jpg) no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="bg-white rounded-bottom smooth-shadow-sm ">
          <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
            <div className="d-flex align-items-center">
              {/* avatar */}
              <div className="avatar-xxl avatar-indicators avatar-online me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                {/* <Image
                  src={
                    user.profileImage
                      ? `/profileImage/${user.profileImage}`
                      : "/images/avatar/avatar-1.jpg"
                  }
                  className="avatar-xxl rounded-circle border border-4 border-white-color-40"
                  alt=""
                /> */}
                {/* <Image
                  src={
                    user.profileImage
                      ? user.profileImage
                      : "/images/avatar/avatar-1.jpg"
                  }
                  className="avatar-xxl rounded-circle border border-4 border-white-color-40"
                  alt="User Avatar"
                /> */}

                <Image
                  src={
                    user.profileImage
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${user.profileImage}`
                      : "/images/default-avatar.jpg"
                  }
                  className="avatar-xxl rounded-circle border border-4 border-white-color-40"
                  alt="User Avatar"
                />
                <Link
                  href="#!"
                  className="position-absolute top-0 right-0 me-2"
                  data-bs-toggle="tooltip"
                  data-placement="top"
                  title=""
                  data-original-title="Verified"
                >
                  <Image
                    src="/images/svg/checked-mark.svg"
                    alt=""
                    height="30"
                    width="30"
                  />
                </Link>
              </div>
              {/* text */}
              <div className="lh-1">
                <h2 className="mb-0">
                  {user.name}
                  <Link
                    href="#!"
                    className="text-decoration-none"
                    data-bs-toggle="tooltip"
                    data-placement="top"
                    title=""
                    data-original-title="Beginner"
                  ></Link>
                </h2>
                <p className="mb-0 d-block">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ProfileHeader;
