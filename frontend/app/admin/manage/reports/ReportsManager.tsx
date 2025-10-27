'use client';
import { useAuth } from '@/app/context/auth/AuthContext';
import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaCheck,
  FaClock,
  FaTimes,
} from 'react-icons/fa';
import { ReportType } from '@/app/types/reports.types';

const ReportsManager = () => {
  const { token, user } = useAuth();
  const [reports, setReports] = useState<ReportType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    report_type: '',
    priority: '',
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
  });

  useEffect(() => {
    fetchReports();
  }, [pagination.current_page, filters, searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.current_page.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.report_type && { report_type: filters.report_type }),
        ...(filters.priority && { priority: filters.priority }),
        ...(searchTerm && { search: searchTerm }),
      });

      // CORRECTED ENDPOINT: Using the new reports namespace
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reports/reports?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
        setPagination(data.pagination);
      } else if (response.status === 401) {
        console.error('Unauthorized - please check admin permissions');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async (reportId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reports/reports/${reportId}/assign`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin_id: user?.id, // You'll need to implement this function
          }),
        },
      );

      if (response.ok) {
        // Refresh the reports list
        fetchReports();
      }
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  const handleResolve = async (
    reportId: number,
    actionTaken: string,
    resolutionNotes?: string,
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reports/reports/${reportId}/resolve`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action_taken: actionTaken,
            resolution_notes: resolutionNotes,
          }),
        },
      );

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const handleDismiss = async (reportId: number, reason?: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reports/reports/${reportId}/dismiss`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: reason,
          }),
        },
      );

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error dismissing report:', error);
    }
  };

  // Helper function to get current admin ID (you'll need to implement this based on your auth system)
  const getCurrentAdminId = () => {
    // This should return the current user's ID if they're an admin
    // You might need to decode the JWT token or get it from your auth context
    return 1; // Replace with actual implementation
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'under_review':
        return <FaExclamationTriangle className="text-blue-500" />;
      case 'resolved':
        return <FaCheck className="text-green-500" />;
      case 'dismissed':
        return <FaTimes className="text-gray-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reports Management
        </h1>
        <p className="text-gray-600">
          Review and manage user-submitted reports
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FaExclamationTriangle className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-500">
              No reports match your current filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(report.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {report.report_type_display}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(report.priority)}`}
                    >
                      {report.priority_display}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {report.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Reporter:</span>{' '}
                    {report.reporter.name} ({report.reporter.email})
                  </div>

                  {report.campaign && (
                    <div>
                      <span className="font-medium">Campaign:</span>{' '}
                      {report.campaign.title}
                    </div>
                  )}

                  {report.reported_user && (
                    <div>
                      <span className="font-medium">Reported User:</span>{' '}
                      {report.reported_user.name}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Status: {report.status_display}</span>
                    {report.assigned_admin && (
                      <>
                        <span>•</span>
                        <span>Assigned to: {report.assigned_admin.name}</span>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm">
                      View Details
                    </button>
                    {report.status === 'pending' && (
                      <button
                        onClick={() => handleAssignToMe(report.id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                      >
                        Assign to Me
                      </button>
                    )}
                    {report.status === 'under_review' && (
                      <>
                        <button
                          onClick={() =>
                            handleResolve(
                              report.id,
                              'Issue addressed',
                              'The reported issue has been resolved.',
                            )
                          }
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() =>
                            handleDismiss(report.id, 'No violation found')
                          }
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                current_page: prev.current_page - 1,
              }))
            }
            disabled={pagination.current_page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {pagination.current_page} of {pagination.total_pages}
          </span>

          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                current_page: prev.current_page + 1,
              }))
            }
            disabled={pagination.current_page === pagination.total_pages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsManager;
