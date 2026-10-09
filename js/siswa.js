// ==========================================
// 1. TAMPILAN DASHBOARD SISWA & PROFIL
// ==========================================

function setupSiswaDashboard(user) {
    const elSiswaName = document.getElementById('siswa-name');
    if (elSiswaName) elSiswaName.innerText = user.nama;
    
    const elKelasJurusan = document.getElementById('siswa-kelas-jurusan');
    if (elKelasJurusan) {
        const tingkat = user.tingkat || '-';
        const jurusan = user.id_jurusan || '-';
        const kelas = user.kelas || '-';
        elKelasJurusan.innerText = `Kelas ${tingkat} - ${jurusan} (${kelas})`;
    }

    const elProfilName = document.getElementById('profil-name');
    if (elProfilName) elProfilName.innerText = user.nama;
    
    const elProfilJurusan = document.getElementById('profil-jurusan');
    if (elProfilJurusan) elProfilJurusan.innerText = `${user.tingkat || "-"} ${user.id_jurusan || "-"}`;
    
    const elMenuName = document.getElementById('menu-name');
    if (elMenuName) elMenuName.innerText = user.nama;
    const elMenuKelas = document.getElementById('menu-kelas');
    if (elMenuKelas) elMenuKelas.innerText = `${user.kelas || "-"} ${user.id_jurusan || "-"}`;
    
    const elInfoNis = document.getElementById('info-nis');
    if (elInfoNis) elInfoNis.innerText = user.nis || "-";
    
    const elInfoJurusanDetail = document.getElementById('info-jurusan-detail');
    if (elInfoJurusanDetail) elInfoJurusanDetail.innerText = user.id_jurusan || "-";
    
    const elInfoStatus = document.getElementById('info-status');
    if (elInfoStatus) {
        elInfoStatus.innerText = user.status_siswa || "Aktif";
        if (user.status_siswa && user.status_siswa.toLowerCase() !== 'aktif') {
            elInfoStatus.className = "text-[10px] font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full";
        } else {
            elInfoStatus.className = "text-[10px] font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full";
        }
    }
    
    const elInfoTahun = document.getElementById('info-tahun');
    if (elInfoTahun) {
        if (user.nis && user.nis.length >= 4) {
            elInfoTahun.innerText = user.nis.substring(0, 4);
        } else {
            elInfoTahun.innerText = "-";
        }
    }
    
    updateFotoUI(user.foto_profil);

    const elTanggal = document.getElementById('tanggal-hari-ini');
    if (elTanggal) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        elTanggal.innerText = new Date().toLocaleDateString('id-ID', options);
    }

    showScreen('screen-mobile');
    switchTabMobile('dashboard');
    
    const container = document.getElementById('app-container');
    container.classList.remove('desktop-mode');
    container.classList.add('device-frame');
}

function updateFotoUI(url) {
    const dImg = document.getElementById('dashboard-foto');
    const dIco = document.getElementById('dashboard-icon');
    const pImg = document.getElementById('profil-foto-preview');
    const pIco = document.getElementById('profil-icon');
    const mImg = document.getElementById('menu-foto');
    const mIco = document.getElementById('menu-icon');
    
    if (url && url.trim() !== '') {
        if (dImg) { dImg.style.display = 'block'; dImg.src = url; dImg.classList.remove('hidden'); }
        if (dIco) { dIco.style.display = 'none'; dIco.classList.add('hidden'); }
        
        if (pImg) { pImg.style.display = 'block'; pImg.src = url; pImg.classList.remove('hidden'); }
        if (pIco) { pIco.style.display = 'none'; pIco.classList.add('hidden'); }
        
        if (mImg) { mImg.style.display = 'block'; mImg.src = url; mImg.classList.remove('hidden'); }
        if (mIco) { mIco.style.display = 'none'; mIco.classList.add('hidden'); }
    } else {
        if (dImg) { dImg.style.display = 'none'; dImg.classList.add('hidden'); }
        if (dIco) { dIco.style.display = 'block'; dIco.classList.remove('hidden'); }
        
        if (pImg) { pImg.style.display = 'none'; pImg.classList.add('hidden'); }
        if (pIco) { pIco.style.display = 'block'; pIco.classList.remove('hidden'); }
        
        if (mImg) { mImg.style.display = 'none'; mImg.classList.add('hidden'); }
        if (mIco) { mIco.style.display = 'block'; mIco.classList.remove('hidden'); }
    }
}

