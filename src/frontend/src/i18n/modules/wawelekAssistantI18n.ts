import type { Language } from '../types';

export interface WawelekAssistantTranslations {
  floatingBadgeTitle: string;
  floatingBadgeSubtitle: string;
  headerTitle: string;
  headerSubtitle: string;
  mascotBadge: string;
  ephemeralSessionNotice: string;
  liveContextBadge: string;
  backdropToggleOn: string;
  backdropToggleOff: string;
  clearChatButton: string;
  closeChatAria: string;
  welcomeGreetingTitle: string;
  welcomeGreetingBody: string;
  suggestedQuestionsHeader: string;
  inputPlaceholder: string;
  sendButton: string;
  sendingStatus: string;
  errorFallbackMessage: string;
  mascotStates: {
    idle: string;
    listening: string;
    thinking: string;
    speaking: string;
  };
  defaultPromptsByTab: Record<string, string[]>;
}

const PL_WAWELEK: WawelekAssistantTranslations = {
  floatingBadgeTitle: 'Potrzebujesz pomocy?',
  floatingBadgeSubtitle: 'Zapytaj smoka Wawelka AI',
  headerTitle: 'Wawelek • Twój Asystent AI',
  headerSubtitle: 'Niebieski smok wawelski • Ekspert danych miejskich, dzielnic i Krakowa',
  mascotBadge: 'Maskotka Kraków360',
  ephemeralSessionNotice: 'Sesja tymczasowa (znika po odświeżeniu strony)',
  liveContextBadge: 'Baza 18 dzielnic + Pogoda Live',
  backdropToggleOn: 'Przyciemnij tło',
  backdropToggleOff: 'Podgląd strony w tle',
  clearChatButton: 'Nowa rozmowa',
  closeChatAria: 'Zamknij okno asystenta Wawelek',
  welcomeGreetingTitle: 'Cześć! Jestem Wawelek – niebieski smok z Wawelu! 🐉',
  welcomeGreetingBody:
    'W przeciwieństwie do mojego zielonego pradziadka nie zieję ogniem – żywię się otwartymi danymi Krakowa i chrupiącymi obwarzankami! Znam na pamięć wszystkie **18 dzielnic**, wzór **Indeksu Jakości Życia**, prognozy do **2028 roku**, aktualną pogodę i jakość powietrza na polu oraz historię naszego zespołu **Percepcja360**. O co chcesz zapytać?',
  suggestedQuestionsHeader: 'Przykładowe pytania dla obecnego widoku:',
  inputPlaceholder: 'Zapytaj Wawelka',
  sendButton: 'Wyślij',
  sendingStatus: 'Wawelek przegląda krakowskie rejestry i układa odpowiedź...',
  errorFallbackMessage:
    '🐉 Oj! Chwilowo zadymiło w mojej smoczej jamie pod Wawelem i nie udało się połączyć z serwerem. Spróbuj proszę za sekundkę!',
  mascotStates: {
    idle: 'Gotowy do pomocy pod Wawelem',
    listening: 'Nadstawia smocze uszy...',
    thinking: 'Analizuje rejestry Krakowa...',
    speaking: 'Wawelek odpowiada!',
  },
  defaultPromptsByTab: {
    resident: [
      'Która dzielnica Krakowa ma najwyższy Indeks Jakości Życia i dlaczego?',
      'Jak dokładnie wyliczacie Indeks Jakości Życia w 8 filarach?',
      'Jaka jest teraz pogoda i jakość powietrza (PM2.5 / EAQI) w Krakowie?',
      'Kto stworzył aplikację Kraków360 i co wykazała ankieta 243 mieszkańców?',
    ],
    parent: [
      'W której dzielnicy najłatwiej o miejsce w żłobku i przedszkolu?',
      'Jak działa Mapa Spacerowa 15-Minutowa i bufory 300m / 500m / 1km?',
      'Porównaj Dzielnicę V Krowodrza i IV Prądnik Biały dla rodziny z dzieckiem.',
      'Ile placówek edukacyjnych i parków obejmuje baza Kraków360?',
    ],
    investor: [
      'W których 6 dzielnicach najbardziej zabraknie miejsc w żłobkach i szkołach do 2028 r.?',
      'Jak działa 14-licznikowy Symulator Rozbudowy Infrastruktury „Co-Jeśli”?',
      'Które dzielnice Krakowa rozwijają się najszybciej demograficznie?',
      'Opowiedz o zespole Percepcja360 i wynikach badań społecznych (243 osoby).',
    ],
    tourist: [
      'Zaproponuj mniej zatłoczone alternatywy dla Rynku Głównego i Wawelu!',
      'Jak działa Inteligentny Planer Tras i algorytm District-First Chaining?',
      'Co warto zobaczyć w Nowej Hucie (Dzielnica XVIII) i jak tam dojechać?',
      'Ilu turystów odwiedza Kraków według badań MOT i skąd przyjeżdżają?',
    ],
    methodology: [
      'Kto stworzył aplikację Kraków360 i czym kierował się zespół Percepcja360?',
      'Co wykazało badanie ankietowe przeprowadzone na 243 mieszkańcach Krakowa?',
      'Z jakich oficjalnych rejestrów otwartych danych korzysta Kraków360?',
      'Kim jesteś, Wawelku, i czym różnisz się od dawnego Smoka Wawelskiego?',
    ],
  },
};

