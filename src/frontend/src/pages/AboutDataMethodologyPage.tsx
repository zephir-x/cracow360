import {
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle2,
  Database,
  ExternalLink,
  FileSpreadsheet,
  Layers,
  Scale,
} from 'lucide-react';

export interface AboutDataMethodologyPageProps {
  onBackToResidentMode: () => void;
}

const DATA_SOURCES = [
  {
    category: 'Granice Administracyjne i Przestrzeń (GIS)',
    dataset: 'Granice wektorowe 18 Dzielnic Krakowa (Dzielnice I–XVIII, admin_level=9) + powierzchnie km²',
    portal: 'OpenStreetMap / Nominatim API & MSIP Kraków (PRG GUGiK)',
    url: 'https://msip.krakow.pl',
    status: '100% Rzeczywiste Geodane (GeoJSON)',
  },
  {
    category: 'Demografia i Dynamika Ludności',
    dataset: 'Liczba mieszkańców (meldunki stałe i czasowe), grupy wiekowe (0–3, 4–6, 7–14, 15–64, 65+), cudzoziemcy, dynamika 3-letnia',
    portal: 'Bank Danych o Krakowie (BDK UMK) & Portal Otwartych Danych UMK',
    url: 'https://otwartedane.um.krakow.pl',
    status: 'Zintegrowane w kontrakcie 18 dzielnic',
  },
  {
    category: 'Edukacja i Opieka Wczesnoszkolna (0–14 lat)',
    dataset: 'Żłobki samorządowe, żłobki dotowane i prywatne, kluby dziecięce, przedszkola, szkoły podstawowe i liczebność klas',
    portal: 'Portal Otwartych Danych UMK & Portal Edukacyjny Krakowa',
    url: 'https://portaledukacyjny.krakow.pl',
    status: 'Zintegrowane w kontrakcie 18 dzielnic',
  },
  {
    category: 'Mobilność, Transport KMK i Rower',
    dataset: 'Lokalizacje przystanków tramwajowych i autobusowych KMK, zasięg izochron 500m, parkingi P&R, długość ścieżek rowerowych DDR',
    portal: 'Zarząd Transportu Publicznego w Krakowie (ZTP GTFS) & MSIP',
    url: 'https://gtfs.ztp.krakow.pl',
    status: 'Zintegrowane w kontrakcie 18 dzielnic',
  },
  {
    category: 'Zieleń Miejska, Parki i Sport',
    dataset: 'Parki miejskie ZZM, parki kieszonkowe, powierzchnia zieleni na mieszkańca (m²/os.), boiska przyszkolne i baseny',
    portal: 'Zarząd Zieleni Miejskiej (ZZM) & MSIP Kraków',
    url: 'https://msip.krakow.pl',
    status: 'Zintegrowane w kontrakcie 18 dzielnic',
  },
  {
    category: 'Kultura, Biblioteki i Aktywność Seniorów',
    dataset: 'Filie Biblioteki Kraków, miejskie domy i centra kultury, sieć Centrów Aktywności Seniora (CAS)',
    portal: 'Otwarte Dane UMK & Kraków dla Seniora',
    url: 'https://dlaseniora.krakow.pl',
    status: 'Zintegrowane w kontrakcie 18 dzielnic',
  },
  {
    category: 'Środowisko i Jakość Powietrza',
    dataset: 'Pomiary stężeń pyłów PM10, PM2.5, NO2 oraz indeks CAQI ze stacji referencyjnych w Krakowie',
    portal: 'Główny Inspektorat Ochrony Środowiska (GIOŚ REST API)',
    url: 'https://api.gios.gov.pl',
    status: 'Worker BackgroundService (.NET 9)',
  },
];

