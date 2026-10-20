import type { AppTabId } from './MainNavbar';

export interface MainFooterProps {
  onSelectTab: (tab: AppTabId) => void;
}

export function MainFooter({ onSelectTab }: MainFooterProps) {
  return (
    <footer className="mt-14 border-t border-blue-100 bg-white/90 backdrop-blur-md">
      <div className="max-w-360 mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <img
                src="/logo.png"
                alt="Logo Kraków360"
                className="h-8 w-8"
            />
            <div>
              <span className="font-extrabold text-slate-800">Kraków360</span>
              <span className="mx-1.5 text-slate-300">•</span>
              <span>
                Platforma Analizy Jakości Życia i Dostępności Usług Publicznych w Krakowie
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium">
            <button
              onClick={() => onSelectTab('resident')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Dla Mieszkańca
            </button>
            <button
              onClick={() => onSelectTab('parent')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Dla Rodzica
            </button>
            <button
              onClick={() => onSelectTab('investor')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Dla Urzędnika i Inwestora
            </button>
            <button
              onClick={() => onSelectTab('methodology')}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Metodologia i Źródła Danych
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
