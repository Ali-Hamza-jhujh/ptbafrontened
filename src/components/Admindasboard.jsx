import React, { useEffect, useState } from "react";
import {
  BookOpen,
  BookCheck,
  BookX,
  BookMarked,
  Eye,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import axios from "axios";
import Alert from "./alert";
import './admin.css'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    acceptedMembers: 0,
    rejectedMembers: 0,
    pendingMembers: 0,
  });

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setalert] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all members
      const token = localStorage.getItem("token");
      console.log("Enjoy it", process.env.REACT_APP_FRONTENED_URL);
      const response = await axios.get(
        `${process.env.REACT_APP_FRONTENED_URL}/api/user/alluers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const allMembers = response.data;

      // Calculate stats
      const total = allMembers.length;
      const accepted = allMembers.filter((m) => m.isVarifield).length;
      const rejected = allMembers.filter((m) => m.isregected).length;
      const pending = allMembers.filter(
        (m) => !m.isVarifield && !m.isregected
      ).length;

      setStats({
        totalMembers: total,
        acceptedMembers: accepted,
        rejectedMembers: rejected,
        pendingMembers: pending,
      });

      setMembers(allMembers);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setalert({
        tag: "danger",
        alert1: "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (memberId) => {
    if (
      !window.confirm(
        "Are you sure you want to approve this member? An email will be sent with password setup link."
      )
    )
      return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FRONTENED_URL}/api/user/accept/${memberId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setalert({
        tag: "success",
        alert1: response.data.message || "Member approved successfully!",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to approve:", error);
      setalert({
        tag: "danger",
        alert1:
          error.response?.data?.message || "Failed to approve member",
      });
    }
  };

  const handleReject = async (memberId) => {
    if (
      !window.confirm(
        "Are you sure you want to reject this member? A rejection email will be sent."
      )
    )
      return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FRONTENED_URL}/api/user/reject/${memberId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setalert({
        tag: "success",
        alert1: response.data.message || "Member rejected successfully!",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to reject:", error);
      setalert({
        tag: "danger",
        alert1:
          error.response?.data?.message || "Failed to reject member",
      });
    }
  };

  const filteredMembers = members.filter((member) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending")
      return !member.isVarifield && !member.isregected;
    if (activeTab === "accepted") return member.isVarifield;
    if (activeTab === "rejected") return member.isregected;
    return true;
  });

  const viewMemberDetails = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Alert Component - Conditionally rendered */}
      {alert && <Alert alert={alert} />}

      <div className="admin-content-wrapper">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">
              <div className="admin-title-icon">
                <Shield size={24} />
              </div>
              BAR ASSOCIATION Admin Dashboard
            </h1>
            <p className="admin-subtitle">
              Bar Association - Member Management System
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Total Members Card */}
          <div
            onClick={() => setActiveTab("all")}
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s",
              border:
                activeTab === "all"
                  ? "2px solid #3b82f6"
                  : "2px solid transparent",
              transform:
                activeTab === "all" ? "translateY(-2px)" : "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 6px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "all") {
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <div className="stat-card-header">
              <div className="stat-card-title">Total Members</div>
              <div className="stat-card-icon">
                <BookOpen size={24} color="#3b82f6" />
              </div>
            </div>
            <div className="stat-card-value">{stats.totalMembers}</div>
            <div className="stat-card-description">
              All registered members
            </div>
          </div>

          {/* Pending Members Card - Highlighted */}
          <div
            onClick={() => setActiveTab("pending")}
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s",
              border:
                activeTab === "pending"
                  ? "2px solid #f59e0b"
                  : "2px solid transparent",
              transform:
                activeTab === "pending"
                  ? "translateY(-2px)"
                  : "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 6px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "pending") {
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <div className="stat-card-header">
              <div className="stat-card-title">Pending Requests</div>
              <div className="stat-card-icon">
                <BookMarked size={24} color="#f59e0b" />
              </div>
            </div>
            <div className="stat-card-value warning">
              {stats.pendingMembers}
            </div>
            <div className="stat-card-description">
              ⚠️ Awaiting your review
            </div>
          </div>

          {/* Accepted Members Card */}
          <div
            onClick={() => setActiveTab("accepted")}
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s",
              border:
                activeTab === "accepted"
                  ? "2px solid #10b981"
                  : "2px solid transparent",
              transform:
                activeTab === "accepted"
                  ? "translateY(-2px)"
                  : "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 6px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "accepted") {
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <div className="stat-card-header">
              <div className="stat-card-title">Accepted Members</div>
              <div className="stat-card-icon">
                <BookCheck size={24} color="#10b981" />
              </div>
            </div>
            <div className="stat-card-value success">
              {stats.acceptedMembers}
            </div>
            <div className="stat-card-description">
              Approved & verified
            </div>
          </div>

          {/* Rejected Members Card */}
          <div
            onClick={() => setActiveTab("rejected")}
            style={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s",
              border:
                activeTab === "rejected"
                  ? "2px solid #ef4444"
                  : "2px solid transparent",
              transform:
                activeTab === "rejected"
                  ? "translateY(-2px)"
                  : "translateY(0)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 6px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (activeTab !== "rejected") {
                e.currentTarget.style.boxShadow =
                  "0 1px 3px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            <div className="stat-card-header">
              <div className="stat-card-title">Rejected Members</div>
              <div className="stat-card-icon">
                <BookX size={24} color="#ef4444" />
              </div>
            </div>
            <div className="stat-card-value danger">
              {stats.rejectedMembers}
            </div>
            <div className="stat-card-description">
              Declined registrations
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="members-section">
          <div className="members-section-header">
            <div className="members-section-header-content">
              <h2 className="members-section-title">
                {activeTab === "all" && "📋 All Members"}
                {activeTab === "pending" && "⏳ Pending Requests"}
                {activeTab === "accepted" && "✅ Accepted Members"}
                {activeTab === "rejected" && "❌ Rejected Members"}
                <span className="members-count">
                  ({filteredMembers.length})
                </span>
              </h2>

              {/* Tab Filters */}
              <div className="tab-filters">
                <button
                  onClick={() => setActiveTab("pending")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      activeTab === "pending" ? "#f59e0b" : "#e5e7eb",
                    color: activeTab === "pending" ? "white" : "#374151",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                >
                  Pending ({stats.pendingMembers})
                </button>

                <button
                  onClick={() => setActiveTab("accepted")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      activeTab === "accepted" ? "#10b981" : "#e5e7eb",
                    color: activeTab === "accepted" ? "white" : "#374151",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                >
                  Accepted ({stats.acceptedMembers})
                </button>

                <button
                  onClick={() => setActiveTab("rejected")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      activeTab === "rejected" ? "#ef4444" : "#e5e7eb",
                    color: activeTab === "rejected" ? "white" : "#374151",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                >
                  Rejected ({stats.rejectedMembers})
                </button>

                <button
                  onClick={() => setActiveTab("all")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      activeTab === "all" ? "#3b82f6" : "#e5e7eb",
                    color: activeTab === "all" ? "white" : "#374151",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                >
                  All ({stats.totalMembers})
                </button>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>CNIC</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Bar Reg.</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <BookOpen size={64} />
                        </div>
                        <div className="empty-state-title">
                          No members found
                        </div>
                        <div className="empty-state-description">
                          {activeTab === "pending" &&
                            "No pending requests at the moment"}
                          {activeTab === "accepted" &&
                            "No accepted members yet"}
                          {activeTab === "rejected" &&
                            "No rejected members"}
                          {activeTab === "all" &&
                            "No members in the system"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member, index) => (
                    <tr key={index}>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>{member.cnic}</td>
                      <td>{member.phone}</td>
                      <td>{member.city || "N/A"}</td>
                      <td>{member.barRegister || "N/A"}</td>
                      <td>
                        {member.isVarifield ? (
                          <span className="status-badge accepted">
                            <CheckCircle size={14} /> Accepted
                          </span>
                        ) : member.isregected ? (
                          <span className="status-badge rejected">
                            <XCircle size={14} /> Rejected
                          </span>
                        ) : (
                          <span className="status-badge pending">
                            ⏳ Pending
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {!member.isVarifield && !member.isregected && (
                            <>
                              <button
                                onClick={() => handleApprove(member._id)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                  padding: "0.375rem 0.75rem",
                                  backgroundColor: "#10b981",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  cursor: "pointer",
                                  fontSize: "0.8125rem",
                                  fontWeight: "500",
                                  transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#059669")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#10b981")
                                }
                              >
                                <CheckCircle size={14} /> Approve
                              </button>

                              <button
                                onClick={() => handleReject(member._id)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                  padding: "0.375rem 0.75rem",
                                  backgroundColor: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  cursor: "pointer",
                                  fontSize: "0.8125rem",
                                  fontWeight: "500",
                                  transition: "background-color 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#dc2626")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#ef4444")
                                }
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </>
                          )}
                          {member.role !== "admin" && (
                            <button
                              onClick={() => viewMemberDetails(member)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                                padding: "0.375rem 0.75rem",
                                backgroundColor: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                fontSize: "0.8125rem",
                                fontWeight: "500",
                                transition: "background-color 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#2563eb")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#3b82f6")
                              }
                            >
                              <Eye size={14} /> View
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for viewing member details */}
        {showModal && selectedMember && (
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "white",
                borderRadius: "0.5rem",
                padding: "2rem",
                maxWidth: "600px",
                width: "90%",
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "2px solid #f3f4f6",
                }}
              >
                <h3 className="modal-title">Member Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "#e5e7eb",
                    border: "none",
                    borderRadius: "0.375rem",
                    padding: "0.5rem",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <DetailRow label="Name" value={selectedMember.name} />
                <DetailRow label="Email" value={selectedMember.email} />
                <DetailRow label="CNIC" value={selectedMember.cnic} />
                <DetailRow label="Phone" value={selectedMember.phone} />
                <DetailRow
                  label="City"
                  value={selectedMember.city || "N/A"}
                />
                <DetailRow
                  label="Bar Registration"
                  value={selectedMember.barRegister || "N/A"}
                />

                <div className="modal-status-section">
                  <div className="detail-label">Status:</div>
                  <div style={{ marginTop: "0.5rem" }}>
                    {selectedMember.isVarifield ? (
                      <span className="status-badge accepted">
                        <CheckCircle size={14} /> Verified & Accepted
                      </span>
                    ) : selectedMember.isregected ? (
                      <span className="status-badge rejected">
                        <XCircle size={14} /> Rejected
                      </span>
                    ) : (
                      <span className="status-badge pending">
                        ⏳ Pending Approval
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons in modal */}
                {!selectedMember.isVarifield &&
                  !selectedMember.isregected && (
                    <div className="modal-actions">
                      <button
                        onClick={() => {
                          handleApprove(selectedMember._id);
                          setShowModal(false);
                        }}
                        style={{
                          flex: 1,
                          padding: "0.75rem 1.5rem",
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Approve Member
                      </button>

                      <button
                        onClick={() => {
                          handleReject(selectedMember._id);
                          setShowModal(false);
                        }}
                        style={{
                          flex: 1,
                          padding: "0.75rem 1.5rem",
                          backgroundColor: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Reject Member
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for modal details
const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <div className="detail-label">{label}</div>
    <div className="detail-value">{value}</div>
  </div>
);

export default AdminDashboard;