function switchTabMobile(tabId) {
    ['tab-dashboard', 'tab-histori', 'tab-izin', 'tab-profil', 'tab-menu'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) activeTab.classList.remove('hidden');
    
    ['nav-dashboard', 'nav-histori', 'nav-izin', 'nav-menu'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active-nav');
            el.classList.remove('text-teal-600', 'text-gray-400'); 
        }
    });
    
    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) {
        activeNav.classList.add('active-nav');
    }

    if (tabId === 'histori') loadHistoriSiswa();
    if (tabId === 'izin') loadIzinSiswa();
    if (tabId === 'profil') {
        loadProfilForm();
        const form = document.getElementById('form-edit-profil');
        const icon = document.getElementById('icon-toggle-profil');
        if (form && !form.classList.contains('hidden')) {
            form.classList.add('hidden');
            if (icon) icon.style.transform = 'rotate(0deg)';
        }
    }
}

function toggleEditProfil() {
    const form = document.getElementById('form-edit-profil');
    const icon = document.getElementById('icon-toggle-profil');
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        icon.style.transform = 'rotate(90deg)';
        setTimeout(() => form.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    } else {
        form.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

function loadProfilForm() {
    if (!currentUser) return;
    document.getElementById('edit-tempat-lahir').value = currentUser.tempat_lahir || '';
    document.getElementById('edit-tgl-lahir').value = currentUser.tgl_lahir || '';
    document.getElementById('edit-foto').value = currentUser.foto_profil || '';
    document.getElementById('edit-nohp').value = currentUser.no_hp || '';
    document.getElementById('edit-alamat').value = currentUser.alamat || '';
    document.getElementById('edit-password-siswa').value = ''; 
}

async function simpanProfilSiswa() {
    const btn = document.getElementById('btn-simpan-profil');
    const tempat = document.getElementById('edit-tempat-lahir').value.trim();
    const tgl = document.getElementById('edit-tgl-lahir').value;
    const foto = document.getElementById('edit-foto').value.trim();
    const nohp = document.getElementById('edit-nohp').value.trim();
    const alamat = document.getElementById('edit-alamat').value.trim();
    const passBaru = document.getElementById('edit-password-siswa').value.trim();

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    btn.disabled = true;

    let dataUpdate = { tempat_lahir: tempat, tgl_lahir: tgl, foto_profil: foto, no_hp: nohp, alamat: alamat };
    if (passBaru !== '') {
        dataUpdate.password = passBaru;
    }

    try {
        const { error } = await db.from('tabel_siswa')
            .update(dataUpdate)
            .eq('nis', currentUser.nis);

        if (error) throw error;

        currentUser.tempat_lahir = tempat;
        currentUser.tgl_lahir = tgl;
        currentUser.foto_profil = foto;
        currentUser.no_hp = nohp;
        currentUser.alamat = alamat;
        if (passBaru !== '') currentUser.password = passBaru;

        updateFotoUI(foto);
        
        showToast('Profil berhasil diperbarui!');
        document.getElementById('edit-password-siswa').value = ''; 
    } catch (error) {
        showToast('Gagal menyimpan profil!', true);
        console.error(error);
    } finally {
        btn.innerHTML = '<i class="fas fa-save"></i> Simpan Perubahan';
        btn.disabled = false;
    }
}

const editFotoFileEl = document.getElementById('edit-foto-file');
if (editFotoFileEl) {
    editFotoFileEl.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file || !currentUser) return;
        
        const statusEl = document.getElementById('foto-upload-status');
        statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengunggah foto...';
        statusEl.className = 'text-[10px] text-teal-600 mt-1 font-bold';

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `profil_${currentUser.nis}_${Date.now()}.${fileExt}`;
            const publicUrl = await uploadFileToSupabase(file, 'foto_profil', fileName);
            
            document.getElementById('edit-foto').value = publicUrl;
            
            document.getElementById('profil-foto-preview').style.display = 'block';
            document.getElementById('profil-foto-preview').src = publicUrl;
            document.getElementById('profil-foto-preview').classList.remove('hidden');
            
            document.getElementById('profil-icon').style.display = 'none';
            document.getElementById('profil-icon').classList.add('hidden');

            statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Diunggah. Silakan Simpan Data!';
            statusEl.className = 'text-[10px] text-green-600 font-bold mt-2 text-center block';
            statusEl.classList.remove('hidden');
            
            setTimeout(() => { statusEl.classList.add('hidden'); }, 4000);
            
            const form = document.getElementById('form-edit-profil');
            if (form && form.classList.contains('hidden')) {
                toggleEditProfil();
            }

        } catch (error) {
            let errorMsg = 'Gagal unggah foto.';
            if (error.message && error.message.includes('row-level security')) {
               errorMsg = 'Akses ditolak. Cek RLS Storage.';
            }
            statusEl.innerHTML = `<i class="fas fa-times-circle"></i> ${errorMsg}`;
            statusEl.className = 'text-[10px] text-red-500 font-bold mt-2 text-center block';
            statusEl.classList.remove('hidden');
            console.error(error);
        }
    });
}

