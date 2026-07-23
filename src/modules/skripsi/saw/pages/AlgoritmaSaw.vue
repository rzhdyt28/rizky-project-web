<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-3xl mx-auto px-4 py-4">
        <button @click="router.back()" class="text-sm text-slate-500 hover:text-slate-700">&larr; Kembali</button>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <p class="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Panduan Algoritma</p>
        <h1 class="text-3xl font-semibold text-slate-800 mt-1">SAW — Simple Additive Weighting</h1>
        <p class="mt-3 text-slate-600">
          SAW adalah salah satu metode Sistem Pendukung Keputusan (SPK) paling
          sederhana: mencari penjumlahan terbobot dari rating kinerja setiap
          alternatif pada semua kriteria, lalu meranking hasilnya.
        </p>
      </div>

      <section class="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div>
          <h2 class="font-semibold text-slate-800">Langkah 1 — Normalisasi Matriks</h2>
          <p class="text-sm text-slate-600 mt-1">
            Setiap kriteria punya tipe: <b>benefit</b> (semakin besar nilainya
            semakin baik, mis. RAM, kecepatan) atau <b>cost</b> (semakin kecil
            semakin baik, mis. harga, waktu pengerjaan).
          </p>
          <div class="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
            <div class="bg-slate-50 rounded-lg p-3 font-mono">
              Benefit: r<sub>ij</sub> = x<sub>ij</sub> / max(x<sub>ij</sub>)
            </div>
            <div class="bg-slate-50 rounded-lg p-3 font-mono">
              Cost: r<sub>ij</sub> = min(x<sub>ij</sub>) / x<sub>ij</sub>
            </div>
          </div>
        </div>

        <div>
          <h2 class="font-semibold text-slate-800">Langkah 2 — Kalikan dengan Bobot</h2>
          <p class="text-sm text-slate-600 mt-1">
            Hasil normalisasi (r<sub>ij</sub>) dikalikan bobot kriteria
            (w<sub>j</sub>) yang sudah ditentukan. Bobot biasanya dinormalisasi
            dulu supaya totalnya = 1.
          </p>
        </div>

        <div>
          <h2 class="font-semibold text-slate-800">Langkah 3 — Jumlahkan jadi Skor Akhir</h2>
          <div class="mt-2 bg-slate-50 rounded-lg p-3 font-mono text-sm">
            V<sub>i</sub> = Σ (w<sub>j</sub> × r<sub>ij</sub>) untuk semua kriteria j
          </div>
          <p class="text-sm text-slate-600 mt-2">
            Alternatif dengan V<sub>i</sub> tertinggi adalah rekomendasi terbaik.
          </p>
        </div>
      </section>

      <section class="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 class="font-semibold text-slate-800 mb-3">Contoh Perhitungan</h2>
        <p class="text-sm text-slate-600 mb-3">
          Memilih laptop terbaik dari 2 kandidat, 2 kriteria: Harga (cost,
          bobot 0.4) dan RAM (benefit, bobot 0.6).
        </p>
        <table class="w-full text-sm border-collapse mb-4">
          <thead>
            <tr>
              <th class="text-left border-b border-slate-200 py-2">Alternatif</th>
              <th class="text-center border-b border-slate-200 py-2">Harga (cost)</th>
              <th class="text-center border-b border-slate-200 py-2">RAM (benefit)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="py-2">Laptop A</td><td class="text-center">8.000.000</td><td class="text-center">8 GB</td></tr>
            <tr><td class="py-2">Laptop B</td><td class="text-center">12.000.000</td><td class="text-center">16 GB</td></tr>
          </tbody>
        </table>
        <ul class="text-sm text-slate-600 space-y-1 list-disc list-inside">
          <li>Normalisasi Harga: A = 8jt/8jt = 1, B = 8jt/12jt = 0.667</li>
          <li>Normalisasi RAM: A = 8/16 = 0.5, B = 16/16 = 1</li>
          <li>Skor A = (1 × 0.4) + (0.5 × 0.6) = <b>0.7</b></li>
          <li>Skor B = (0.667 × 0.4) + (1 × 0.6) = <b>0.867</b></li>
        </ul>
        <p class="text-sm text-slate-700 mt-3 font-medium">
          Hasil: Laptop B direkomendasikan karena skornya lebih tinggi.
        </p>
      </section>
    </div>
  </main>
</template>
