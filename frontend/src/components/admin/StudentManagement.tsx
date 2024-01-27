import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAdminStudentsData, logout } from "../../api-helper/api-helper";

interface Student {
  id: number;
  name: string;
  email: string;
  number: number;
  rollNumber: number;
}
const StudentManagement = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const response = await getAdminStudentsData();
        //@ts-ignore
        setStudents(response.data.students);
      } catch (error: any) {
        console.error("Error fetching student data:", error.message);
        setError("Error fetching student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentsData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response.data.message);
      localStorage.removeItem("adminId");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <button
        className="md:hidden bg-slate-800 text-white p-2 rounded-md focus:outline-none"
        onClick={toggleMenu}
      >
        &#9776; {/* Hamburger icon */}
      </button>

      <nav
        className={`bg-slate-800 text-white sticky w-full md:w-1/6 p-4 md:p-8 
        ${isMenuOpen ? "block" : "hidden"} md:block`}
      >
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-4">
          Dashboard
        </h2>

        <ul>
          <li className="mb-2 md:mb-6">
            <Link
              to="/attendance-management"
              className="bg-orange-800 block p-2 hover:bg-orange-900 rounded-md text-center"
            >
              Attendance Management
            </Link>
          </li>

          <li
            className="mb-2 md:mb-6 bg-orange-800 hover:bg-orange-900 block p-2 rounded-md text-center"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </nav>

      <div className="md:w-5/6 p-4">
        <h1 className="text-2xl font-bold mb-4">Student Management</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <div>
            <div className="mb-4">
              <label className="mb-2 p-5 font-bold text-blue-900">
                Search by Name:
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="p-2 border border-blue-500 focus:outline-none rounded-3xl focus:border-blue-700"
              />
            </div>
            <table className="table-auto w-full border-collapse border border-gray-800">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Mobile</th>
                  <th className="border p-2">Roll Number</th>
                </tr>
              </thead>
              <tbody>
                {searchTerm
                  ? filteredStudents.map((student, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{student.name}</td>
                        <td className="border p-2">{student.email}</td>
                        <td className="border p-2">{student.number}</td>
                        <td className="border p-2">{student.rollNumber}</td>
                      </tr>
                    ))
                  : students.map((student, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{student.name}</td>
                        <td className="border p-2">{student.email}</td>
                        <td className="border p-2">{student.number}</td>
                        <td className="border p-2">{student.rollNumber}</td>
                      </tr>
                    ))}
              </tbody>
            </table>

            <div className="flex justify-between mt-4">
              <button
                //onClick={handlePrevPage}
                //disabled={currentPage === 1}
                className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none"
              >
                Previous
              </button>
              <button
                //onClick={handleNextPage}
                //disabled={currentPage === totalPages}
                className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
