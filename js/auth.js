// ==========================================
// 1. SISTEM AUTENTIKASI (LOGIN & LOGOUT)
// ==========================================

async function handleLogin() {
    const idInput = document.getElementById('login-id').value.trim();
    const passInput = document.getElementById('login-pass').value;
    const btn = document.getElementById('btn-login');
    const errText = document.getElementById('login-error');
    const currentDeviceId = getDeviceID();
    
    if (!idInput || !passInput) {
        errText.innerText = "ID dan Kata Sandi wajib diisi!";
        errText.classList.remove('hidden');
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengecek Cloud...';
    btn.disabled = true;
    errText.classList.add('hidden');

    try {
        // 1. Cek Siswa Terlebih Dahulu
        let { data: siswa, error: errSiswa } = await db
            .from('tabel_siswa')
            .select('*')
            .eq('nis', idInput)
            .maybeSingle();

        if (siswa) {
            const pwSiswa = siswa.password || '123456';
            if (passInput !== pwSiswa) {
                throw new Error("Kata Sandi Salah!");
            }

            // Validasi Kunci Perangkat (Device Binding)
            if (siswa.device_id && siswa.device_id !== currentDeviceId) {
                throw new Error("Akun ini terikat pada HP lain. Silakan hubungi admin untuk reset perangkat.");
            } else if (!siswa.device_id) {
                await db.from('tabel_siswa').update({ device_id: currentDeviceId }).eq('nis', idInput);
                siswa.device_id = currentDeviceId;
            }

            currentUser = { role: 'siswa', ...siswa };
            localStorage.setItem('app_session', JSON.stringify(currentUser));
            setupSiswaDashboard(currentUser);
            return;
        }

        // 2. Cek Guru & Admin (Semua berbasis tabel_guru)
        let { data: guru, error: errGuru } = await db
            .from('tabel_guru')
            .select('*')
            .eq('nip', idInput)
            .maybeSingle();

        if (guru) {
            const pwGuru = guru.password || '123456';
            if (passInput !== pwGuru) {
                throw new Error("Kata Sandi Salah!");
            }

            // Deteksi Role Berdasarkan Jabatan
            const isRoleAdmin = guru.jabatan && (
                guru.jabatan.toLowerCase().includes('admin') || 
                guru.jabatan.toLowerCase().includes('master')
            );
            const userRole = isRoleAdmin ? 'admin' : 'guru';

            // Validasi Device Binding (Opsional untuk Admin jika tidak ingin terikat 1 HP)
            if (!isRoleAdmin) {
                if (guru.device_id && guru.device_id !== currentDeviceId) {
                    throw new Error("Akun ini aktif di perangkat lain. Minta admin untuk reset perangkat.");
                } else if (!guru.device_id) {
                    await db.from('tabel_guru').update({ device_id: currentDeviceId }).eq('nip', idInput);
                    guru.device_id = currentDeviceId;
                }
            }

            currentUser = { role: userRole, ...guru };
            localStorage.setItem('app_session', JSON.stringify(currentUser));
            setupGuruDashboard(currentUser);
            return;
        }

        throw new Error("ID Pengguna atau Kata Sandi tidak terdaftar!");

    } catch (err) {
        console.error(err);
        errText.innerHTML = `<i class="fas fa-exclamation-triangle mr-1"></i> ${err.message || "Gagal masuk."}`;
        errText.classList.remove('hidden');
    } finally {
        btn.innerHTML = '<span class="w-6 h-6 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm"><i class="fas fa-arrow-right text-[10px]"></i></span><span class="text-sm tracking-wide">Masuk Sistem</span>';
        btn.disabled = false;
    }
}

function togglePasswordVisibility() {
    const passInput = document.getElementById('login-pass');
    const eyeIcon = document.getElementById('eye-icon');
    if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

async function handleLogout() {
    if (currentUser) {
        try {
            if (currentUser.role === 'siswa') {
                await db.from('tabel_siswa').update({ device_id: null }).eq('nis', currentUser.nis);
            } else if (currentUser.role === 'guru') {
                await db.from('tabel_guru').update({ device_id: null }).eq('nip', currentUser.nip);
            }
        } catch (e) {
            console.error("Gagal melepas ikatan perangkat:", e);
        }
    }

    currentUser = null;
    localStorage.removeItem('app_session');

    document.getElementById('login-id').value = '';
    document.getElementById('login-pass').value = '';
    showScreen('screen-login');
    const container = document.getElementById('app-container');
    container.classList.remove('desktop-mode');
    container.classList.add('device-frame');
}

async function resetDeviceBinding(tabel, kolomId, nilaiId) {
    if (!confirm(`Yakin ingin me-reset (menghapus) ikatan perangkat untuk ID ${nilaiId}?\n\nPengguna akan bisa login kembali di perangkat mana pun.`)) {
        return;
    }
    
    showToast('Memproses pelepasan perangkat...');
    
    try {
        const { error } = await db.from(tabel)
            .update({ device_id: null })
            .eq(kolomId, nilaiId);
            
        if (error) throw error;
        
        showToast(`Perangkat untuk ${nilaiId} berhasil dibebaskan!`);
        
        if (tabel === 'tabel_siswa' && typeof loadDataSiswa === 'function') loadDataSiswa(true);
        if (tabel === 'tabel_guru' && typeof loadDataGuru === 'function') loadDataGuru(true);
        
    } catch (error) {
        console.error(error);
        showToast('Gagal me-reset ikatan perangkat (Cek RLS/Koneksi).', true);
    }
}