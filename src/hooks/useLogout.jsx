import { useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';  // Mengimpor Modal dari Ant Design

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        // Menampilkan modal konfirmasi logout
        Modal.confirm({
            title: 'Apakah Anda yakin ingin keluar?',
            content: 'Anda akan diarahkan ke halaman login.',
            okText: 'Ya',
            cancelText: 'Batal',
            onOk: () => {
                // Menghapus token dari localStorage
                localStorage.removeItem('token');

                // Menampilkan notifikasi logout sukses
                message.success('Anda berhasil logout');

                // Mengarahkan pengguna ke halaman login
                navigate('/');
            },
            onCancel: () => {
                // Jika batal, tidak perlu melakukan apa-apa
                message.info('Logout dibatalkan');
            }
        });
    };

    return { logout };
};
