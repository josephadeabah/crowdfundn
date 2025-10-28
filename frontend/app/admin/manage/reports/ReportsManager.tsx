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
  FaEye,
  FaUser,
  FaEnvelope,
  FaLink,
  FaCalendar,
  FaFileAlt,
} from 'react-icons/fa';
import { ReportType } from '@/app/types/reports.types';
import Modal from '@/app/components/modal/Modal';

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
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    'resolve' | 'dismiss' | null
  >(null);
  const [actionNotes, setActionNotes] = useState('');

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

  const handleViewDetails = (report: ReportType) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
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
            admin_id: user?.id,
          }),
        },
      );

      if (response.ok) {
        fetchReports();
        if (selectedReport?.id === reportId) {
          setSelectedReport((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'under_review',
                  assigned_admin: { id: user!.id, name: user!.full_name },
                }
              : null,
          );
        }
      }
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  const openActionModal = (
    action: 'resolve' | 'dismiss',
    report: ReportType,
  ) => {
    setSelectedReport(report);
    setCurrentAction(action);
    setActionNotes('');
    setIsActionModalOpen(true);
  };

  const handleAction = async () => {
    if (!selectedReport || !currentAction) return;

    try {
      let response;
      if (currentAction === 'resolve') {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reports/reports/${selectedReport.id}/resolve`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action_taken: 'Issue addressed',
              resolution_notes:
                actionNotes || 'The reported issue has been resolved.',
            }),
          },
        );
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reports/reports/${selectedReport.id}/dismiss`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reason: actionNotes || 'No violation found',
            }),
          },
        );
      }

      if (response.ok) {
        fetchReports();
        setIsActionModalOpen(false);
        setCurrentAction(null);
        setActionNotes('');
        if (isDetailsModalOpen) {
          setIsDetailsModalOpen(false);
        }
      }
    } catch (error) {
      console.error(`Error ${currentAction}ing report:`, error);
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Report Details Modal Content
  const ReportDetailsModal = () => {
    if (!selectedReport) return null;

    return (
      <div className="p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Report #{selectedReport.id}
            </h2>
            <div className="flex items-center space-x-3 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReport.status)}`}
              >
                {getStatusIcon(selectedReport.status)}
                <span className="ml-1">{selectedReport.status_display}</span>
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedReport.priority)}`}
              >
                {selectedReport.priority_display} Priority
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Report Type</p>
            <p className="font-medium">{selectedReport.report_type_display}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Report Details */}
          <div className="space-y-6">
            {/* Reporter Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaUser className="w-4 h-4 mr-2" />
                Reporter Information
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{selectedReport.reporter.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium flex items-center">
                    <FaEnvelope className="w-3 h-3 mr-1" />
                    {selectedReport.reporter.email}
                  </p>
                </div>
                {selectedReport.contact_email && (
                  <div>
                    <p className="text-sm text-gray-600">Contact Email</p>
                    <p className="font-medium">
                      {selectedReport.contact_email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Report Target */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Reported{' '}
                {selectedReport.report_target_type === 'campaign'
                  ? 'Campaign'
                  : 'User'}
              </h3>
              {selectedReport.campaign && (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">Campaign Title</p>
                    <p className="font-medium">
                      {selectedReport.campaign.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fundraiser</p>
                    <p className="font-medium">
                      {selectedReport.campaign.fundraiser_name}
                    </p>
                  </div>
                </div>
              )}
              {selectedReport.reported_user && (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">User Name</p>
                    <p className="font-medium">
                      {selectedReport.reported_user.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">
                      {selectedReport.reported_user.email}
                    </p>
                  </div>
                </div>
              )}
              {/* Fallback if neither campaign nor reported_user is present but we have target name */}
              {!selectedReport.campaign &&
                !selectedReport.reported_user &&
                selectedReport.report_target_name && (
                  <div>
                    <p className="text-sm text-gray-600">Target</p>
                    <p className="font-medium">
                      {selectedReport.report_target_name}
                    </p>
                  </div>
                )}
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaCalendar className="w-4 h-4 mr-2" />
                Timeline
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reported</span>
                  <span className="font-medium">
                    {new Date(selectedReport.created_at).toLocaleDateString()}{' '}
                    at{' '}
                    {new Date(selectedReport.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {new Date(selectedReport.updated_at).toLocaleDateString()}{' '}
                    at{' '}
                    {new Date(selectedReport.updated_at).toLocaleTimeString()}
                  </span>
                </div>
                {selectedReport.resolved_at && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Resolved</span>
                    <span className="font-medium">
                      {new Date(
                        selectedReport.resolved_at,
                      ).toLocaleDateString()}{' '}
                      at{' '}
                      {new Date(
                        selectedReport.resolved_at,
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Description and Evidence */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FaFileAlt className="w-4 h-4 mr-2" />
                Report Description
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedReport.description}
              </p>
            </div>

            {/* Evidence Links */}
            {selectedReport.evidence_links &&
              selectedReport.evidence_links.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FaLink className="w-4 h-4 mr-2" />
                    Evidence Links
                  </h3>
                  <div className="space-y-2">
                    {selectedReport.evidence_links.map((link, index) => (
                      <div key={index} className="flex items-center">
                        <FaLink className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm truncate"
                        >
                          {link}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Resolution Details */}
            {selectedReport.action_taken && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">
                  Resolution Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-green-700">Action Taken</p>
                    <p className="font-medium text-green-900">
                      {selectedReport.action_taken}
                    </p>
                  </div>
                  {selectedReport.resolution_notes && (
                    <div>
                      <p className="text-sm text-green-700">Resolution Notes</p>
                      <p className="text-green-900 whitespace-pre-wrap">
                        {selectedReport.resolution_notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assigned Admin */}
            {selectedReport.assigned_admin && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Assigned Administrator
                </h3>
                <p className="text-blue-900">
                  {selectedReport.assigned_admin.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          {selectedReport.status === 'pending' && (
            <button
              onClick={() => handleAssignToMe(selectedReport.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Assign to Me
            </button>
          )}
          {selectedReport.status === 'under_review' && (
            <>
              <button
                onClick={() => openActionModal('resolve', selectedReport)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Resolve Report
              </button>
              <button
                onClick={() => openActionModal('dismiss', selectedReport)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Dismiss Report
              </button>
            </>
          )}
          <button
            onClick={() => setIsDetailsModalOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Action Modal
  const ActionModal = () => {
    if (!selectedReport || !currentAction) return null;

    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {currentAction === 'resolve' ? 'Resolve Report' : 'Dismiss Report'}
        </h2>
        <p className="text-gray-600 mb-4">
          {currentAction === 'resolve'
            ? `Are you sure you want to resolve report #${selectedReport.id}?`
            : `Are you sure you want to dismiss report #${selectedReport.id}?`}
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentAction === 'resolve'
              ? 'Resolution Notes'
              : 'Reason for Dismissal'}
          </label>
          <textarea
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              currentAction === 'resolve'
                ? 'Describe the action taken to resolve this report...'
                : 'Explain why this report is being dismissed...'
            }
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setIsActionModalOpen(false);
              setCurrentAction(null);
              setActionNotes('');
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              currentAction === 'resolve'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {currentAction === 'resolve' ? 'Resolve Report' : 'Dismiss Report'}
          </button>
        </div>
      </div>
    );
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
                    <button
                      onClick={() => handleViewDetails(report)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm flex items-center"
                    >
                      <FaEye className="w-3 h-3 mr-1" />
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
                          onClick={() => openActionModal('resolve', report)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => openActionModal('dismiss', report)}
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

      {/* Modals */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        size="xxxlarge"
      >
        <ReportDetailsModal />
      </Modal>

      <Modal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setCurrentAction(null);
          setActionNotes('');
        }}
        size="medium"
      >
        <ActionModal />
      </Modal>
    </div>
  );
};

export default ReportsManager;
