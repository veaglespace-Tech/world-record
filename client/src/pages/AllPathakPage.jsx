import { useState } from 'react';
import { useGetPathakListQuery, useCreatePathakMutation, useUpdatePathakMutation } from '../store/api/apiSlice';
import { useDebounce } from 'use-debounce';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  HiOutlineOfficeBuilding, HiOutlinePlus, HiOutlinePencil,
  HiOutlineRefresh, HiOutlineSearch, HiOutlineChevronLeft,
  HiOutlineChevronRight, HiOutlineUser, HiOutlineMail,
  HiOutlineLocationMarker, HiOutlinePhotograph, HiOutlineX,
  HiOutlineDownload, HiOutlineDocumentText,
} from 'react-icons/hi';

const EMPTY_FORM = {
  name: '', description: '', adminName: '', adminEmail: '', address: '',
};

export default function AllPathakPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch, isFetching } = useGetPathakListQuery({
    page, limit, search: debouncedSearch,
  });

  const pathakList = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const [createPathak, { isLoading: isCreating }] = useCreatePathakMutation();
  const [updatePathak, { isLoading: isUpdating }] = useUpdatePathakMutation();

  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  /* ── helpers ── */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setLogoFile(null);
    setLogoPreview(null);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      adminName: p.adminName || '',
      adminEmail: p.adminEmail || '',
      address: p.address || '',
    });
    setLogoFile(null);
    setLogoPreview(p.logoUrl || null);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setLogoFile(null);
    setLogoPreview(null);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError('Pathak Name is required.');
    setFormError('');

    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('description', form.description.trim());
    fd.append('adminName', form.adminName.trim());
    fd.append('adminEmail', form.adminEmail.trim());
    fd.append('address', form.address.trim());
    if (logoFile) fd.append('logo', logoFile);

    try {
      if (editingId) {
        await updatePathak({ id: editingId, formData: fd }).unwrap();
      } else {
        await createPathak(fd).unwrap();
      }
      closeForm();
    } catch (err) {
      setFormError(err?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    if (pathakList.length === 0) return;
    const exportData = pathakList.map((p, index) => ({
      'S.No': index + 1,
      'Organization Name': p.name,
      'Description': p.description || 'N/A',
      'Admin Name': p.adminName || 'N/A',
      'Admin Email': p.adminEmail || 'N/A',
      'Address': p.address || 'N/A',
      'Total Members': p._count?.users ?? p.users?.length ?? 0,
      'Created Date': new Date(p.createdAt).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pathak');
    XLSX.writeFile(workbook, 'WorldRecord_pathakData.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    if (pathakList.length === 0) return;
    const doc = new jsPDF('landscape');
    doc.setFontSize(16);
    doc.text('Guinness Book of World Record - Pathak Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableColumn = ['S.No', 'Name', 'Admin Name', 'Admin Email', 'Address', 'Members', 'Created'];
    const tableRows = pathakList.map((p, i) => [
      i + 1,
      p.name,
      p.adminName || 'N/A',
      p.adminEmail || 'N/A',
      p.address || 'N/A',
      p._count?.users ?? p.users?.length ?? 0,
      new Date(p.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [4, 110, 202] }
    });

    doc.save('WorldRecord_pathakData.pdf');
  };

  /* ── UI ── */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 card bg-base-100 shadow-sm border border-base-content/5 p-4 sm:p-6 text-center md:text-left">
        <div>
          <div className="mb-1">
            <h2 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <HiOutlineOfficeBuilding className="w-6 h-6 text-primary shrink-0" />
              All Pathak
            </h2>
          </div>
          <p className="text-sm text-base-content/50 md:ml-8">
            {total} organization{total !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
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
          <button onClick={refetch} className="btn btn-ghost border border-base-content/10 shadow-sm transition-all flex items-center justify-center gap-2" disabled={isFetching}>
            <HiOutlineRefresh className={`w-5 h-5 ${isFetching ? 'animate-spin text-primary' : 'text-base-content/50'}`} />
            Refresh
          </button>
          <button onClick={openAdd} className="btn btn-primary text-primary-content shadow-md shadow-primary/20">
            <HiOutlinePlus className="w-5 h-5" />
            Add Pathak
          </button>
        </div>
      </div>

      {/* ── Add / Edit Form Modal ── */}
      {/* ── Add / Edit Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden transform transition-all">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">
                {editingId ? 'Edit Organization Details' : 'Add New Organization'}
              </h3>
              <button type="button" onClick={closeForm} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">

                {formError && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
                    {formError}
                  </div>
                )}

                {/* Logo Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Organization Logo</label>
                  <label className="cursor-pointer group w-fit">
                    <input type="file" accept="image/*" className="sr-only" onChange={handleLogoChange} />
                    {logoPreview ? (
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-500 group-hover:border-blue-400 transition-all shadow-sm">
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Change</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1.5 group-hover:border-blue-400 group-hover:bg-blue-50 transition-all">
                        <HiOutlinePhotograph className="w-7 h-7 text-slate-400 group-hover:text-blue-500" />
                        <span className="text-xs text-slate-500 group-hover:text-blue-600 font-medium">Upload Logo</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pathak Name */}
                  <div className="form-control md:col-span-2">
                    <label className="label py-1">
                      <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Organization Name *</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                      <HiOutlineOfficeBuilding className="w-5 h-5 text-base-content/40" />
                      <input
                        type="text" name="name" placeholder="e.g. Veagle Pathak"
                        className="grow bg-transparent outline-none"
                        value={form.name} onChange={handleChange} required
                      />
                    </label>
                  </div>

                  {/* Description */}
                  <div className="form-control md:col-span-2">
                    <label className="label py-1">
                      <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Description</span>
                    </label>
                    <label className="input input-bordered flex items-start gap-3 h-auto py-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                      <textarea
                        name="description" rows={2} placeholder="Brief description (optional)"
                        className="grow bg-transparent outline-none resize-none"
                        value={form.description} onChange={handleChange}
                      />
                    </label>
                  </div>

                  {/* Admin Name */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Admin Name</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                      <HiOutlineUser className="w-5 h-5 text-base-content/40" />
                      <input
                        type="text" name="adminName" placeholder="Admin full name"
                        className="grow bg-transparent outline-none"
                        value={form.adminName} onChange={handleChange}
                      />
                    </label>
                  </div>

                  {/* Admin Email */}
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Admin Email</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                      <HiOutlineMail className="w-5 h-5 text-base-content/40" />
                      <input
                        type="email" name="adminEmail" placeholder="admin@example.com"
                        className="grow bg-transparent outline-none"
                        value={form.adminEmail} onChange={handleChange}
                      />
                    </label>
                  </div>

                  {/* Address */}
                  <div className="form-control md:col-span-2">
                    <label className="label py-1">
                      <span className="label-text text-xs font-semibold uppercase tracking-wider text-base-content/70">Address</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-3 focus-within:input-primary focus-within:ring-2 focus-within:ring-primary/20 shadow-sm transition-all bg-base-100 border-base-content/20 w-full">
                      <HiOutlineLocationMarker className="w-5 h-5 text-base-content/40" />
                      <input
                        type="text" name="address" placeholder="Full address"
                        className="grow bg-transparent outline-none"
                        value={form.address} onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-4 justify-end px-8 py-5 border-t border-base-200 bg-base-100/50 rounded-b-3xl">
                <button type="button" className="btn btn-ghost" onClick={closeForm}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-primary-content shadow-md shadow-primary/20"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? <span className="loading loading-spinner loading-sm"></span> : (editingId ? 'Update Organization' : 'Save Organization')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <label className="input input-bordered flex items-center gap-3 max-w-md focus-within:input-primary">
        <HiOutlineSearch className="w-5 h-5 text-base-content/40" />
        <input
          type="text" className="grow" placeholder="Search pathak..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </label>

      {/* Table */}
      <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : pathakList.length === 0 ? (
          <div className="text-center py-16 text-base-content/40">
            <HiOutlineOfficeBuilding className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No pathak found</p>
            <p className="text-sm mt-1">
              {debouncedSearch ? 'Try adjusting your search' : 'Click "Add Pathak" to create one'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/50 text-xs uppercase tracking-wider">
                    <th>#</th>
                    <th>Logo</th>
                    <th>Pathak Name</th>
                    <th>Admin</th>
                    <th>Address</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pathakList.map((pathakData, index) => (
                    <tr key={pathakData.id} className="hover">
                      <td className="font-mono text-base-content/50 text-sm">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td>
                        {pathakData.logoUrl ? (
                          <div className="w-10 h-10 rounded-xl overflow-hidden border border-base-content/10">
                            <img src={pathakData.logoUrl} alt={pathakData.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/30">
                            <HiOutlineOfficeBuilding className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="font-semibold">{String(pathakData.id).padStart(2, '0')} - {pathakData.name}</div>
                        {pathakData.description && (
                          <div className="text-xs text-base-content/50 max-w-[180px] truncate" title={pathakData.description}>
                            {pathakData.description}
                          </div>
                        )}
                      </td>
                      <td>
                        {pathakData.adminName ? (
                          <div>
                            <div className="text-sm font-medium">{pathakData.adminName}</div>
                            {pathakData.adminEmail && (
                              <div className="text-xs text-base-content/50">{pathakData.adminEmail}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-base-content/30 text-sm">—</span>
                        )}
                      </td>
                      <td className="text-sm text-base-content/60 max-w-[150px] truncate" title={pathakData.address}>
                        {pathakData.address || '—'}
                      </td>
                      <td className="text-base-content/50 text-sm">
                        {new Date(pathakData.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td>
                        <button
                          onClick={() => openEdit(pathakData)}
                          className="btn btn-info btn-xs text-white"
                          title="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-base-content/5">
                <span className="text-sm text-base-content/60">
                  Showing <strong>{(page - 1) * limit + 1}</strong>–<strong>{Math.min(page * limit, total)}</strong> of <strong>{total}</strong>
                </span>
                <div className="join">
                  <button className="join-item btn btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    <HiOutlineChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="join-item btn btn-sm pointer-events-none w-16">
                    {page} / {totalPages}
                  </button>
                  <button className="join-item btn btn-sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
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