// ==========================================
// 2. PENGAJUAN IZIN & RIWAYAT PRESENSI SISWA
// ==========================================

const izinLampiranFileEl = document.getElementById('izin-lampiran-file');
if (izinLampiranFileEl) {
    izinLampiranFileEl.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file || !currentUser) return;
        
        const statusEl = document.getElementById('lampiran-upload-status');
        statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengunggah...';
        statusEl.className = 'text-[10px] text-teal-600 mt-1 font-bold';

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `lampiran_${currentUser.nis}_${Date.now()}.${fileExt}`;
            const publicUrl = await uploadFileToSupabase(file, 'lampiran_izin', fileName);
            
            document.getElementById('izin-lampiran').value = publicUrl;
            statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Berhasil diunggah';
            statusEl.className = 'text-[10px] text-green-600 mt-1 font-bold';
        } catch (error) {
            let errorMsg = 'Gagal unggah file.';
            if (error.message && error.message.includes('row-level security')) {
               errorMsg = 'Akses ditolak. Cek RLS Policy Storage.';
            }
            statusEl.innerHTML = `<i class="fas fa-times-circle"></i> ${errorMsg}`;
            statusEl.className = 'text-[10px] text-red-500 mt-1 font-bold';
            document.getElementById('izin-lampiran').value = '';
            console.error(error);
        }
    });
}

async function submitIzin() {
    if (!currentUser) return;
    const jenis = document.getElementById('izin-jenis').value;
    const ket = document.getElementById('izin-keterangan').value.trim();
    const lampiran = document.getElementById('izin-lampiran').value.trim();
    const tglPengajuan = document.getElementById('izin-tgl-input').value; 
    const btn = document.getElementById('btn-submit-izin');

    if (!ket) return showToast('Keterangan tidak boleh kosong!', true);
    if (!tglPengajuan) return showToast('Tanggal pengajuan belum diisi!', true);

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    btn.disabled = true;

    try {
        const { error } = await db.from('tabel_izin').insert([{
            nis: currentUser.nis,
            nama: currentUser.nama,
            tanggal: tglPengajuan,
            jenis: jenis,
            keterangan: ket,
            lampiran: lampiran,
            status: 'Menunggu'
        }]);
        
        if (error) throw error;
        
        showToast('Pengajuan berhasil dikirim!');
        document.getElementById('izin-keterangan').value = '';
        document.getElementById('izin-lampiran-file').value = '';
        document.getElementById('izin-lampiran').value = '';
        document.getElementById('lampiran-upload-status').innerText = '';
        
        loadIzinSiswa(); 

    } catch (error) {
        showToast('Gagal mengirim pengajuan.', true);
        console.error(error);
    } finally {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pengajuan';
        btn.disabled = false;
    }
}

