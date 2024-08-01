import { Book, Search, GraphUp } from "react-bootstrap-icons";
import { Video } from "react-feather";

export const ProjectsStats = [
  {
    id: 1,
    title: "Courses",
    value: 18,
    icon: <Book size={18} />,
    statInfo: '<span className="text-dark me-2">2</span> Completed',
  },
  {
    id: 2,
    title: "Active Course",
    value: 132,
    icon: <Search size={18} />,
    statInfo: '<span className="text-dark me-2">28</span> Completed',
  },
  {
    id: 3,
    title: "Videos",
    value: 12,
    icon: <Video size={18} />,
    statInfo: '<span className="text-dark me-2">1</span> Completed',
  },
  {
    id: 4,
    title: "Productivity",
    value: "76%",
    icon: <GraphUp size={18} />,
    statInfo: '<span className="text-dark me-2">5%</span> Completed',
  },
];
export default ProjectsStats;
