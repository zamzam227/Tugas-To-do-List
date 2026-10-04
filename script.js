
// Input & tombol
const inputTugas = document.getElementById("input-tugas");
const btnTambah = document.getElementById("btn-tambah");
const pesanPeringatan = document.getElementById("pesan-peringatan");

// Daftar tugas
const daftarTugas = document.getElementById("daftar-tugas");
const pesanKosong = document.getElementById("pesan-kosong");

// Rekap statistik
const statTotal = document.getElementById("stat-total");
const statSelesai = document.getElementById("stat-selesai");
const statBelum = document.getElementById("stat-belum");
const trackProgres = document.getElementById("track-progres");
const barProgres = document.getElementById("bar-progres");


// FUNGSI REKAP STATISTIK 
// Dipanggil setiap kali ada perubahan: tambah, centang, hapus
function perbaruiStatistik() {
    // Hitung langsung dari isi daftar, sehingga angka selalu sesuai tampilan
    const total = daftarTugas.querySelectorAll("li").length;
    const selesai = daftarTugas.querySelectorAll("li.completed").length;
    const belum = total - selesai;

    // Menampilkan angka ke layar
    statTotal.innerText = total;
    statSelesai.innerText = selesai;
    statBelum.innerText = belum;

    // Menghitung persentase tugas selesai 
    let persen = 0;
    if (total > 0) {
        persen = Math.round((selesai / total) * 100);
    }
    barProgres.style.width = persen + "%";
    trackProgres.setAttribute("aria-valuenow", persen);

    // Menampilkan teks "Belum ada tugas" hanya jika daftar kosong
    if (total === 0) {
        pesanKosong.classList.remove("hidden");
    } else {
        pesanKosong.classList.add("hidden");
    }
}


// PESAN PERINGATAN 
function tampilkanPeringatan(pesan) {
    pesanPeringatan.innerText = pesan;
    pesanPeringatan.classList.remove("hidden");
    inputTugas.classList.add("invalid");
}

function sembunyikanPeringatan() {
    pesanPeringatan.classList.add("hidden");
    inputTugas.classList.remove("invalid");
}


// MEMBUAT ITEM TUGAS (elemen dinamis)
function buatItemTugas(teks) {
    const liBaru = document.createElement("li");
    liBaru.className = "task-item";

    // Label berisi checkbox + teks. Klik pada teks otomatis mencentang checkbox
    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const spanTeks = document.createElement("span");
    spanTeks.className = "task-text";
    spanTeks.innerText = teks; // innerText aman dari injeksi HTML

    label.appendChild(checkbox);
    label.appendChild(spanTeks);

    // Tombol hapus
    const btnHapus = document.createElement("button");
    btnHapus.className = "btn-hapus";
    btnHapus.innerText = "Hapus";
    btnHapus.setAttribute("aria-label", "Hapus tugas: " + teks);

    // Fitur 3: tandai selesai -> class "completed" menyalakan coretan lewat CSS
    checkbox.addEventListener("change", function () {
        liBaru.classList.toggle("completed");
        perbaruiStatistik();
    });

    // Fitur 4: hapus tugas menggunakan remove()
    btnHapus.addEventListener("click", function () {
        liBaru.remove();
        perbaruiStatistik();
        inputTugas.focus();
        console.log('Tugas "' + teks + '" dihapus.');
    });

    liBaru.appendChild(label);
    liBaru.appendChild(btnHapus);

    return liBaru;
}

// FITUR UTAMA TAMBAH TUGAS (Fitur 1 & 2)
function tambahTugas() {
    // .trim() membuang spasi di awal dan akhir, sehingga input "   " dianggap kosong
    const teks = inputTugas.value.trim();

    // Validasi: jika kosong, tampilkan peringatan dan hentikan proses
    if (teks === "") {
        tampilkanPeringatan("Tugas tidak boleh kosong. Ketik dulu sebelum menambahkan.");
        inputTugas.focus();
        return;
    }

    // Jika valid: buat item, tempelkan ke daftar, lalu rapikan input
    const itemBaru = buatItemTugas(teks);
    daftarTugas.appendChild(itemBaru);

    inputTugas.value = "";
    inputTugas.focus();
    sembunyikanPeringatan();
    perbaruiStatistik();

    console.log('Tugas baru ditambahkan: "' + teks + '"');
}

// ------------------------------------------------------------
// 6. EVENT LISTENER
// ------------------------------------------------------------
// Klik tombol "+ Tambah"
btnTambah.addEventListener("click", function () {
    tambahTugas();
});

// Tombol keyboard dilepas pada kolom input
inputTugas.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        tambahTugas(); // Enter = sama seperti klik tombol Tambah
    } else {
        sembunyikanPeringatan(); // mengetik lagi = peringatan hilang
    }
});


// KONDISI AWAL
perbaruiStatistik();