async function loadIzinSiswa() {
    if (!currentUser) return;
    const container = document.getElementById('izin-list');
    container.innerHTML = '<p class="text-center text-xs text-teal-600 mt-4"><i class="fas fa-spinner fa-spin"></i> Memuat data...</p>';
    
    const { data, error } = await db.from('tabel_izin').select('*').eq('nis', currentUser.nis).order('id', { ascending: false }).limit(10);
    
    if (error || !data || data.length === 0) {
        container.innerHTML = '<p class="text-center text-xs text-gray-400 mt-4">Belum ada pengajuan izin/sakit.</p>';
        return;
    }

    container.innerHTML = '';
    data.forEach(izin => {
        const statusColor = izin.status === 'Disetujui' ? 'bg-green-100 text-green-700 border-green-200' : (izin.status === 'Ditolak' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-orange-100 text-orange-700 border-orange-200');
        const icon = izin.jenis === 'Sakit' ? 'fa-notes-medical' : 'fa-envelope-open-text';
        const lampiranIcon = izin.lampiran ? `<br><a href="${izin.lampiran}" target="_blank" class="text-blue-500 hover:underline text-[10px]"><i class="fas fa-paperclip"></i> Bukti Lampiran</a>` : '';
        
        container.innerHTML += `
            <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-1">
                        <h4 class="font-bold text-sm text-gray-800">${izin.jenis}</h4>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded border ${statusColor}">${izin.status}</span>
                    </div>
                    <p class="text-[10px] text-gray-400 mb-1"><i class="far fa-calendar-alt"></i> ${izin.tanggal}</p>
                    <p class="text-xs text-gray-600 line-clamp-2">${izin.keterangan} ${lampiranIcon}</p>
                </div>
            </div>
        `;
    });
}

async function loadHistoriSiswa() {
    if (!currentUser || currentUser.role !== 'siswa') return;
    const container = document.getElementById('histori-list');
    container.innerHTML = '<p class="text-center text-xs text-teal-600 mt-6"><i class="fas fa-spinner fa-spin"></i> Menarik riwayat dari Cloud...</p>';
    
    const { data, error } = await db.from('tabel_presensi')
                                    .select('*')
                                    .eq('nis', currentUser.nis)
                                    .order('id', { ascending: false })
                                    .limit(30);
    
    if (error || !data || data.length === 0) {
        container.innerHTML = '<p class="text-center text-sm text-gray-400 mt-8">Belum ada riwayat absensi.</p>';
        return;
    }

    container.innerHTML = '';
    data.forEach(log => {
        const el = document.createElement('div');
        el.className = "bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center";
        const inTime = log.jam_masuk ? log.jam_masuk : '-';
        const outTime = log.jam_pulang ? log.jam_pulang : '-';
        el.innerHTML = `
            <div>
                <h3 class="font-bold text-gray-800 text-sm mb-1">${log.tanggal}</h3>
                <p class="text-[11px] text-gray-500">Masuk: <span class="font-bold text-gray-700">${inTime}</span> | Pulang: <span class="font-bold text-gray-700">${outTime}</span></p>
            </div>
            <span class="bg-green-100 text-green-700 border-green-200 px-3 py-1 rounded-full text-[10px] font-bold border"><i class="fas fa-check"></i> Cloud</span>
        `;
        container.appendChild(el);
    });
}

// ==========================================
// 3. SCANNER, KAMERA & PROSES ABSENSI
// ==========================================

let currentAbsenType = 'masuk';
let cameraStream = null;

async function startCamera() {
    const videoElement = document.getElementById('camera-feed');
    const scanTitle = document.getElementById('scan-title');
    const scanText = document.getElementById('scan-text');

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" },
            audio: false 
        });
        
        videoElement.srcObject = cameraStream;
        videoElement.classList.remove('hidden'); 
        scanTitle.innerText = "Memindai Wajah...";
        scanText.innerText = "Wajah Terdeteksi (Kamera Aktif)";
        scanText.className = "text-green-400 font-semibold text-sm";
    } catch (err) {
        console.error("Gagal akses kamera:", err);
        scanTitle.innerText = "Memindai Data Profil...";
        scanText.innerText = "Kamera tidak tersedia.";
        scanText.className = "text-cyan-400 font-semibold text-sm";
    }
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    document.getElementById('camera-feed').classList.add('hidden');
}

