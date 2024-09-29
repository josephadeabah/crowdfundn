'use client';
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const employees = [
    {
      id: 1,
      name: 'John Doe',
      location: 'New York',
      status: 'Active',
      trustworthiness: 85,
      rating: 4.5,
      softwareProgress: 75,
    },
    {
      id: 2,
      name: 'Jane Smith',
      location: 'London',
      status: 'Inactive',
      trustworthiness: 92,
      rating: 4.8,
      softwareProgress: 90,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      location: 'Tokyo',
      status: 'Active',
      trustworthiness: 78,
      rating: 4.2,
      softwareProgress: 60,
    },
    {
      id: 4,
      name: 'Emily Brown',
      location: 'Paris',
      status: 'Active',
      trustworthiness: 88,
      rating: 4.6,
      softwareProgress: 85,
    },
    {
      id: 5,
      name: 'David Lee',
      location: 'Berlin',
      status: 'Inactive',
      trustworthiness: 95,
      rating: 4.9,
      softwareProgress: 95,
    },
    {
      id: 6,
      name: 'Sarah Wilson',
      location: 'Sydney',
      status: 'Active',
      trustworthiness: 82,
      rating: 4.4,
      softwareProgress: 70,
    },
    {
      id: 7,
      name: 'Tom Anderson',
      location: 'Chicago',
      status: 'Active',
      trustworthiness: 91,
      rating: 4.7,
      softwareProgress: 88,
    },
    {
      id: 8,
      name: 'Lucy Chen',
      location: 'Shanghai',
      status: 'Inactive',
      trustworthiness: 87,
      rating: 4.5,
      softwareProgress: 80,
    },
    {
      id: 9,
      name: 'Alex Kim',
      location: 'Seoul',
      status: 'Active',
      trustworthiness: 93,
      rating: 4.8,
      softwareProgress: 92,
    },
    {
      id: 10,
      name: 'Maria Garcia',
      location: 'Madrid',
      status: 'Active',
      trustworthiness: 89,
      rating: 4.6,
      softwareProgress: 82,
    },
    {
      id: 11,
      name: 'Robert Taylor',
      location: 'Toronto',
      status: 'Inactive',
      trustworthiness: 86,
      rating: 4.3,
      softwareProgress: 78,
    },
    {
      id: 12,
      name: 'Olivia Wang',
      location: 'Beijing',
      status: 'Active',
      trustworthiness: 94,
      rating: 4.9,
      softwareProgress: 97,
    },
    {
      id: 13,
      name: 'James Brown',
      location: 'Los Angeles',
      status: 'Active',
      trustworthiness: 81,
      rating: 4.2,
      softwareProgress: 65,
    },
    {
      id: 14,
      name: 'Emma Davis',
      location: 'Melbourne',
      status: 'Inactive',
      trustworthiness: 90,
      rating: 4.7,
      softwareProgress: 87,
    },
    {
      id: 15,
      name: 'Daniel Kim',
      location: 'Vancouver',
      status: 'Active',
      trustworthiness: 88,
      rating: 4.5,
      softwareProgress: 83,
    },
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (employeeId: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId],
    );
  };

  const renderPagination = () => {
    return (
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8 flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Employee Details
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 rounded-tl-lg">
                  <span className="sr-only">Select</span>
                </th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Trustworthiness</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2 rounded-tr-lg">Software Progress</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )
                .map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleCheckboxChange(employee.id)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                        aria-label={`Select ${employee.name}`}
                      />
                    </td>
                    <td className="px-4 py-2">{employee.id}</td>
                    <td className="px-4 py-2">{employee.name}</td>
                    <td className="px-4 py-2">{employee.location}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          employee.status === 'Active'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{employee.trustworthiness}%</td>
                    <td className="px-4 py-2">{employee.rating}</td>
                    <td className="px-4 py-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${employee.softwareProgress}%` }}
                          role="progressbar"
                          aria-valuenow={employee.softwareProgress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </div>
    </div>
  );
};

export default DataTable;
