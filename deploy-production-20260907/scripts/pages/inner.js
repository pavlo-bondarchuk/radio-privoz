(() => {
  const STATUS_URL = "https://myradio24.com/users/73556/status.json";
  const iconPath = "./assets/icons/lucide-sprite.svg";
  const languages = ["uk", "pl", "ru"];
  let language = languages.includes(localStorage.getItem("prywoz-language"))
    ? localStorage.getItem("prywoz-language")
    : "uk";

  const C = {
    home: ["Головна", "Strona główna", "Главная"],
    listen: ["Ефір", "Radio", "Эфир"],
    news: ["Новини", "Wiadomości", "Новости"],
    services: ["Послуги в Лодзі", "Usługi w Łodzi", "Услуги в Лодзи"],
    business: ["Бізнес", "Biznes", "Бизнес"],
    programs: ["Програми", "Programy", "Программы"],
    about: ["Про нас", "O nas", "О нас"],
    contacts: ["Контакти", "Kontakt", "Контакты"],
    card: ["Картка", "Karta", "Карта"],
    firstRadio: [
      "Перше українське радіо в Польщі",
      "Pierwsze ukraińskie radio w Polsce",
      "Первое украинское радио в Польше",
    ],
    radioOff: ["Радіо вимкнено", "Radio wyłączone", "Радио выключено"],
    information: ["Інформація", "Informacje", "Информация"],
    connection: ["Зв’язок", "Kontakt", "Связь"],
    privacy: [
      "Політика приватності",
      "Polityka prywatności",
      "Политика конфиденциальности",
    ],
    footerAbout: [
      "Українське радіо та корисний портал у Польщі.",
      "Ukraińskie radio i przydatny portal w Polsce.",
      "Украинское радио и полезный портал в Польше.",
    ],
    footerCountry: ["Польща", "Polska", "Польша"],
    writeUs: ["Написати нам", "Napisz do nas", "Написать нам"],
    footerCardLabel: ["Радіо 24/7", "Radio 24/7", "Радио 24/7"],
    footerCardDate: [
      "Слухайте наживо",
      "Słuchaj na żywo",
      "Слушайте в прямом эфире",
    ],
    footerCardText: [
      "Денний ефір 10:00–20:00 · нічний 20:00–10:00",
      "Program dzienny 10:00–20:00 · nocny 20:00–10:00",
      "Дневной эфир 10:00–20:00 · ночной 20:00–10:00",
    ],
    madeFor: [
      "Створено з любов'ю для наших слухачів",
      "Stworzone z miłością dla naszych słuchaczy",
      "Создано с любовью для наших слушателей",
    ],
    copyright: [
      "© 2026 РАДИО ПРИВОЗ ФМ. Усі права захищено.",
      "© 2026 РАДИО ПРИВОЗ ФМ. Wszelkie prawa zastrzeżone.",
      "© 2026 РАДИО ПРИВОЗ ФМ. Все права защищены.",
    ],
    onAirNow: ["Зараз в ефірі", "Teraz na antenie", "Сейчас в эфире"],
    dayAir: [
      "Денний ефір · 10:00–20:00",
      "Program dzienny · 10:00–20:00",
      "Дневной эфир · 10:00–20:00",
    ],
    nightAir: [
      "Нічний ефір · 20:00–10:00",
      "Program nocny · 20:00–10:00",
      "Ночной эфир · 20:00–10:00",
    ],
    today: ["Сьогодні", "Dzisiaj", "Сегодня"],
    airProgram: ["Програма ефіру", "Program audycji", "Программа эфира"],
    polishTime: [
      "Час вказано для Польщі",
      "Czas polski",
      "Время указано для Польши",
    ],
    loadingProgram: [
      "Завантажуємо програму…",
      "Ładujemy program…",
      "Загружаем программу…",
    ],
    showMore: ["Показати більше", "Pokaż więcej", "Показать больше"],
    showLess: ["Показати менше", "Pokaż mniej", "Показать меньше"],
    approximateNote: [
      "Майбутній час є орієнтовним і може змінюватися через джингли або оновлення ефіру.",
      "Przyszłe godziny są orientacyjne i mogą się zmienić z powodu jingli lub zmian w emisji.",
      "Будущее время приблизительное и может меняться из-за джинглов или изменений эфира.",
    ],
    played: ["Зіграно", "Odtworzono", "Прозвучало"],
    now: ["В ефірі", "Na antenie", "В эфире"],
    next: ["Далі", "Następnie", "Далее"],
    unavailableProgram: [
      "Програма треків тимчасово недоступна.",
      "Program utworów jest chwilowo niedostępny.",
      "Программа треков временно недоступна.",
    ],
    infoFeed: [
      "Інформаційна стрічка",
      "Serwis informacyjny",
      "Информационная лента",
    ],
    all: ["Усі", "Wszystkie", "Все"],
    poland: ["Польща", "Polska", "Польша"],
    ukraine: ["Україна", "Ukraina", "Украина"],
    politics: ["Політика", "Polityka", "Политика"],
    society: ["Суспільство", "Społeczeństwo", "Общество"],
    culture: ["Культура", "Kultura", "Культура"],
    sport: ["Спорт", "Sport", "Спорт"],
    loading: ["Завантаження…", "Ładowanie…", "Загрузка…"],
    loadMore: ["Завантажити більше", "Załaduj więcej", "Загрузить ещё"],
    source: ["Джерело →", "Źródło →", "Источник →"],
    noMaterials: [
      "У цій категорії поки немає матеріалів.",
      "W tej kategorii nie ma jeszcze materiałów.",
      "В этой категории пока нет материалов.",
    ],
    newsError: [
      "Не вдалося завантажити стрічку. Спробуйте оновити сторінку.",
      "Nie udało się załadować wiadomości. Odśwież stronę.",
      "Не удалось загрузить ленту. Обновите страницу.",
    ],
    cookieTitle: [
      "Аналітичні cookie",
      "Analityczne pliki cookie",
      "Аналитические cookie",
    ],
    cookieText: [
      "Допоможіть нам зрозуміти, як відвідувачі користуються сайтом. Рекламні cookie не використовуються.",
      "Pomóż nam zrozumieć, jak użytkownicy korzystają ze strony. Nie używamy reklamowych plików cookie.",
      "Помогите нам понять, как посетители пользуются сайтом. Рекламные cookie не используются.",
    ],
    decline: ["Відхилити", "Odrzuć", "Отклонить"],
    accept: ["Прийняти", "Akceptuj", "Принять"],
    project: ["Про проєкт", "O projekcie", "О проекте"],
    radioForUs: [
      "Радіо для наших у Польщі",
      "Radio dla Ukraińców w Polsce",
      "Радио для украинцев в Польше",
    ],
    projectText: [
      "РАДИО ПРИВОЗ ФМ об’єднує українську музику, корисні новини, культуру та практичні сервіси для життя в Польщі.",
      "РАДИО ПРИВОЗ ФМ łączy ukraińską muzykę, wiadomości, kulturę i praktyczne usługi dla życia w Polsce.",
      "РАДИО ПРИВОЗ ФМ объединяет украинскую музыку, новости, культуру и практические сервисы для жизни в Польше.",
    ],
    live247: ["Живий ефір 24/7", "Radio na żywo 24/7", "Живой эфир 24/7"],
    live247Text: [
      "Денна власна програма й нічний музичний потік.",
      "Własny program dzienny i nocny strumień muzyczny.",
      "Собственная дневная программа и ночной музыкальный поток.",
    ],
    ukrainian: ["Українською", "Po ukraińsku", "На украинском"],
    ukrainianText: [
      "Зрозуміло про життя, документи й можливості в Польщі.",
      "Prosto o życiu, dokumentach i możliwościach w Polsce.",
      "Понятно о жизни, документах и возможностях в Польше.",
    ],
    community: ["Для громади", "Dla społeczności", "Для сообщества"],
    communityText: [
      "Новини, ініціативи, події та контакти українського бізнесу.",
      "Wiadomości, inicjatywy, wydarzenia i kontakty ukraińskiego biznesu.",
      "Новости, инициативы, события и контакты украинского бизнеса.",
    ],
    join: ["Як долучитися", "Jak dołączyć", "Как присоединиться"],
    guest: [
      "Стати гостем ефіру",
      "Zostań gościem audycji",
      "Стать гостем эфира",
    ],
    guestText: [
      "Розкажіть про свій проєкт, подію або корисну ініціативу.",
      "Opowiedz o swoim projekcie, wydarzeniu lub inicjatywie.",
      "Расскажите о своём проекте, событии или инициативе.",
    ],
    write: ["Написати →", "Napisz →", "Написать →"],
    addBusiness: ["Додати бізнес", "Dodaj firmę", "Добавить бизнес"],
    addBusinessText: [
      "Запропонуйте компанію чи фахівця для каталогу.",
      "Zaproponuj firmę lub specjalistę do katalogu.",
      "Предложите компанию или специалиста для каталога.",
    ],
    submit: ["Подати →", "Wyślij →", "Отправить →"],
    communityCatalog: [
      "Каталог громади",
      "Katalog społeczności",
      "Каталог сообщества",
    ],
    ukrainianBusiness: [
      "Український бізнес у Польщі",
      "Ukraiński biznes w Polsce",
      "Украинский бизнес в Польше",
    ],
    businessLead: [
      "Категорії послуг і швидкий перехід до пошуку фахівців. Для розміщення компанії напишіть редакції.",
      "Kategorie usług i szybkie wyszukiwanie specjalistów. Aby dodać firmę, napisz do redakcji.",
      "Категории услуг и быстрый поиск специалистов. Для размещения компании напишите редакции.",
    ],
    addCompany: ["Додати компанію", "Dodaj firmę", "Добавить компанию"],
    feedback: ["Зворотний зв’язок", "Informacja zwrotna", "Обратная связь"],
    contactsLead: [
      "Новина, пропозиція для ефіру, партнерство чи додавання бізнесу — напишіть редакції.",
      "Wiadomość, propozycja audycji, partnerstwo lub dodanie firmy — napisz do redakcji.",
      "Новость, предложение для эфира, партнёрство или добавление бизнеса — напишите редакции.",
    ],
    generalQuestions: [
      "Для загальних питань і пропозицій.",
      "Pytania ogólne i propozycje.",
      "Для общих вопросов и предложений.",
    ],
    phone: ["Телефон", "Telefon", "Телефон"],
    phoneText: [
      "Зв’язок із редакцією в Польщі.",
      "Kontakt z redakcją w Polsce.",
      "Связь с редакцией в Польше.",
    ],
    name: ["Ім’я", "Imię", "Имя"],
    message: ["Повідомлення", "Wiadomość", "Сообщение"],
    send: ["Надіслати", "Wyślij", "Отправить"],
    ownAir: ["Власний ефір", "Własna audycja", "Собственный эфир"],
    radioPrograms: ["Програми радіо", "Programy radiowe", "Программы радио"],
    programsLead: [
      "Музика, розмовні формати й практична інформація для української громади в Польщі.",
      "Muzyka, rozmowy i praktyczne informacje dla ukraińskiej społeczności w Polsce.",
      "Музыка, разговорные форматы и практическая информация для украинского сообщества в Польше.",
    ],
    dailyUseful: [
      "Корисно щодня",
      "Przydatne codziennie",
      "Полезно каждый день",
    ],
    servicesLead: [
      "Прямі посилання на міські та польські сервіси для життя, документів, транспорту й здоров’я.",
      "Bezpośrednie linki do miejskich i polskich usług dotyczących życia, dokumentów, transportu i zdrowia.",
      "Прямые ссылки на городские и польские сервисы для жизни, документов, транспорта и здоровья.",
    ],
    legal: [
      "Юридична інформація",
      "Informacje prawne",
      "Юридическая информация",
    ],
    privacyLead: [
      "Основні правила обробки даних на сайті РАДИО ПРИВОЗ ФМ.",
      "Podstawowe zasady przetwarzania danych na stronie РАДИО ПРИВОЗ ФМ.",
      "Основные правила обработки данных на сайте РАДИО ПРИВОЗ ФМ.",
    ],
    dataReceived: [
      "Які дані ми отримуємо",
      "Jakie dane otrzymujemy",
      "Какие данные мы получаем",
    ],
    dataPurpose: [
      "Для чого використовуються дані",
      "Do czego wykorzystujemy dane",
      "Для чего используются данные",
    ],
  };
  Object.assign(C, {
    wave: ["Українська хвиля", "Ukraińska fala", "Украинская волна"],
    waveText: [
      "Музика, новини громади та щоденні теми.",
      "Muzyka, wiadomości społeczności i codzienne tematy.",
      "Музыка, новости сообщества и ежедневные темы.",
    ],
    daily: ["Щодня", "Codziennie", "Ежедневно"],
    interview: [
      "Інтерв’ю громади",
      "Wywiady społeczności",
      "Интервью сообщества",
    ],
    interviewText: [
      "Люди, ініціативи й український бізнес у Польщі.",
      "Ludzie, inicjatywy i ukraiński biznes w Polsce.",
      "Люди, инициативы и украинский бизнес в Польше.",
    ],
    daytime: ["У денному ефірі", "W programie dziennym", "В дневном эфире"],
    useful: ["Корисно знати", "Warto wiedzieć", "Полезно знать"],
    usefulText: [
      "Документи, медицина, транспорт і міські сервіси.",
      "Dokumenty, medycyna, transport i usługi miejskie.",
      "Документы, медицина, транспорт и городские сервисы.",
    ],
    short: ["Короткі випуски", "Krótkie audycje", "Короткие выпуски"],
    cultureCode: ["Культурний код", "Kod kulturowy", "Культурный код"],
    cultureText: [
      "Українська культура, події, книжки й традиції.",
      "Ukraińska kultura, wydarzenia, książki i tradycje.",
      "Украинская культура, события, книги и традиции.",
    ],
    weekly: ["Щотижня", "Co tydzień", "Еженедельно"],
    musicEvening: ["Музичний вечір", "Wieczór muzyczny", "Музыкальный вечер"],
    musicEveningText: [
      "Авторські добірки й нові українські релізи.",
      "Autorskie wybory i nowe ukraińskie premiery.",
      "Авторские подборки и новые украинские релизы.",
    ],
    inProgram: ["У програмі ефіру", "W programie", "В программе эфира"],
    suggest: ["Запропонувати тему", "Zaproponuj temat", "Предложить тему"],
    suggestText: [
      "Надішліть ідею, гостя або матеріал редакції.",
      "Wyślij pomysł, propozycję gościa lub materiał.",
      "Отправьте идею, гостя или материал редакции.",
    ],
    cityServices: ["Міські послуги", "Usługi miejskie", "Городские услуги"],
    cityServicesText: [
      "Офіційний портал Urząd Miasta Łodzi.",
      "Oficjalny portal Urzędu Miasta Łodzi.",
      "Официальный портал Urząd Miasta Łodzi.",
    ],
    open: ["Відкрити →", "Otwórz →", "Открыть →"],
    transport: ["Транспорт MPK", "Transport MPK", "Транспорт MPK"],
    transportText: [
      "Маршрути та розклад громадського транспорту.",
      "Trasy i rozkład transportu publicznego.",
      "Маршруты и расписание общественного транспорта.",
    ],
    schedule: ["Розклад →", "Rozkład →", "Расписание →"],
    routeText: [
      "Побудова маршруту містом у реальному часі.",
      "Planowanie trasy po mieście w czasie rzeczywistym.",
      "Построение маршрута по городу в реальном времени.",
    ],
    route: ["Маршрут →", "Trasa →", "Маршрут →"],
    cityCard: [
      "Міська транспортна картка Лодзі.",
      "Łódzka karta transportu miejskiego.",
      "Городская транспортная карта Лодзи.",
    ],
    service: ["Сервіс →", "Serwis →", "Сервис →"],
    medicine: ["Медицина NFZ", "Opieka NFZ", "Медицина NFZ"],
    medicineText: [
      "Інформація для пацієнтів з України.",
      "Informacje dla pacjentów z Ukrainy.",
      "Информация для пациентов из Украины.",
    ],
    help: ["Допомога →", "Pomoc →", "Помощь →"],
    digital: [
      "Цифрові документи та державні послуги.",
      "Dokumenty cyfrowe i usługi publiczne.",
      "Цифровые документы и государственные услуги.",
    ],
    parcels: [
      "Відправлення й отримання посилок.",
      "Nadawanie i odbieranie przesyłek.",
      "Отправка и получение посылок.",
    ],
    parcelLink: ["Посилки →", "Przesyłki →", "Посылки →"],
    jobs: ["Робота в Польщі", "Praca w Polsce", "Работа в Польше"],
    jobsText: [
      "Офіційна інформація та пошук вакансій.",
      "Oficjalne informacje i wyszukiwanie ofert pracy.",
      "Официальная информация и поиск вакансий.",
    ],
    vacancies: ["Вакансії →", "Oferty pracy →", "Вакансии →"],
    documents: ["Документи", "Dokumenty", "Документы"],
    documentsText: [
      "Державна інформація українською мовою.",
      "Informacje państwowe w języku ukraińskim.",
      "Государственная информация на украинском языке.",
    ],
    auto: [
      "Автосервіс і шини",
      "Serwis samochodowy i opony",
      "Автосервис и шины",
    ],
    autoText: [
      "СТО, ремонт і сезонна заміна шин.",
      "Serwis, naprawa i sezonowa wymiana opon.",
      "СТО, ремонт и сезонная замена шин.",
    ],
    find: ["Знайти →", "Znajdź →", "Найти →"],
    dentistry: ["Стоматологія", "Stomatologia", "Стоматология"],
    dentistryText: [
      "Україномовні стоматологи в Лодзі.",
      "Ukraińskojęzyczni stomatolodzy w Łodzi.",
      "Украиноязычные стоматологи в Лодзи.",
    ],
    accounting: ["Бухгалтерія", "Księgowość", "Бухгалтерия"],
    accountingText: [
      "Підтримка підприємців і компаній.",
      "Wsparcie przedsiębiorców i firm.",
      "Поддержка предпринимателей и компаний.",
    ],
    property: ["Нерухомість", "Nieruchomości", "Недвижимость"],
    propertyText: [
      "Оренда, продаж та послуги рієлторів.",
      "Wynajem, sprzedaż i usługi pośredników.",
      "Аренда, продажа и услуги риелторов.",
    ],
    ads: ["Оголошення →", "Ogłoszenia →", "Объявления →"],
    beauty: ["Краса", "Uroda", "Красота"],
    beautyText: [
      "Косметологи, перукарі та майстри.",
      "Kosmetolodzy, fryzjerzy i inni specjaliści.",
      "Косметологи, парикмахеры и мастера.",
    ],
    tech: ["Техніка", "Elektronika", "Техника"],
    techText: [
      "Продаж і ремонт електроніки.",
      "Sprzedaż i naprawa elektroniki.",
      "Продажа и ремонт электроники.",
    ],
    receivedText: [
      "Сайт може отримувати дані, які ви добровільно надсилаєте через анкету або електронну пошту. Технічні дані браузера можуть оброблятися хостингом для безпеки й роботи сайту.",
      "Strona może otrzymywać dane dobrowolnie przesłane przez formularz lub e-mail. Dane techniczne przeglądarki mogą być przetwarzane przez hosting dla bezpieczeństwa i działania strony.",
      "Сайт может получать данные, которые вы добровольно отправляете через анкету или электронную почту. Технические данные браузера могут обрабатываться хостингом для безопасности и работы сайта.",
    ],
    purposeText: [
      "Для відповіді на звернення, активації картки та виконання запитаних вами дій. Дані не продаються третім особам.",
      "W celu odpowiedzi na zgłoszenia, aktywacji karty i wykonania żądanych działań. Dane nie są sprzedawane osobom trzecim.",
      "Для ответа на обращения, активации карты и выполнения запрошенных действий. Данные не продаются третьим лицам.",
    ],
    privacyContact: [
      "Питання щодо персональних даних надсилайте на hello@prywoz.fm.",
      "Pytania dotyczące danych osobowych wysyłaj na hello@prywoz.fm.",
      "Вопросы о персональных данных отправляйте на hello@prywoz.fm.",
    ],
  });
  const t = (key) =>
    C[key]?.[languages.indexOf(language)] || C[key]?.[0] || key;
  const normalizeText = (value) => value.replace(/\s+/g, " ").trim();
  const reverse = new Map();
  Object.entries(C).forEach(([k, v]) =>
    v.forEach((x) => reverse.set(normalizeText(x), k)),
  );
  const titleKeys = {
    listen: "listen",
    news: "news",
    services: "services",
    business: "business",
    programs: "programs",
    about: "about",
    contacts: "contacts",
    privacy: "privacy",
  };

  const page = () => document.body.dataset.page || "";
  const shell = document.querySelector("[data-site-header]");
  if (shell)
    shell.innerHTML = `<div class="container site-header__inner portal-header"><a class="logo" href="./index.html" aria-label="РАДИО ПРИВОЗ ФМ"><img class="logo__main" src="./assets/images/radio-pryvoz-fm-logo.png" alt="РАДИО ПРИВОЗ ФМ" width="1312" height="1199"><span class="logo__tagline" data-i18n="firstRadio"></span></a><div class="portal-local-time"><span class="portal-local-time__icon"><svg class="icon"><use href="${iconPath}#clock"></use></svg></span><div><strong>Лодзь · <time data-local-time>--:--</time></strong><span data-local-date></span></div></div><button class="header-radio" type="button" data-radio-toggle data-state="idle" aria-pressed="false"><span class="header-radio__dot"></span><span class="header-radio__copy"><strong data-radio-status data-i18n="radioOff"></strong><span data-radio-track>РАДИО ПРИВОЗ ФМ</span></span><svg class="icon"><use href="${iconPath}#play"></use></svg></button><button class="theme-toggle" type="button" data-theme-toggle><svg class="icon theme-toggle__icon--sun"><use href="${iconPath}#sun"></use></svg><svg class="icon theme-toggle__icon--moon"><use href="${iconPath}#moon"></use></svg></button><div class="language-switcher" aria-label="Language"><button class="language-switcher__item" data-language="uk">UA</button><button class="language-switcher__item" data-language="pl">PL</button><button class="language-switcher__item" data-language="ru">RU</button></div><button class="site-header__menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu"><svg class="icon site-header__menu-icon--open"><use href="${iconPath}#menu"></use></svg><svg class="icon site-header__menu-icon--close"><use href="${iconPath}#x"></use></svg></button></div><div class="site-header__panel" id="mobile-menu"><div class="container portal-nav-row"><nav class="main-nav">${["home", "listen", "news", "services", "business", "programs", "about", "contacts", "card"].map((k) => `<a class="main-nav__link ${page() === k ? "main-nav__link--active" : ""}" href="${k === "home" ? "./index.html" : k === "card" ? "./index.html#card" : `./${k}.html`}" data-i18n="${k}"></a>`).join("")}</nav></div></div>`;
  if (!document.querySelector(".site-footer"))
    document.body.insertAdjacentHTML(
      "beforeend",
      `<footer class="site-footer" id="contacts"><div class="container site-footer__grid"><div class="site-footer__brand"><div class="site-footer__brand-row"><img class="site-footer__logo" src="./assets/images/radio-pryvoz-fm-logo.png" alt="РАДИО ПРИВОЗ ФМ" width="1254" height="1254"><p class="site-footer__brand-note" data-i18n="firstRadio"></p></div><p class="site-footer__about" data-i18n="footerAbout"></p><ul class="socials" aria-label="Social media"><li><a class="socials__link" href="#facebook" aria-label="Facebook"><svg class="icon"><use href="${iconPath}#messages-square"></use></svg></a></li><li><a class="socials__link" href="#instagram" aria-label="Instagram"><svg class="icon"><use href="${iconPath}#camera"></use></svg></a></li><li><a class="socials__link" href="#youtube" aria-label="YouTube"><svg class="icon"><use href="${iconPath}#video"></use></svg></a></li><li><a class="socials__link" href="#telegram" aria-label="Telegram"><svg class="icon"><use href="${iconPath}#send"></use></svg></a></li><li><a class="socials__link" href="#tiktok" aria-label="TikTok"><svg class="icon"><use href="${iconPath}#music-2"></use></svg></a></li></ul></div><div class="footer-contacts"><h2 class="footer-contacts__title" data-i18n="contacts"></h2><a class="footer-contacts__link" href="mailto:hello@prywoz.fm"><svg class="icon"><use href="${iconPath}#mail"></use></svg><span>hello@prywoz.fm</span></a><a class="footer-contacts__link" href="tel:+48799123456"><svg class="icon"><use href="${iconPath}#phone"></use></svg><span>+48 799 123 456</span></a><span class="footer-contacts__link"><svg class="icon"><use href="${iconPath}#map-pin"></use></svg><span data-i18n="footerCountry"></span></span><a class="button button--contact" href="mailto:hello@prywoz.fm"><svg class="icon button__mail"><use href="${iconPath}#mail"></use></svg><span data-i18n="writeUs"></span></a></div><aside class="footer-card"><strong class="footer-card__label" data-i18n="footerCardLabel"></strong><span class="footer-card__date" data-i18n="footerCardDate"></span><p class="footer-card__text" data-i18n="footerCardText"></p><svg class="icon footer-card__tower"><use href="${iconPath}#radio-tower"></use></svg></aside></div><div class="container site-footer__bottom"><p data-i18n="copyright"></p><p class="site-footer__made"><span data-i18n="madeFor"></span><svg class="icon"><use href="${iconPath}#heart"></use></svg></p></div></footer>`,
    );

  const annotate = () =>
    document
      .querySelectorAll("main *, [data-cookie-consent] *")
      .forEach((n) => {
        if (n.dataset.i18n || n.children.length) return;
        const k = reverse.get(normalizeText(n.textContent));
        if (k) n.dataset.i18n = k;
      });
  const renderTime = () => {
    const locale = { uk: "uk-UA", pl: "pl-PL", ru: "ru-RU" }[language],
      now = new Date();
    document.querySelector("[data-local-time]")?.replaceChildren(
      new Intl.DateTimeFormat(locale, {
        timeZone: "Europe/Warsaw",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now),
    );
    document.querySelector("[data-local-date]")?.replaceChildren(
      new Intl.DateTimeFormat(locale, {
        timeZone: "Europe/Warsaw",
        weekday: "short",
        day: "numeric",
        month: "long",
      }).format(now),
    );
    document.querySelector("[data-program-date]")?.replaceChildren(
      new Intl.DateTimeFormat(locale, {
        timeZone: "Europe/Warsaw",
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now),
    );
  };
  const applyLanguage = (lang) => {
    language = languages.includes(lang) ? lang : "uk";
    localStorage.setItem("prywoz-language", language);
    document.documentElement.lang = language;
    annotate();
    document
      .querySelectorAll("[data-i18n]")
      .forEach((n) => {
        if (C[n.dataset.i18n]) n.textContent = t(n.dataset.i18n);
      });
    document
      .querySelectorAll("[data-uk]")
      .forEach((n) => (n.textContent = n.dataset[language] || n.dataset.uk));
    document.querySelectorAll("[data-language]").forEach((b) => {
      const a = b.dataset.language === language;
      b.classList.toggle("language-switcher__item--active", a);
      b.setAttribute("aria-current", String(a));
    });
    const title = titleKeys[page()];
    if (title) document.title = `${t(title)} — РАДИО ПРИВОЗ ФМ`;
    const cookie = document.querySelector("[data-cookie-consent]");
    if (cookie) {
      cookie.setAttribute("aria-label", t("cookieTitle"));
      cookie.querySelector("strong").textContent = t("cookieTitle");
      cookie.querySelector("p").textContent = t("cookieText");
      cookie.querySelector('[data-consent-choice="declined"]').textContent =
        t("decline");
      cookie.querySelector('[data-consent-choice="accepted"]').textContent =
        t("accept");
    }
    renderTime();
    renderProgram();
    document.dispatchEvent(
      new CustomEvent("prywoz:language-change", { detail: { language } }),
    );
  };

  let program = null,
    expanded = false;
  const decodeText = (value) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = value || "";
    return textarea.value;
  };
  const row = (item, state) => {
    const el = document.createElement("article"),
      time = document.createElement("time"),
      song = document.createElement("strong"),
      badge = document.createElement("span");
    el.className = `track-program__item track-program__item--${state}`;
    time.className = "track-program__time";
    song.className = "track-program__track";
    badge.className = "track-program__state";
    time.textContent =
      state === "next"
        ? "≈"
        : state === "current"
          ? "●"
          : (item.time || "").slice(0, 5);
    song.textContent = decodeText(item.song) || "РАДИО ПРИВОЗ ФМ";
    badge.textContent = t(
      state === "current" ? "now" : state === "next" ? "next" : "played",
    );
    el.append(time, song, badge);
    return el;
  };
  function renderProgram() {
    const root = document.querySelector("[data-program-list]"),
      more = document.querySelector("[data-program-more]");
    if (!root) return;
    root.replaceChildren();
    if (!program) {
      const p = document.createElement("p");
      p.className = "track-program__message";
      p.textContent = t("loadingProgram");
      root.append(p);
      return;
    }
    if (program.error) {
      const p = document.createElement("p");
      p.className = "track-program__message";
      p.textContent = t("unavailableProgram");
      root.append(p);
      if (more) more.hidden = true;
      return;
    }
    const current =
      program.song && program.song !== "-"
        ? program.song
        : [program.artist, program.songtitle].filter(Boolean).join(" — ");
    const history = (program.songs || []).filter(
      (x) => x?.song && x.song !== "-" && x.song !== current,
    );
    (expanded ? history : history.slice(-6)).forEach((x) =>
      root.append(row(x, "played")),
    );
    if (current)
      root.append(row({ time: program.time, song: current }, "current"));
    const next = (program.nextsongs || []).find(
      (x) => x?.song && x.song !== "-",
    );
    if (next) root.append(row(next, "next"));
    if (more) {
      more.hidden = history.length <= 6;
      more.textContent = t(expanded ? "showLess" : "showMore");
    }
  }
  const updateProgram = async () => {
    if (!document.querySelector("[data-track-program]")) return;
    try {
      const r = await fetch(STATUS_URL, { cache: "no-store" });
      if (!r.ok) throw 0;
      program = await r.json();
    } catch {
      program = { error: true };
    }
    renderProgram();
  };

  document.addEventListener("click", (e) => {
    const lang = e.target.closest("[data-language]");
    if (lang) applyLanguage(lang.dataset.language);
    if (e.target.closest("[data-program-more]")) {
      expanded = !expanded;
      renderProgram();
    }
    const menu = e.target.closest(".site-header__menu-toggle");
    if (menu) {
      const h = document.querySelector(".site-header"),
        open = h.classList.toggle("site-header--menu-open");
      menu.setAttribute("aria-expanded", String(open));
    }
  });
  const initNews = () => {
    const root = document.querySelector("[data-inner-news]");
    if (!root || root.dataset.ready) return;
    root.dataset.ready = "1";
    const filterButtons = [
      ...document.querySelectorAll(".inner-filter [data-news-filter]"),
    ];
    const feedSources = [
      {
        name: "Укрінформ",
        url: "https://www.ukrinform.ua/rss/block-lastnews",
        region: "ukraine",
      },
      {
        name: "Радіо Свобода",
        url: "https://www.radiosvoboda.org/api/zrqiteuuir",
        region: "ukraine",
      },
      { name: "UOKiK", url: "https://uokik.gov.pl/feed", region: "poland" },
      {
        name: "GUS",
        url: "https://stat.gov.pl/rss/pl/5438/8.xml",
        region: "poland",
      },
    ];
    const categoryKeywords = {
      politics: [
        "політик", "политик", "вибор", "выбор", "уряд", "парламент", "президент", "minister", "sejm", "senat", "wybor", "rząd",
      ],
      sport: [
        "спорт", "футбол", "баскетбол", "теніс", "олімп", "матч", "чемпіон", "sport", "piłk", "mecz", "liga", "turniej",
      ],
      culture: [
        "культур", "мистец", "театр", "кіно", "літератур", "музей", "вистав", "концерт", "фестиваль", "kultur", "teatr", "film", "muze", "wystaw",
      ],
      society: [
        "суспіль", "громад", "соціаль", "освіт", "здоров", "місто", "społecz", "edukac", "zdrow", "miasto", "mieszkań",
      ],
    };
    const stripHtml = (value = "") => {
      const holder = document.createElement("div");
      holder.innerHTML = value;
      return (holder.textContent || "").replace(/\s+/g, " ").trim();
    };
    const detectCategory = (value = "") => {
      const text = value.toLocaleLowerCase("uk-UA");
      return (
        Object.entries(categoryKeywords).find(([, keywords]) =>
          keywords.some((keyword) => text.includes(keyword)),
        )?.[0] || "society"
      );
    };
    const fetchFeed = async (source) => {
      const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Feed unavailable");
      const data = await response.json();
      if (data.status !== "ok" || !Array.isArray(data.items))
        throw new Error("Invalid feed");
      return data.items.slice(0, 12).map((item) => ({
        id: `${source.name}-${item.guid || item.link}`,
        title: stripHtml(item.title) || source.name,
        excerpt: stripHtml(item.description || item.content).slice(0, 220),
        source: source.name,
        originalUrl: item.link,
        publishedAt: item.pubDate || new Date().toISOString(),
        category: detectCategory(
          `${item.title || ""} ${item.description || item.content || ""}`,
        ),
        region: source.region,
      }));
    };
    let items = [],
      shown = 9,
      filter = "all";
    const setActiveFilter = (activeFilter) => {
      filter = activeFilter;
      filterButtons.forEach((button) => {
        const isActive = button.dataset.newsFilter === activeFilter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    };
    const draw = () => {
      const list =
        filter === "all"
          ? items
          : items.filter(
              (x) =>
                x.category === filter ||
                (x.region ||
                  (/uokik|gus|gov\.pl|\.pl\//i.test(
                    `${x.source} ${x.originalUrl}`,
                  )
                    ? "poland"
                    : "ukraine")) === filter,
            );
      root.replaceChildren();
      list.slice(0, shown).forEach((x) => {
        const a = document.createElement("article"),
          d = document.createElement("div"),
          h = document.createElement("h2"),
          p = document.createElement("p"),
          s = document.createElement("small"),
          l = document.createElement("a");
        h.textContent = x.title || "";
        p.textContent = x.excerpt || "";
        s.textContent = x.source || "";
        l.href = x.originalUrl || x.url;
        l.target = "_blank";
        l.rel = "noopener";
        l.textContent = t("source");
        d.append(h, p, s);
        a.append(d, l);
        root.append(a);
      });
      if (!root.children.length) root.textContent = t("noMaterials");
      const more = document.querySelector("[data-news-more]");
      if (more) more.hidden = shown >= list.length;
    };
    fetch("./assets/data/news-cache.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw 0;
        return r.json();
      })
      .then((d) => {
        items = Array.isArray(d) ? d : d.items || [];
        draw();
      })
      .catch(() => (root.textContent = t("newsError")));
    Promise.allSettled(feedSources.map(fetchFeed)).then((results) => {
      const liveItems = results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => result.value)
        .filter(
          (item) =>
            item.originalUrl &&
            !feedSources.some((source) => item.originalUrl === source.url),
        )
        .filter(
          (item, index, all) =>
            all.findIndex((candidate) => candidate.id === item.id) === index,
        )
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      if (!liveItems.length) return;
      items = liveItems;
      shown = 9;
      draw();
      try {
        localStorage.setItem(
          "prywoz-news-feed-ua-pl-v5",
          JSON.stringify({ createdAt: Date.now(), items: liveItems }),
        );
      } catch {}
    });
    setActiveFilter("all");
    filterButtons.forEach((button) =>
      button.addEventListener("click", () => {
        setActiveFilter(button.dataset.newsFilter);
        shown = 9;
        draw();
      }),
    );
    document
      .querySelector("[data-news-more]")
      ?.addEventListener("click", () => {
        shown += 9;
        draw();
      });
  };
  const init = () => {
    annotate();
    applyLanguage(language);
    initNews();
    updateProgram();
  };
  document.addEventListener("prywoz:navigation", init);
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
  setInterval(renderTime, 30000);
  setInterval(updateProgram, 15000);
})();