async function openScanner(type) {
    try {
        const { data } = await db.from('tabel_pengaturan').select('*').limit(1).maybeSingle();
        if (data) cachedPengaturan = data;
    } catch (e) { 
        console.log("Lanjut tanpa pengaturan cloud", e);
    }

    if (cachedPengaturan) {
        const now = await getServerTime();
        const currentHours = String(now.getHours()).padStart(2, '0');
        const currentMinutes = String(now.getMinutes()).padStart(2, '0');
        const currentJam = `${currentHours}:${currentMinutes}`;
        
        if (type === 'masuk') {
            if (cachedPengaturan.jam_masuk_mulai && currentJam < cachedPengaturan.jam_masuk_mulai) {
                return showToast(`Gagal: Absen masuk baru dibuka pukul ${cachedPengaturan.jam_masuk_mulai} WIB`, true);
            }
            if (cachedPengaturan.jam_masuk_akhir && currentJam > cachedPengaturan.jam_masuk_akhir) {
                return showToast(`Gagal: Absen masuk sudah ditutup sejak pukul ${cachedPengaturan.jam_masuk_akhir} WIB`, true);
            }
        } else {
            if (cachedPengaturan.jam_pulang_mulai && currentJam < cachedPengaturan.jam_pulang_mulai) {
                return showToast(`Gagal: Waktu pulang belum tiba (Mulai pukul ${cachedPengaturan.jam_pulang_mulai} WIB)`, true);
            }
        }

        if (cachedPengaturan.lokasi_lat && cachedPengaturan.lokasi_lng && cachedPengaturan.radius) {
            showToast('Mengecek lokasi GPS...', false);
            if (!navigator.geolocation) return showToast('Browser tidak mendukung pembacaan GPS!', true);
            
            return navigator.geolocation.getCurrentPosition(
                (position) => {
                    const jarak = hitungJarakGPS(
                        position.coords.latitude, position.coords.longitude,
                        parseFloat(cachedPengaturan.lokasi_lat), parseFloat(cachedPengaturan.lokasi_lng)
                    );
                    
                    const maxRadius = parseFloat(cachedPengaturan.radius);
                    if (jarak > maxRadius) {
                        return showToast(`Gagal: Berada di luar area sekolah! (Jarak: ${Math.round(jarak)}m | Toleransi: ${maxRadius}m)`, true);
                    } else {
                        tampilkanScannerUI(type); 
                    }
                },
                (error) => {
                    let errDetail = 'Gagal membaca GPS.';
                    if (error.code === error.PERMISSION_DENIED) {
                        errDetail = 'Izin lokasi ditolak oleh browser.';
                    } else if (error.code === error.TIMEOUT) {
                        errDetail = 'Waktu pencarian lokasi habis. Coba lagi.';
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        errDetail = 'Sinyal lokasi tidak tersedia.';
                    }
                    showToast(errDetail, true);
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000 }
            );
        }
    }
    
    tampilkanScannerUI(type);
}

function tampilkanScannerUI(type) {
    currentAbsenType = type;
    document.getElementById('lbl-absen-tipe').innerText = type === 'masuk' ? 'Tekan untuk Absen Masuk' : 'Tekan untuk Absen Pulang';
    document.getElementById('screen-mobile').classList.add('hidden');
    document.getElementById('screen-scanner').classList.remove('hidden');
    document.getElementById('screen-scanner').classList.add('flex');
    
    const scanPhoto = document.getElementById('scanner-student-photo');
    const scanIcon = document.getElementById('scanner-student-icon');
    
    if (currentUser && currentUser.foto_profil) {
        scanPhoto.src = currentUser.foto_profil;
        scanPhoto.style.display = 'block'; 
        scanPhoto.classList.remove('hidden');
        scanIcon.classList.add('hidden');
    } else {
        scanPhoto.classList.add('hidden');
        scanIcon.classList.remove('hidden');
    }

    startCamera();
}