const EN_WAWELEK: WawelekAssistantTranslations = {
  floatingBadgeTitle: 'Need assistance?',
  floatingBadgeSubtitle: 'Ask Wawelek the AI Dragon',
  headerTitle: 'Wawelek • Your AI Assistant',
  headerSubtitle: 'The Blue Wawel Dragon • Urban Open Data & Krakow Expert',
  mascotBadge: 'Kraków360 Mascot',
  ephemeralSessionNotice: 'Ephemeral session (clears on page refresh)',
  liveContextBadge: '18 Districts DB + Live Weather',
  backdropToggleOn: 'Dim background',
  backdropToggleOff: 'Peek page behind',
  clearChatButton: 'Reset chat',
  closeChatAria: 'Close Wawelek AI Assistant',
  welcomeGreetingTitle: "Hello! I'm Wawelek – the Blue Dragon of Wawel Hill! 🐉",
  welcomeGreetingBody:
    "Unlike my fiery green great-grandfather, I don't breathe fire – I feed on Krakow's Open Data and crispy obwarzanek bagels! I know all **18 districts**, the **Quality of Life Index** math, **2028 demographic forecasts**, live weather & air quality, and the story of **Team Percepcja360**. How can I help you today?",
  suggestedQuestionsHeader: 'Suggested questions for this view:',
  inputPlaceholder: 'Ask Wawelek',
  sendButton: 'Send',
  sendingStatus: 'Wawelek is scanning Krakow municipal registers...',
  errorFallbackMessage:
    '🐉 Oops! A little smoke in my Wawel server cave interrupted the connection. Please try again in a moment!',
  mascotStates: {
    idle: 'Ready to help beneath Wawel Hill',
    listening: 'Listening closely...',
    thinking: 'Crunching Krakow data...',
    speaking: 'Wawelek is replying!',
  },
  defaultPromptsByTab: {
    resident: [
      'Which Krakow district has the highest Quality of Life Index and why?',
      'How is the Quality of Life Index calculated across the 8 pillars?',
      'What is the live weather and air quality (PM2.5 / EAQI) in Krakow right now?',
      'Who created Kraków360 and what did the 243-resident survey reveal?',
    ],
    parent: [
      'Which district has the best nursery and kindergarten availability?',
      'How does the 15-Minute Walking Map (300m / 500m / 1km buffers) work?',
      'Compare District V Krowodrza and IV Prądnik Biały for a young family.',
      'How many schools, nurseries, and parks are tracked in Kraków360?',
    ],
    investor: [
      'Which 6 districts face the biggest childcare deficit by 2028?',
      'How does the 14-counter What-If Infrastructure Simulator work?',
      'Which Krakow districts have the fastest population growth?',
      'Tell me about Team Percepcja360 and the 243-respondent social study.',
    ],
    tourist: [
      'Suggest peaceful hidden-gem alternatives to the Main Square and Wawel!',
      'How does the Smart Trip Planner & District-First Chaining algorithm work?',
      'What is worth visiting in Nowa Huta (District XVIII) and how to get there?',
      'How many tourists visit Krakow annually according to MOT data?',
    ],
    methodology: [
      'Who created Kraków360 and what is the vision of Team Percepcja360?',
      'What were the key findings of the survey among 243 Krakow residents?',
      'Which official municipal open data registers power Kraków360?',
      'Who are you, Wawelek, and how do you differ from the old Wawel Dragon?',
    ],
  },
};

