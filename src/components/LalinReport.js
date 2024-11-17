import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { getLalin } from '../api';
import { useLogout } from '../hooks/useLogout';
export default function LalinReport() {
    const { logout } = useLogout();
    const [tanggal, setTanggal] = useState('2023-11-01'); // Default date
    const [lalinData, setLalinData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        if (tanggal) {
            fetchLalinData(tanggal);
        }
    }, [tanggal]);

    const fetchLalinData = async (date) => {
        try {
            const response = await getLalin(date);
            setLalinData(response.data.data.rows.rows || []);
        } catch (error) {
            console.error('Error fetching Lalin data:', error);
        }
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = lalinData.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(lalinData.length / rowsPerPage);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
            time: date.toLocaleTimeString('id-ID'),
        };
    };

   

    const handleReset = () => {
        setTanggal('2023-11-01');
        setLalinData([]);
        setCurrentPage(1);
    };

    const handleExport = () => {
        const csvRows = [];
        const headers = ['ID', 'Gerbang', 'Tanggal', 'Waktu', 'Shift', 'Tunai', 'Mandiri', 'BRI', 'BNI', 'BCA', 'Nobu', 'DKI', 'Mega', 'Flo'];
        csvRows.push(headers.join(','));

        lalinData.forEach((row) => {
            const { date, time } = formatDate(row.Tanggal);
            const rowData = [
                row.id, row.IdGerbang, date, time, row.Shift, row.Tunai, row.eMandiri, row.eBri, row.eBni,
                row.eBca, row.eNobu, row.eDKI, row.eMega, row.eFlo,
            ];
            csvRows.push('"' + rowData.join('","') + '"');
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `lalin_report_${tanggal}.csv`;
        link.click();
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-100 min-h-screen ml-5 md:ml-64 transition-all duration-300">

                {/* Navbar */}
                <header className="flex justify-between items-center bg-white p-4 shadow rounded">
                    <h1 className="text-2xl font-bold">Lalin Report</h1>
                    <button
                        onClick={logout}  // Panggil fungsi logout dari custom hook
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </header>

                {/* Content */}
                <div className="mt-6">
                    {/* Filter Section */}
                    <div className='bg-white p-4 rounded shadow mb-6 flex justify-between'>  <div>
                        <label htmlFor="tanggal" className="block text-gray-700 font-bold mb-2">
                            Pilih Tanggal:
                        </label>
                        <input
                            type="date"
                            id="tanggal"
                            value={tanggal}
                            style={{ width: '100%' }}
                            onChange={(e) => setTanggal(e.target.value)}
                            className="border px-4 py-2 rounded w-full md:w-1/3"
                        />
                    </div>
                        {/* Filter Actions */}
                        <div className='mt-5'>
                            <button
                                onClick={handleReset}
                                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleExport}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-bold mb-4">Data Lalin</h2>
                        {currentRows.length > 0 ? (
                            <div>
                                <table className="w-full border-collapse border">
                                    <thead>
                                        {/* Header Utama */}
                                        <tr className="bg-gray-200">
                                            <th className="border px-4 py-2" rowSpan="2">ID</th>
                                            <th className="border px-4 py-2" rowSpan="2">Gerbang</th>
                                            <th className="border px-4 py-2" rowSpan="2">Tanggal</th>
                                            <th className="border px-4 py-2" rowSpan="2">Waktu</th>
                                            <th className="border px-4 py-2" rowSpan="2">Shift</th>
                                            <th className="border px-4 py-2" colSpan="10">Metode Pembayaran</th>
                                        </tr>
                                        {/* Header Jenis Pembayaran */}
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2">Tunai</th>
                                            <th className="border px-4 py-2">Mandiri</th>
                                            <th className="border px-4 py-2">BRI</th>
                                            <th className="border px-4 py-2">BNI</th>
                                            <th className="border px-4 py-2">BCA</th>
                                            <th className="border px-4 py-2">Nobu</th>
                                            <th className="border px-4 py-2">DKI</th>
                                            <th className="border px-4 py-2">Mega</th>
                                            <th className="border px-4 py-2">Flo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRows.map((row) => {
                                            const { date, time } = formatDate(row.Tanggal);
                                            return (
                                                <tr key={row.id} className="hover:bg-gray-100">
                                                    <td className="border px-4 py-2">{row.id}</td>
                                                    <td className="border px-4 py-2">{row.IdGerbang}</td>
                                                    <td className="border px-4 py-2">{date}</td>
                                                    <td className="border px-4 py-2">{time}</td>
                                                    <td className="border px-4 py-2">{row.Shift}</td>
                                                    <td className="border px-4 py-2">{row.Tunai}</td>
                                                    <td className="border px-4 py-2">{row.eMandiri}</td>
                                                    <td className="border px-4 py-2">{row.eBri}</td>
                                                    <td className="border px-4 py-2">{row.eBni}</td>
                                                    <td className="border px-4 py-2">{row.eBca}</td>
                                                    <td className="border px-4 py-2">{row.eNobu}</td>
                                                    <td className="border px-4 py-2">{row.eDKI}</td>
                                                    <td className="border px-4 py-2">{row.eMega}</td>
                                                    <td className="border px-4 py-2">{row.eFlo}</td>
                                                </tr>
                                            );
                                        })}
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
                        ) : (
                            <p className="text-center text-gray-500">No data available for this date.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