function closeScanner() {
    stopCamera();
    document.getElementById('screen-scanner').classList.add('hidden');
    document.getElementById('screen-scanner').classList.remove('flex');
    document.getElementById('screen-mobile').classList.remove('hidden');
}

async function captureCompressUploadFoto() {
    const video = document.getElementById('camera-feed');
    if (!video || video.classList.contains('hidden') || !cameraStream) {
        return null;
    }

    const canvas = document.createElement('canvas');
    const targetWidth = 400;
    const ratio = video.videoWidth / video.videoHeight;
    const targetHeight = targetWidth / ratio;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.4);
    
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    
    const fileName = `absen_${currentUser.nis}_${Date.now()}.jpg`;
    const publicUrl = await uploadFileToSupabase(blob, 'bukti_absen', fileName);
    return publicUrl;
}

async function processAbsenToCloud() {
    const btn = document.getElementById('btn-submit-absen');
    const lbl = document.getElementById('lbl-absen-tipe');
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin text-4xl"></i>';
    btn.classList.remove('animate-soft-pulse');
    lbl.innerText = 'Mengompres Foto & Menyinkronkan...';
    btn.disabled = true;

    const dateObj = await getServerTime();
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const tglHariIni = `${yyyy}-${mm}-${dd}`; 
    const jamSekarang = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    try {
        let urlFotoBukti = null;
        try {
            urlFotoBukti = await captureCompressUploadFoto();
        } catch (e) {
            console.error("Kamera gagal diakses/upload gagal. Lanjut tanpa foto:", e);
        }

        const { data: existData, error: errCek } = await db.from('tabel_presensi')
            .select('*')
            .eq('nis', currentUser.nis)
            .eq('tanggal', tglHariIni)
            .maybeSingle();

        if (currentAbsenType === 'masuk') {
            if (existData && existData.jam_masuk) {
                showToast('Anda sudah absen masuk hari ini!', true);
            } else {
                const payload = {
                    nis: currentUser.nis,
                    nama: currentUser.nama,
                    kelas: currentUser.kelas || '-',
                    tanggal: tglHariIni,
                    jam_masuk: jamSekarang,
                    status_masuk: 'Hadir'
                };
                if (urlFotoBukti) payload.foto_masuk = urlFotoBukti;

                const { error } = await db.from('tabel_presensi').insert([payload]);
                if (error) throw error;
                showToast('Absen Masuk Berhasil!');
            }
        } else { 
            if (!existData) {
                showToast('Gagal: Anda belum absen masuk hari ini.', true);
            } else if (existData.jam_pulang) {
                showToast('Anda sudah absen pulang hari ini!', true);
            } else {
                const payload = { jam_pulang: jamSekarang, status_pulang: 'Hadir' };
                if (urlFotoBukti) payload.foto_pulang = urlFotoBukti;

                const { error } = await db.from('tabel_presensi').update(payload).eq('id', existData.id); 
                if (error) throw error;
                showToast('Absen Pulang Berhasil!');
            }
        }
    } catch (err) {
        console.error(err);
        showToast(`Gagal: ${err.message || 'Terjadi kesalahan jaringan.'}`, true);
    } finally {
        closeScanner();
        btn.innerHTML = '<i class="fas fa-fingerprint text-5xl drop-shadow-md"></i>';
        btn.classList.add('animate-soft-pulse');
        lbl.innerText = currentAbsenType === 'masuk' ? 'Tekan untuk Absen Masuk' : 'Tekan untuk Absen Pulang';
        btn.disabled = false;
    }
}

function triggerAbsenFAB() {
    openScanner('masuk');
}
