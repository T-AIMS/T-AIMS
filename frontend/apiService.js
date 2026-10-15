// Konfigurasi koneksi ke Backend Express.js Ahmad Reza (Port 3000)
const BASE_URL = 'http://localhost:3000/api';

// Fungsi pengambil data riwayat log insiden
async function getIncidentLogs() {
  try {
    const token = localStorage.getItem('taims_jwt_token') || '';
    const response = await fetch(`${BASE_URL}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn("Backend Reza belum terhubung / offline. Menggunakan data tampilan lokal.");
    return null; // Mengembalikan null agar halaman tetap menampilkan data cadangan
  }
}