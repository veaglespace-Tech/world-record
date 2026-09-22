import { useState } from 'react';
import { useGetPataksQuery, useCreatePatakMutation, useUpdatePatakMutation } from '../store/api/apiSlice';
import { useDebounce } from 'use-debounce';
import {
  HiOutlineOfficeBuilding,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';

export default function AllPataksPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch, isFetching } = useGetPataksQuery({
    page,
    limit,
    search: debouncedSearch,
  });

  const pataks = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const [createPatak, { isLoading: isCreating }] = useCreatePatakMutation();
  const [updatePatak, { isLoading: isUpdating }] = useUpdatePatakMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const openFormForAdd = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setShowForm(true);
  };

  const openFormForEdit = (patak) => {
    setEditingId(patak.id);
    setName(patak.name);
    setDescription(patak.description || '');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await updatePatak({
          id: editingId,
          data: { name: name.trim(), description: description.trim() || null }
        }).unwrap();
      } else {
        await createPatak({ 
          name: name.trim(), 
          description: description.trim() || null 
        }).unwrap();
      }
      closeForm();
    } catch (error) {
      console.error('Failed to save patak:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <HiOutlineOfficeBuilding className="w-5 h-5 text-success" />
            </div>
            All Pataks
          </h2>
          <p className="text-base-content/60 mt-1 ml-13">
            Showing {pataks.length} of {total} total organization{total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={refetch} className="btn btn-info btn-sm text-white gap-2" disabled={isFetching}>
            <HiOutlineRefresh className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={openFormForAdd}
            className="btn btn-success btn-sm text-white gap-2"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add Patak
          </button>
        </div>
      </div>

      {/* Form Card (Add/Edit) */}
      {showForm && (
        <div className="card bg-base-100 border border-primary/20 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold mb-3">
              {editingId ? 'Edit Patak / Organization' : 'Add New Patak / Organization'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Name *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered focus:input-primary"
                  placeholder="Enter patak / organization name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered focus:textarea-primary"
                  placeholder="Enter description (optional)"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success text-white btn-sm"
                  disabled={isCreating || isUpdating}
                >
                  {(isCreating || isUpdating) ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    editingId ? 'Update Patak' : 'Save Patak'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="form-control">
        <label className="input input-bordered flex items-center gap-3 max-w-md focus-within:input-primary">
          <HiOutlineSearch className="w-5 h-5 text-base-content/40" />
          <input
            type="text"
            className="grow"
            placeholder="Search pataks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </label>
      </div>

      {/* Pataks List */}
      <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : pataks.length === 0 ? (
          <div className="text-center py-16 text-base-content/40">
            <HiOutlineOfficeBuilding className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No pataks found</p>
            <p className="text-sm mt-1">
              {debouncedSearch ? 'Try adjusting your search' : 'Click "Add Patak" to create one'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200/50">
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pataks.map((patak, index) => (
                    <tr key={patak.id} className="hover">
                      <td className="font-mono text-base-content/50 text-sm">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="font-medium">{patak.name}</td>
                      <td className="text-base-content/70 max-w-xs truncate" title={patak.description}>
                        {patak.description || '—'}
                      </td>
                      <td className="text-base-content/50 text-sm">
                        {new Date(patak.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <button
                          onClick={() => openFormForEdit(patak)}
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
