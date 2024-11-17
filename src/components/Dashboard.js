import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { useLogout } from '../hooks/useLogout';
import Sidebar from './Sidebar';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [tanggal, setTanggal] = useState("2023-11-01");  // Default tanggal
    const [gerbangData, setGerbangData] = useState([]);
    const [lalinData, setLalinData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { logout } = useLogout();

    // Fetch Gerbang Data
    const fetchGerbangData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/gerbangs");
            setGerbangData(response.data.data.rows.rows || []);
        } catch (error) {
            console.error("Error fetching gerbang data:", error);
            setGerbangData([]);
        }
    };

    // Fetch Lalin Data
    const fetchLalinData = async () => {
        if (!tanggal) return;
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/lalins", {
                params: { tanggal },
            });
            console.log("Lalin Data: ", response.data);  // Debugging untuk memeriksa data
            setLalinData(response.data.data.rows.rows || []);
        } catch (error) {
            console.error("Error fetching lalin data:", error);
            setLalinData([]);
        } finally {
            setLoading(false);
        }
    };

    // Prepare Data for Payment Methods Bar Chart
    const preparePaymentMethodData = () => {
        if (!Array.isArray(lalinData)) return { labels: [], datasets: [] };

        const methods = ["eBca", "eBri", "eBni", "eDKI", "eMandiri", "eFlo", "DinasKary"];
        const totals = methods.map((method) =>
            lalinData.reduce((acc, row) => acc + (row[method] || 0), 0)
        );

        return {
            labels: methods,
            datasets: [
                {
                    label: "Jumlah Lalin per Metode Pembayaran",
                    data: totals,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    // Prepare Data for Gerbang Bar Chart
    const prepareGerbangData = () => {
        if (!Array.isArray(gerbangData) || !Array.isArray(lalinData)) return { labels: [], datasets: [] };

        const gerbangNames = gerbangData.map((gerbang) => gerbang.NamaGerbang);
        const totals = gerbangNames.map((gerbangName) =>
            lalinData.filter((row) => gerbangData.find((g) => g.NamaGerbang === gerbangName && g.id === row.IdGerbang))
                .length
        );

        return {
            labels: gerbangNames,
            datasets: [
                {
                    label: "Jumlah Lalin per Gerbang",
                    data: totals,
                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                    borderColor: "rgba(255, 159, 64, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    // Prepare Data for Shift Doughnut Chart
    const prepareShiftData = () => {
        if (!Array.isArray(lalinData)) return { labels: [], datasets: [] };

        const shifts = [1, 2, 3];
        const totals = shifts.map((shift) =>
            lalinData.filter((row) => row.Shift === shift).length
        );

        return {
            labels: ["Shift 1", "Shift 2", "Shift 3"],
            datasets: [
                {
                    data: totals,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                },
            ],
        };
    };

    // Prepare Data for Lalin per Ruas Doughnut Chart
    const prepareLalinPerRuas = () => {
        if (!Array.isArray(lalinData) || !Array.isArray(gerbangData)) return { labels: [], datasets: [] };

        const cabangNames = [...new Set(gerbangData.map(row => row.NamaCabang))];
        const totals = cabangNames.map((cabang) => {
            return lalinData.filter((row) =>
                gerbangData.some((gerbang) =>
                    gerbang.NamaCabang === cabang && gerbang.IdCabang === row.IdCabang
                )
            ).length;
        });

        return {
            labels: cabangNames,
            datasets: [
                {
                    data: totals,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0", "#FFB6C1"],
                },
            ],
        };
    };

    useEffect(() => {
        fetchGerbangData();
        fetchLalinData();
    }, [tanggal]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen ml-5 md:ml-64 transition-all duration-300">
                <header className="flex justify-between items-center bg-white p-4 shadow rounded">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <button
                        onClick={logout}  // Panggil fungsi logout dari custom hook
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </header>
                <div className="mt-6">
                    <div className="bg-white p-4 rounded shadow mb-6 ">
                        <label htmlFor="tanggal">Pilih Tanggal:</label>
                        <input
                            type="date"
                            id="tanggal"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            className="ml-2 p-2 border rounded"
                        />
                    </div>
                </div>
                <main className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                    {loading ? (
                        <p>Loading data...</p>
                    ) : (
                        <>
                            <div className="bg-white p-4 rounded shadow">
                                <h2>Jumlah Lalin per Metode Pembayaran</h2>
                                <div className="mt-4 w-full">
                                    <Bar data={preparePaymentMethodData()} />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                                <h2>Jumlah Lalin per Gerbang</h2>
                                <div className="mt-4 w-full">
                                    <Bar data={prepareGerbangData()} />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                                <h2>Presentasi Lalin per Shift</h2>
                                <div className="mt-4 w-full">
                                    <Doughnut
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                        width={400}
                                        height={400}
                                        data={prepareShiftData()}
                                    />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                                <h2>Presentasi Lalin per Cabang</h2>
                                <div className="mt-4 w-full">
                                    <Doughnut
                                        data={prepareLalinPerRuas()}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                        }}
                                        width={400}
                                        height={400}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
