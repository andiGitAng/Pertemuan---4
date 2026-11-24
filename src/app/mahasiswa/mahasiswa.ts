import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';
import { HttpClient } from '@angular/common/http';

declare const $: any;
declare const Tabulator: any;

// anne putri miranda - 231103875
@Component({
  selector: 'app-mahasiswa',
  standalone: true,
  imports: [Header, Sidebar, Footer],
  templateUrl: './mahasiswa.html',
  styleUrl: './mahasiswa.css'
})
export class Mahasiswa implements AfterViewInit {

  table1: any;
  mahasiswa: any;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-collapse');

    this.bindMahasiswa();
  }

  bindMahasiswa(): void {
    this.http.get<any[]>("https://stmikpontianak.cloud/011100862/tampilMahasiswa.php")
      .subscribe((data: any[]) => {
        this.mahasiswa = data;

        const tableData = data.map((mhs: any) => ({
          NIM: mhs.NIM,
          Nama: mhs.Nama,
          JenisKelamin: mhs.JenisKelamin,
          TempatTanggalLahir: `${mhs.TempatLahir}, ${mhs.TanggalLahir}`,
          JP: mhs.JP,
          Alamat: mhs.Alamat,
          StatusNikah: mhs.StatusNikah,
          TahunMasuk: mhs.TahunMasuk,
        }));

        if (!this.table1) {
          this.table1 = new Tabulator('#tabulator-mahasiswa', {
            data: tableData,
            layout: 'fitColumns',
            responsiveLayout: 'collapse',
            pagination: 'local',
            paginationSize: 10,
            placeholder: 'Data mahasiswa tidak tersedia',
            columns: [
              { title: 'NIM', field: 'NIM', responsive: 0 },
              { title: 'Nama', field: 'Nama', responsive: 0 },
              { title: 'Jenis Kelamin', field: 'JenisKelamin' },
              { title: 'Tempat, Tgl Lahir', field: 'TempatTanggalLahir' },
              { title: 'JP', field: 'JP' },
              { title: 'Alamat', field: 'Alamat' },
              { title: 'Status', field: 'StatusNikah' },
              { title: 'Tahun Masuk', field: 'TahunMasuk' },
            ],
          });
        } else {
          this.table1.setData(tableData);
        }
      });
  }

  formatDetail(d: any): string {
    return `
      <table class="table table-sm table-borderless mb-0 ml-3">
        <tr><td><b>Nama</b></td><td>: ${d[2]}</td></tr>
        <tr><td><b>Jenis Kelamin</b></td><td>: ${d[3]}</td></tr>
        <tr><td><b>Tempat, Tgl Lahir</b></td><td>: ${d[4]}</td></tr>
        <tr><td><b>JP</b></td><td>: ${d[5]}</td></tr>
        <tr><td><b>Alamat</b></td><td>: ${d[6]}</td></tr>
        <tr><td><b>Status</b></td><td>: ${d[7]}</td></tr>
        <tr><td><b>Tahun Masuk</b></td><td>: ${d[8]}</td></tr>
      </table>`;
  }

  postRecord(): void {

    var alamat = $("#alamatText").val();
    var jenisKelamin = $("#jenisKelaminSelect").val()?.toString().trim();
    var jp = $("#jpSelect").val();
    var nama = $("#namaText").val();
    var nim = $("#nimText").val();
    var statusNikah = $("#statusNikahSelect").val();
    var tahunMasuk = $("#tahunMasukText").val();
    var tanggalLahir = $("#tanggalLahirText").val();
    var tempatLahir = $("#tempatLahirText").val();

    // VALIDASI
    if (!nim || !nama || !tempatLahir || !tanggalLahir || !alamat || !tahunMasuk) {
      alert("Semua data wajib diisi!");
      return;
    }

    // URL BENAR
    var url =
      "https://stmikpontianak.cloud/011100862/tambahMahasiswa.php?" +
      "alamat=" + encodeURIComponent(alamat) +
      "&jenisKelamin=" + encodeURIComponent(jenisKelamin!) +
      "&jp=" + encodeURIComponent(jp!) +
      "&nama=" + encodeURIComponent(nama!) +
      "&nim=" + encodeURIComponent(nim!) +
      "&statusPernikahan=" + encodeURIComponent(statusNikah!) +
      "&tahunMasuk=" + encodeURIComponent(tahunMasuk!) +
      "&tanggalLahir=" + encodeURIComponent(tanggalLahir!) +
      "&tempatLahir=" + encodeURIComponent(tempatLahir!);

    console.log("URL DIKIRIM:", url); // Debug

    this.http.get(url).subscribe((data: any) => {

      alert(data.status + " --> " + data.message);

      this.bindMahasiswa();

      // FIX ID MODAL
      $("#tambahModal").modal("hide");
    });
  }
}
