import React, { useEffect, useState } from 'react';
import { getGerbangs, createGerbang, updateGerbang, deleteGerbang } from '../api';
import Sidebar from './Sidebar';
import { FaSearch } from 'react-icons/fa'; // Jika menggunakan react-icons
import { useLogout } from '../hooks/useLogout';
import { Modal, notification } from 'antd';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Import icons


export default function GerbangMaster() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [newGerbang, setNewGerbang] = useState({ NamaGerbang: '', NamaCabang: '', id: '', IdCabang: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGerbang, setSelectedGerbang] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const rowsPerPage = 5;
    const { logout } = useLogout();
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {

        if (searchQuery) {
            setFilteredData(
                data.filter(
                    (row) =>
                        row.NamaGerbang.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        row.NamaCabang.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredData(data);
        }
    }, [searchQuery, data]);


    const fetchData = async () => {
        try {
            const response = await getGerbangs();
            setData(response.data.data.rows.rows);
            setFilteredData(response.data.data.rows.rows);
        } catch (error) {
            console.error('Failed to fetch gerbang data:', error);
        }
    };

    const handleDelete = (gerbang) => {
        if (!gerbang || !gerbang.id) {
            notification.error({
                message: 'Delete Failed',
                description: 'Invalid Gerbang ID for deletion.',
            });
            return;
        }

        Modal.confirm({
            title: 'Apakah Anda yakin ingin menghapus gerbang?',
            okText: 'Ya',
            cancelText: 'Batal',
            onOk: async () => {
                const payload = {
                    id: gerbang.id,
                    IdCabang: gerbang.IdCabang, // Include IdCabang
                };

                try {
                    // Call the delete API
                    await deleteGerbang(payload);
                    notification.success({
                        message: 'Delete Successful',
                        description: 'Gerbang deleted successfully!',
                    });
                    fetchData(); // Refresh the data after deletion
                } catch (error) {
                    notification.error({
                        message: 'Delete Failed',
                        description: `Delete failed: ${error.message}`,
                    });
                }
            },
            onCancel: () => {
                console.log('Delete action cancelled'); // Optional: log cancel action
            }
        });
    };

    const handleCreateOrUpdate = async () => {
        // Validate required fields
        if (!newGerbang.id || !newGerbang.IdCabang || !newGerbang.NamaGerbang || !newGerbang.NamaCabang) {
            // Show error notification if required fields are missing
            notification.error({
                message: 'Validation Error',
                description: 'Id Gerbang, Id Cabang, Nama Gerbang, and Nama Cabang are required.',
            });
            return;
        }

        try {
            if (selectedGerbang) {
                // Update Gerbang
                await updateGerbang({ ...newGerbang, id: selectedGerbang.id });
                notification.success({
                    message: 'Update Successful',
                    description: 'Gerbang updated successfully!',
                });
            } else {
                // Create Gerbang
                await createGerbang(newGerbang);
                notification.success({
                    message: 'Create Successful',
                    description: 'Gerbang created successfully!',
                });
            }
            fetchData();
            setIsModalOpen(false);
            setSelectedGerbang(null);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: `Error: ${error.message}`,
            });
        }
    };


    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);


    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen ml-5 md:ml-64 transition-all duration-300">
                <header className="flex justify-between items-center bg-white p-4 shadow rounded">
                    <h1 className="text-2xl font-bold">Gerbang Master</h1>
                    <div>
                        <button
                            onClick={logout}  // Panggil fungsi logout dari custom hook
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Alert Message */}
                {alertMessage && (
                    <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
                        {alertMessage}
                    </div>
                )}
                <div className="mt-6">
                    <div className='bg-white p-4 rounded shadow mb-6 flex justify-between'>  <div>
                        <div className="flex items-center border px-4 py-2 mb-2 rounded w-full">
                            <input
                                type="text"
                                placeholder="Search Gerbang"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border-none outline-none pr-10" // W-full untuk mengambil semua ruang input, pr-10 untuk ruang ikon
                            />
                            <FaSearch className=" right-3 text-gray-500" />
                        </div>
                    </div>
                        {/* Filter Actions */}
                        <div className='mt-1'>
                            <button
                                className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Add Gerbang
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <table className="w-full border">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Nama Gerbang</th>
                                    <th className="border px-4 py-2">Nama Cabang</th>
                                    <th className="border px-4 py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((row, index) => (
                                    <tr key={row.id} >

                                        <td className="border px-4 py-2 text-center">{row.id}</td>
                                        <td className="border px-4 py-2 text-center">{row.NamaGerbang}</td>
                                        <td className="border px-4 py-2 text-center">{row.NamaCabang}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded lg:mr-2"
                                                onClick={() => {
                                                    setSelectedGerbang(row);
                                                    setNewGerbang({
                                                        NamaGerbang: row.NamaGerbang,
                                                        NamaCabang: row.NamaCabang,
                                                        id: row.id,
                                                        IdCabang: row.IdCabang || '',
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <FaEdit /> {/* Edit icon */}
                                            </button>

                                            <button
                                                className="bg-red-500 text-white p-2 rounded"
                                                onClick={() => handleDelete(row)} // Pass the row directly to handleDelete
                                            >
                                                <FaTrashAlt /> {/* Delete icon */}
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                        {/* Pagination */}
                        <div className="flex justify-center items-center mt-4">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled disabled:cursor-not-allowed mx-1"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`px-4 py-2 rounded mx-1 ${currentPage === index + 1 ? 'bg-[#244786] text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled disabled:cursor-not-allowed mx-1"
                            >
                                Next
                            </button>
                        </div>

                    </div>
                </div>

                {/* Modal for Create or Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4">
                            <h3 className="text-xl mb-4">
                                {selectedGerbang ? 'Update Gerbang' : 'Add Gerbang'}
                            </h3>

                            {/* Id Gerbang - Hidden on Update */}
                            {!selectedGerbang && (
                                <div className="mb-4">
                                    <label className="block text-gray-700">Id Gerbang</label>
                                    <input
                                        type="number"  // Ensure it's a number input
                                        value={newGerbang.id}
                                        onChange={(e) =>
                                            setNewGerbang({
                                                ...newGerbang,
                                                id: parseInt(e.target.value, 10) // Convert to integer
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                            )}

                            {/* Id Cabang - Hidden on Update */}
                            {!selectedGerbang && (
                                <div className="mb-4">
                                    <label className="block text-gray-700">Id Cabang</label>
                                    <input
                                        type="number"  // Ensure it's a number input
                                        value={newGerbang.IdCabang}
                                        onChange={(e) =>
                                            setNewGerbang({
                                                ...newGerbang,
                                                IdCabang: parseInt(e.target.value, 10) // Convert to integer
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700">Nama Gerbang</label>
                                <input
                                    type="text"
                                    value={newGerbang.NamaGerbang}
                                    onChange={(e) =>
                                        setNewGerbang({ ...newGerbang, NamaGerbang: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Nama Cabang</label>
                                <input
                                    type="text"
                                    value={newGerbang.NamaCabang}
                                    onChange={(e) =>
                                        setNewGerbang({ ...newGerbang, NamaCabang: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={handleCreateOrUpdate}
                                >
                                    {selectedGerbang ? 'Update' : 'Create'}
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