export function AboutDataMethodologyPage({
  onBackToResidentMode,
}: AboutDataMethodologyPageProps) {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0a2e65] via-[#1d4ed8] to-[#0284c7] text-white p-8 sm:p-10 shadow-xl border border-blue-400/30">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold text-sky-100">
            <BookOpen className="w-4 h-4 text-sky-300" />
            Dokumentacja Konkursowa • „Open Data App” – Gmina Miejska Kraków
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Metodologia Wyliczania Indeksu
            <br />
            <span className="text-sky-200">oraz Rejestr Źródeł Otwartych Danych.</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/95 leading-relaxed">
            Transparentność danych i poprawność metodologiczna to fundament projektu Kraków360. Poniżej przedstawiamy dokładny sposób wyliczania punktacji (0–100 pkt) oraz wykaz publicznych rejestrów miejskich zasilających naszą bazę danych.
          </p>
          <div className="pt-2">
            <button
              onClick={onBackToResidentMode}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-white text-blue-900 hover:bg-sky-50 shadow-lg transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              Wróć do Mapy i Porównywarki Dzielnic
            </button>
          </div>
        </div>
      </section>

      {/* Two-Stage Mathematical Model Explanation */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Etap 1 (Pipeline Python Offline)
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Normalizacja Min-Max Wskaźników Surowych do Skali 0–100 pkt
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aby móc porównywać wskaźniki wyrażone w różnych jednostkach (np. liczbę przystanków KMK, m² parków na mieszkańca oraz liczbę dzieci przypadających na 1 miejsce w żłobku), każdy wskaźnik surowy przechodzi w skrypcie <code className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold">02_calculate_quality_scores.py</code> transformację <strong>Min-Max (0–100)</strong>:
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Stymulanty (im więcej, tym lepiej):</strong> Dzielnica z najwyższą wartością w Krakowie otrzymuje 100 pkt, a z najniższą 0 pkt (np. gęstość przystanków KMK, m² zieleni na mieszkańca, liczba bibliotek i CAS).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Destymulanty (im mniej, tym lepiej – odwrócona skala):</strong> Dzielnica z najniższą wartością otrzymuje 100 pkt (np. liczba dzieci czekających na 1 miejsce w żłobku, średnia liczba uczniów w klasie, stężenie pyłów PM10).
              </span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                Etap 2 (Czas Rzeczywisty 0 ms – React &amp; .NET 9)
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Dynamiczna Średnia Ważona z 5 Suwaków Preferencji (0–10)
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Każdy mieszkaniec ma inne priorytety – student szuka szybkiego tramwaju KMK i wydarzeń kulturalnych, natomiast rodzina 2+1 szuka miejsc w żłobkach, bezpiecznych szkół i parków. Gdy przesuwasz suwaki (0–10), wyliczamy spersonalizowany indeks:
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-blue-100 font-mono text-xs text-blue-900 text-center">
            Indeks = (Mob·W₁ + Edu·W₂ + Ziel·W₃ + Kult·W₄ + Środ·W₅) / (W₁ + W₂ + W₃ + W₄ + W₅)
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dzięki oddzieleniu ciężkich obliczeń statystycznych (Python -&gt; JSON -&gt; SQLite) od przeliczania wag w interfejsie użytkownika, zmiana układu suwaków aktualizuje kolory 18 dzielnic i tabelę rankingową natychmiastowo (w <strong>0 ms</strong>).
          </p>
        </div>
      </section>

      {/* Complete Open Data Sources Registry Table */}
      <section className="rounded-3xl bg-white border border-blue-100 overflow-hidden shadow-xl shadow-blue-900/5">
        <div className="px-6 py-5 bg-linear-to-r from-blue-50/80 to-white border-b border-blue-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Rejestr Wykorzystywanych Źródeł Danych Publicznych
              </h2>
              <p className="text-xs text-slate-500">
                Pełna dokumentacja techniczna znajduje się również w pliku Assets/Instructions/04_OPEN_DATA_SOURCES_REGISTRY.md
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <FileSpreadsheet className="w-3.5 h-3.5" />7 Głównych Domen Danych
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                <th className="py-3.5 px-5 font-bold">Obszar / Domena</th>
                <th className="py-3.5 px-5 font-bold">Zakres wskaźników</th>
                <th className="py-3.5 px-5 font-bold">Instytucja / Portal źródłowy</th>
                <th className="py-3.5 px-5 font-bold text-right">Status integracji</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DATA_SOURCES.map((src, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition">
                  <td className="py-3.5 px-5 font-bold text-slate-900">{src.category}</td>
                  <td className="py-3.5 px-5 text-slate-600 max-w-md">{src.dataset}</td>
                  <td className="py-3.5 px-5">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {src.portal}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Layers className="w-3 h-3" />
                      {src.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
