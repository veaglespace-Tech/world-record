import { useState } from 'react';
import { useGetUsersQuery } from '../store/api/apiSlice';
import { useDebounce } from 'use-debounce';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineDownload,
  HiOutlineDocumentText,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePhotograph,
  HiOutlineIdentification
} from 'react-icons/hi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AllUsersPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filter, setFilter] = useState('');

  const { data, isLoading, refetch, isFetching } = useGetUsersQuery({
    page,
    limit,
    search: debouncedSearch,
    filter,
  });

  const users = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Change page handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    if (users.length === 0) return;
    
    // Prepare data
    const exportData = users.map((user, index) => ({
      'S.No': (page - 1) * limit + index + 1,
      'Full Name': user.fullName,
      'Email': user.email,
      'Phone': user.phone,
      'DOB': user.dob || 'N/A',
      'Gender': user.gender || 'N/A',
      'Blood Group': user.bloodGroup || 'N/A',
      'Aadhar No': user.aadharNo || 'N/A',
      'Address': user.address || 'N/A',
      'Organization (Patak)': user.patak?.name || 'N/A',
      'Registered Date': new Date(user.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'WorldRecord_Users.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    if (users.length === 0) return;

    const doc = new jsPDF('landscape');
    
    // Header
    doc.setFontSize(16);
    doc.text('World Record - Users Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Table Data
    const tableColumn = ["S.No", "Full Name", "Phone", "DOB", "Gender", "B.Group", "Patak", "Registered"];
    const tableRows = users.map((user, index) => [
      (page - 1) * limit + index + 1,
      user.fullName,
      user.phone,
      user.dob || 'N/A',
      user.gender || 'N/A',
      user.bloodGroup || 'N/A',
      user.patak?.name || 'N/A',
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [4, 110, 202] }
    });

    doc.save('WorldRecord_Users.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <HiOutlineUsers className="w-5 h-5 text-info" />
            </div>
            All Users
          </h2>
          <p className="text-base-content/60 mt-1 ml-13">
            Showing {users.length} of {total} total user{total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-success text-white btn-sm gap-2">
              <HiOutlineDownload className="w-4 h-4" />
              Export
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 mt-2 border border-base-content/10">
              <li><button onClick={exportToExcel}><HiOutlineDocumentText className="w-4 h-4" /> Excel (.xlsx)</button></li>
              <li><button onClick={exportToPDF}><HiOutlineDocumentText className="w-4 h-4 text-error" /> PDF (.pdf)</button></li>
            </ul>
          </div>
          <button onClick={refetch} className="btn btn-info btn-sm text-white gap-2" disabled={isFetching}>
            <HiOutlineRefresh className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="form-control flex-1">
          <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
            <HiOutlineSearch className="w-5 h-5 text-base-content/40" />
            <input
              type="text"
              className="grow"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset page on search
              }}
            />
          </label>
        </div>
        
        <div className="form-control w-full sm:w-auto">
          <select 
            className="select select-bordered"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Users</option>
            <option value="has_address">With Address</option>
            <option value="no_address">No Address</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-base-content/40">
            <HiOutlineUsers className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm mt-1">
              {debouncedSearch || filter ? 'Try adjusting your search or filters' : 'Share your referral link to get users'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full whitespace-nowrap">
                <thead>
                  <tr className="bg-base-200/50">
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Contact</th>
                    <th>Patak</th>
                    <th>Details</th>
                    <th>Documents</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="hover">
                      <td className="font-mono text-base-content/50 text-sm">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full bg-base-300">
                              {user.passportPhoto ? (
                                <img 
                                  src={user.passportPhoto.startsWith('http') ? user.passportPhoto : `${API_URL}/uploads/${user.passportPhoto}`} 
                                  alt={user.fullName} 
                                  className="object-cover w-full h-full rounded-full" 
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold">
                                  {user.fullName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-xs text-base-content/50">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{user.phone}</div>
                        <div className="text-xs text-base-content/50 truncate max-w-[150px]" title={user.address}>
                          {user.address || 'No Address'}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-primary badge-outline badge-sm font-medium">
                          {user.patak?.name || 'Unassigned'}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="text-base-content/70">DOB: <span className="font-medium text-base-content">{user.dob || '—'}</span></span>
                          <span className="text-base-content/70">Gender: <span className="font-medium text-base-content">{user.gender || '—'}</span></span>
                          <span className="text-base-content/70">Blood: <span className="font-medium text-error">{user.bloodGroup || '—'}</span></span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-2">
                          <div className="text-xs font-mono bg-base-200 px-2 py-1 rounded inline-block w-max">
                            {user.aadharNo || 'No Aadhar'}
                          </div>
                          {user.aadharImage && (
                            <a 
                              href={user.aadharImage.startsWith('http') ? user.aadharImage : `${API_URL}/uploads/${user.aadharImage}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1 w-max"
                            >
                              <HiOutlineIdentification className="w-4 h-4" /> View Aadhar
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-base-content/5 bg-base-100">
                <span className="text-sm text-base-content/60">
                  Showing <span className="font-medium text-base-content">{(page - 1) * limit + 1}</span> to <span className="font-medium text-base-content">{Math.min(page * limit, total)}</span> of <span className="font-medium text-base-content">{total}</span> results
                </span>
                
                <div className="join">
                  <button 
                    className="join-item btn btn-sm"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    <HiOutlineChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <button className="join-item btn btn-sm pointer-events-none w-16">
                    {page} / {totalPages}
                  </button>
                  
                  <button 
                    className="join-item btn btn-sm"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    <HiOutlineChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
