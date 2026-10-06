// =====================================
// DATA AWAL
// =====================================

const initialBarang = [

    {
        id: 1,
        nama: "Proyektor Epson",
        kategori: "Elektronik",
        harga: 75000,
        status: "Tersedia"
    },

    {
        id: 2,
        nama: "Speaker Portable",
        kategori: "Audio",
        harga: 50000,
        status: "Disewa"
    },

    {
        id: 3,
        nama: "Kamera Digital",
        kategori: "Kamera",
        harga: 100000,
        status: "Tersedia"
    }

];


const initialPesanan = [

    {
        id: 1,
        pelanggan: "Budi",
        barangId: 1,
        tanggal: "2026-09-20",
        durasi: 2,
        status: "Aktif"
    },

    {
        id: 2,
        pelanggan: "Sinta",
        barangId: 2,
        tanggal: "2026-09-15",
        durasi: 1,
        status: "Selesai"
    }

];


// =====================================
// LOCAL STORAGE
// =====================================

let barang =
    JSON.parse(
        localStorage.getItem(
            "rakitin_barang"
        )
    ) || initialBarang;


let pesanan =
    JSON.parse(
        localStorage.getItem(
            "rakitin_pesanan"
        )
    ) || initialPesanan;



// =====================================
// FORMAT RUPIAH
// =====================================

function rupiah(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(value);

}



// =====================================
// SIMPAN DATA
// =====================================

function saveData() {

    localStorage.setItem(
        "rakitin_barang",
        JSON.stringify(barang)
    );

    localStorage.setItem(
        "rakitin_pesanan",
        JSON.stringify(pesanan)
    );

}



// =====================================
// TAMPILKAN DATA BARANG
// =====================================

function renderBarang() {

    const tbody =
        document.getElementById(
            "barangTable"
        );


    tbody.innerHTML =
        barang.map(
            (item, index) => `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    <b>
                        ${item.nama}
                    </b>
                </td>

                <td>
                    ${item.kategori}
                </td>

                <td>
                    ${rupiah(item.harga)}
                </td>

                <td>

                    <span class="status
                        ${
                            item.status === "Disewa"
                                ? "menunggu"
                                : ""
                        }">

                        ${item.status}

                    </span>

                </td>

                <td>

                    <div class="action">

                        <button
                            class="btn-small edit"
                            onclick="editBarang(${item.id})">

                            Edit

                        </button>


                        <button
                            class="btn-small delete"
                            onclick="hapusBarang(${item.id})">

                            Hapus

                        </button>

                    </div>

                </td>

            </tr>

        `
        ).join("");


    // Isi pilihan barang
    // pada form pesanan

    const select =
        document.getElementById(
            "pesananBarang"
        );


    select.innerHTML =
        barang.map(
            item => `

                <option value="${item.id}">
                    ${item.nama}
                </option>

            `
        ).join("");

}



// =====================================
// TAMPILKAN DATA PESANAN
// =====================================

