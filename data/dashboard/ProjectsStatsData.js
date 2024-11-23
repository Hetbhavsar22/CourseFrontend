import { useState, useEffect } from "react";
import axios from "axios";
import { Book, GraphUpArrow, People, PersonCheckFill, PersonXFill } from "react-bootstrap-icons";
import { Video } from "react-feather";

const ProjectsStatsData = () => {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalVideo, setTotalVideo] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeCourses, setActiveCourses] = useState(0); // New state for active courses
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [unverifiedUsers, setUnverifiedUsers] = useState(0);
  const [activeVideos, setActiveVideos] = useState(0); // New state for active courses
  const [activeUsers, setActiveUsers] = useState(0); // New state for active courses
  const [totalSales, setTotalSales] = useState(0); // New state for active courses
  const [oneMonthSales, setOneMonthSales] = useState(0); // New state for active courses

  useEffect(() => {
    const fetchdashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/dashboard-stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalCourses(response.data.totalCourses);
        setTotalVideo(response.data.totalVideos);
        setTotalUsers(response.data.totalUsers);
        setActiveCourses(response.data.activeCourses); // Set the active courses
        setVerifiedUsers(response.data.verifiedUsers);
        setUnverifiedUsers(response.data.unverifiedUsers);
        setActiveVideos(response.data.activeVideos); // Set the active courses
        setActiveUsers(response.data.activeUsers); // Set the active courses
        setTotalSales(response.data.totalSales); // Set the active courses
        setOneMonthSales(response.data.oneMonthSales); // Set the active courses

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchdashboard();
  }, []);

  return [
    {
      id: 1,
      title: "Courses",
      value: totalCourses,
      icon: <Book size={18} />,
      statInfo: `Active Courses: <span className="text-dark me-2">${activeCourses}</span>`,
    },
    {
      id: 2,
      title: "Videos",
      value: totalVideo,
      icon: <Video size={18} />,
      statInfo: `Active Videos: <span className="text-dark me-2">${activeVideos}</span>`,
    },
    {
      id: 3,
      title: "Sales",
      value: totalSales,  // Updated to show active courses
      icon: <GraphUpArrow size={18} />,
      statInfo: `Last 30 Days Sales: <span className="text-dark me-2">${oneMonthSales}</span>`,
    },
    {
      id: 4,
      title: "Total Users",
      value: totalUsers,
      icon: <People size={18} />,
      statInfo: `Active Users: <span className="text-dark me-2">${activeUsers}</span>`,
    },
    {
      id: 5,
      title: "Verified Users",
      value: verifiedUsers,
      icon: <PersonCheckFill size={18} />,
      // statInfo: `Active Users: <span className="text-dark me-2">${verifiedUsers}</span>`,
    },
    {
      id: 6,
      title: "Unverified Users",
      value: unverifiedUsers,
      icon: <PersonXFill size={18} />,
      // statInfo: `Active Users: <span className="text-dark me-2">${unverifiedUsers}</span>`,
    },
  ];
};

export default ProjectsStatsData;