const UA_WAWELEK: WawelekAssistantTranslations = {
  floatingBadgeTitle: 'Потрібна допомога?',
  floatingBadgeSubtitle: 'Запитай дракончика Вавелька ШІ',
  headerTitle: 'Вавелек • Твій ШІ-Асистент',
  headerSubtitle: 'Синій вавельський дракон • Експерт з відкритих даних та Кракова',
  mascotBadge: 'Маскот Kraków360',
  ephemeralSessionNotice: 'Тимчасова сесія (очищується після оновлення сторінки)',
  liveContextBadge: 'База 18 районів + Погода Live',
  backdropToggleOn: 'Затемнити фон',
  backdropToggleOff: 'Перегляд сторінки',
  clearChatButton: 'Очистити чат',
  closeChatAria: 'Закрити вікно асистента Вавелька',
  welcomeGreetingTitle: 'Привіт! Я Вавелек – синій дракончик із Вавеля! 🐉',
  welcomeGreetingBody:
    'На відміну від мого зеленого прадіда з легенди, я не дихаю вогнем – я жиблюся відкритими даними Кракова та свіжими обважанками! Я знаю всі **18 районів**, формулу **Індексу якості життя**, прогнози до **2028 року**, актуальну погоду та історію нашої команди **Percepcja360**. Про що хочеш запитати?',
  suggestedQuestionsHeader: 'Приклади запитань для цієї вкладки:',
  inputPlaceholder: 'Запитай Вавелька',
  sendButton: 'Надіслати',
  sendingStatus: 'Вавелек аналізує міські реєстри Кракова...',
  errorFallbackMessage:
    '🐉 Ой! У моїй драконячій печері під Вавелем тимчасово зник зв’язок із сервером. Спробуйте, будь ласка, ще раз!',
  mascotStates: {
    idle: 'Готовий допомагати під Вавелем',
    listening: 'Уважно слухає...',
    thinking: 'Аналізує дані Кракова...',
    speaking: 'Вавелек відповідає!',
  },
  defaultPromptsByTab: {
    resident: [
      'Який район Кракова має найвищий Індекс якості життя і чому?',
      'Як саме розраховується Індекс якості життя за 8 категоріями?',
      'Яка зараз погода та якість повітря (PM2.5 / EAQI) у Кракові?',
      'Хто створив Kraków360 і що показало опитування 243 мешканців?',
    ],
    parent: [
      'У якому районі найкраща доступність ясел та дитячих садків?',
      'Як працює 15-хвилинна карта прогулянок (буфери 300м / 500м / 1км)?',
      'Порівняй район V Кроводжа та IV Пронднік Бяли для сім’ї з дитиною.',
      'Скільки освітніх закладів і парків охоплює база Kraków360?',
    ],
    investor: [
      'У яких 6 районах найбільше бракуватиме місць у садочках і школах до 2028 р.?',
      'Як працює 14-лічильниковий Симулятор інфраструктури «Що-Якщо»?',
      'Які райони Кракова розвиваються найшвидше демографічно?',
      'Розкажи про команду Percepcja360 та результати опитування 243 мешканців.',
    ],
    tourist: [
      'Запропонуй спокійні альтернативи Ринковій площі та Вавелю!',
      'Як працює Розумний планувальник маршрутів та алгоритм District-First Chaining?',
      'Що варто побачити у Новій Гуті (Район XVIII) і як туди доїхати?',
      'Скільки туристів відвідує Краків за даними MOT і звідки вони приїжджають?',
    ],
    methodology: [
      'Хто створив платформу Kraków360 і чим керувалася команда Percepcja360?',
      'Що показало анкетне дослідження серед 243 мешканців Кракова?',
      'З яких офіційних реєстрів відкритих даних черпає інформацію Kraków360?',
      'Хто ти, Вавельку, і чим відрізняєшся від давнього Вавельського дракона?',
    ],
  },
};

export function getWawelekAssistantI18n(language: Language): WawelekAssistantTranslations {
  switch (language) {
    case 'en':
      return EN_WAWELEK;
    case 'ua':
      return UA_WAWELEK;
    default:
      return PL_WAWELEK;
  }
}