function renderPesanan() {

    const tbody =
        document.getElementById(
            "pesananTable"
        );


    tbody.innerHTML =
        pesanan.map(
            (item, index) => {

                const b =
                    barang.find(
                        x =>
                            x.id ===
                            Number(item.barangId)
                    );


                const total =
                    b
                        ? b.harga *
                          item.durasi
                        : 0;


                const cls =
                    item.status
                        .toLowerCase()
                        .replace(
                            " ",
                            ""
                        );


                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <b>
                                ${item.pelanggan}
                            </b>
                        </td>

                        <td>
                            ${
                                b
                                    ? b.nama
                                    : "-"
                            }
                        </td>

                        <td>
                            ${item.tanggal}
                        </td>

                        <td>
                            ${item.durasi}
                            hari
                        </td>

                        <td>
                            ${rupiah(total)}
                        </td>

                        <td>

                            <span
                                class="status ${cls}">

                                ${item.status}

                            </span>

                        </td>

                        <td>

                            <div class="action">

                                <button
                                    class="btn-small edit"
                                    onclick="editPesanan(${item.id})">

                                    Edit

                                </button>


                                <button
                                    class="btn-small delete"
                                    onclick="hapusPesanan(${item.id})">

                                    Hapus

                                </button>

                            </div>

                        </td>

                    </tr>

                `;

            }
        ).join("");


    updateStats();

}



// =====================================
// UPDATE STATISTIK
// =====================================

function updateStats() {

    const aktif =
        pesanan.filter(
            item =>
                item.status ===
                "Aktif"
        ).length;


    const jadwal =
        pesanan.filter(
            item =>
                item.status !==
                "Selesai"
        ).length;


    const total =
        pesanan.reduce(
            (sum, item) => {

                const b =
                    barang.find(
                        x =>
                            x.id ===
                            Number(
                                item.barangId
                            )
                    );


                return sum +
                    (
                        b
                            ? b.harga *
                              Number(
                                  item.durasi
                              )
                            : 0
                    );

            },
            0
        );


    document.getElementById(
        "statAktif"
    ).textContent = aktif;


    document.getElementById(
        "statJadwal"
    ).textContent = jadwal;


    document.getElementById(
        "statTotal"
    ).textContent = rupiah(total);

}



// =====================================
// MODAL BARANG
// =====================================

function openBarangModal(id = null) {

    document
        .getElementById("barangForm")
        .reset();


    document
        .getElementById("barangId")
        .value = id || "";


    document
        .getElementById("barangModalTitle")
        .textContent =
            id
                ? "Edit Barang"
                : "Tambah Barang";


    if (id) {

        const item =
            barang.find(
                x =>
                    x.id === id
            );


        document.getElementById(
            "barangNama"
        ).value =
            item.nama;


        document.getElementById(
            "barangKategori"
        ).value =
            item.kategori;


        document.getElementById(
            "barangHarga"
        ).value =
            item.harga;


        document.getElementById(
            "barangStatus"
        ).value =
            item.status;

    }


    document
        .getElementById(
            "barangModal"
        )
        .classList.add("show");

}



// =====================================
// TUTUP MODAL
// =====================================

function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("show");

}



// =====================================
// EDIT BARANG
// =====================================

function editBarang(id) {

    openBarangModal(id);

}



// =====================================
// HAPUS BARANG
// =====================================

function hapusBarang(id) {

    const dipakai =
        pesanan.some(
            item =>
                Number(
                    item.barangId
                ) === id
        );


    if (dipakai) {

        alert(
            "Barang tidak dapat dihapus " +
            "karena masih digunakan " +
            "pada data pesanan."
        );

        return;
    }


    if (
        confirm(
            "Yakin ingin menghapus barang ini?"
        )
    ) {

        barang =
            barang.filter(
                item =>
                    item.id !== id
            );


        saveData();

        renderAll();

    }

}



// =====================================
// SUBMIT BARANG
// =====================================

document
    .getElementById("barangForm")
    .addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const id =
                Number(
                    document.getElementById(
                        "barangId"
                    ).value
                );


            const data = {

                id:
                    id ||
                    Date.now(),

                nama:
                    document.getElementById(
                        "barangNama"
                    ).value,

                kategori:
                    document.getElementById(
                        "barangKategori"
                    ).value,

                harga:
                    Number(
                        document.getElementById(
                            "barangHarga"
                        ).value
                    ),

                status:
                    document.getElementById(
                        "barangStatus"
                    ).value

            };


            if (id) {

                barang =
                    barang.map(
                        item =>
                            item.id === id
                                ? data
                                : item
                    );

            } else {

                barang.push(data);

            }


            saveData();

            renderAll();

            closeModal(
                "barangModal"
            );

        }
    );



// =====================================
// MODAL PESANAN
// =====================================

function openPesananModal(
    id = null
) {

    document
        .getElementById(
            "pesananForm"
        )
        .reset();


    document
        .getElementById(
            "pesananId"
        )
        .value =
            id || "";


    document
        .getElementById(
            "pesananModalTitle"
        )
        .textContent =
            id
                ? "Edit Pesanan"
                : "Tambah Pesanan";


    if (id) {

        const item =
            pesanan.find(
                x =>
                    x.id === id
            );


        document.getElementById(
            "pesananPelanggan"
        ).value =
            item.pelanggan;


        document.getElementById(
            "pesananBarang"
        ).value =
            item.barangId;


        document.getElementById(
            "pesananTanggal"
        ).value =
            item.tanggal;


        document.getElementById(
            "pesananDurasi"
        ).value =
            item.durasi;


        document.getElementById(
            "pesananStatus"
        ).value =
            item.status;

    }


    document
        .getElementById(
            "pesananModal"
        )
        .classList.add("show");

}



// =====================================
// EDIT PESANAN
// =====================================

function editPesanan(id) {

    openPesananModal(id);

}



// =====================================
// HAPUS PESANAN
// =====================================

function hapusPesanan(id) {

    if (
        confirm(
            "Yakin ingin menghapus pesanan ini?"
        )
    ) {

        pesanan =
            pesanan.filter(
                item =>
                    item.id !== id
            );


        saveData();

        renderAll();

    }

}



// =====================================
// SUBMIT PESANAN
// =====================================

document
    .getElementById(
        "pesananForm"
    )
    .addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const id =
                Number(
                    document.getElementById(
                        "pesananId"
                    ).value
                );


            const data = {

                id:
                    id ||
                    Date.now(),

                pelanggan:
                    document.getElementById(
                        "pesananPelanggan"
                    ).value,

                barangId:
                    Number(
                        document.getElementById(
                            "pesananBarang"
                        ).value
                    ),

                tanggal:
                    document.getElementById(
                        "pesananTanggal"
                    ).value,

                durasi:
                    Number(
                        document.getElementById(
                            "pesananDurasi"
                        ).value
                    ),

                status:
                    document.getElementById(
                        "pesananStatus"
                    ).value

            };


            if (id) {

                pesanan =
                    pesanan.map(
                        item =>
                            item.id === id
                                ? data
                                : item
                    );

            } else {

                pesanan.push(data);

            }


            saveData();

            renderAll();

            closeModal(
                "pesananModal"
            );

        }
    );



// =====================================
// KLIK DI LUAR MODAL
// =====================================

window.addEventListener(
    "click",
    function(e) {

        if (
            e.target.classList
                .contains("modal")
        ) {

            e.target
                .classList
                .remove("show");

        }

    }
);



// =====================================
// RENDER AWAL
// =====================================

function renderAll() {

    renderBarang();

    renderPesanan();

}


renderAll();