import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { notification } from 'antd'; // Mengimpor notification dari Ant Design
import BgLogin from './bg-login.png';
import LogoJasa from '../assets/logo-jasaa.jpeg';
export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validasi form
        if (!username || !password) {
            notification.error({
                message: 'Login Gagal',
                description: 'Username dan password tidak boleh kosong!',
                placement: 'topRight', // Menampilkan notifikasi di kanan atas
            });
            return;
        }

        try {
            const response = await login({ username, password });
            if (response.data.status) {
                localStorage.setItem('token', response.data.token);

                notification.success({
                    message: 'Login Berhasil',
                    description: 'Anda berhasil login!',
                    placement: 'topRight',
                });

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500); // Menunggu 1.5 detik sebelum redirect
            } else {
                notification.error({
                    message: 'Login Gagal',
                    description: response.data.message,
                    placement: 'topRight',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Login Gagal',
                description: 'Terjadi kesalahan saat login!',
                placement: 'topRight',
            });
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${BgLogin})` }}
        >
            <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Selamat Datang, di admin </h2>
                <img
                    src={LogoJasa}
                    alt="Logo Jasa"
                    className="mt-2 mx-auto w-70 h-auto"
                    style={{ borderRadius: '8px' }}
                />
                <form className='mt-5' onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border rounded"
                    />
                    <button className="w-full bg-[#244786] text-white py-2 rounded hover:bg-blue-600">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
