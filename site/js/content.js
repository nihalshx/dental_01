/* Kings Dental Center: all site copy in English and Arabic.
   Edit text here; the page fills itself from this file. */
window.KDC = {
  phone: '+97431026780',
  whatsapp: '97431026780',

  // Opening hours, Doha time (Asia/Qatar). Day numbers: 0 = Sunday ... 6 = Saturday.
  // close 24 means midnight.
  hours: {
    0: [7, 24], 1: [7, 24], 2: [7, 24], 3: [7, 24], 4: [7, 24], 5: [14, 22], 6: [7, 24]
  },


  // All branches, as published on kingsdentalcenter.com/contact (October 2026).
  // [name, address, [display, tel], [display, tel]]
  countries: [
    { id: 'qa', en: 'Qatar', ar: 'قطر', branches: [
      ['Asian Town', 'Zone 56, Street 100, Building 355, Mesaimeer', ['4417 4576', '+97444174576'], ['3329 4913', '+97433294913']],
      ['Muaither', 'Muaither N Street, Al Rayyan', ['4411 4926', '+97444114926'], ['3317 1842', '+97433171842']],
      ['Al Wakrah', 'Zone 90, Street 763, Building 46, Al Wakrah', ['4412 7012', '+97444127012'], ['3371 5911', '+97433715911']],
      ['Al Khor', 'Zone 74, Street 880, Building 124, Al Khor', ['4431 0709', '+97444310709'], ['3111 4130', '+97431114130']],
      ['Al Hilal', 'Zone 43, Street 250, Building 237, Al Mamoura', ['4469 1594', '+97444691594'], ['3000 9713', '+97430009713']],
      ['Gold Souq', 'Zone 6, Street 930, Building 3, Old Al Ghanim', ['4478 4574', '+97444784574'], ['7049 9084', '+97470499084']],
      ['Umm Salal', 'Zone 71, Street 750, Building 212, Umm Salal Mohammed', ['4427 7141', '+97444277141'], ['7767 9665', '+97477679665']],
      ['Al Attiyah', 'Zone 55, Street 860, Building 217-218, Al Attiyah', ['4414 3223', '+97444143223'], ['3110 2433', '+97431102433']],
      ['Duhail', 'Zone 31, Street 857, Building 83, Duhail, Doha', ['4437 0550', '+97444370550'], ['7711 0224', '+97477110224']],
      ['Al Markhiya', 'Zone 64, Street 370, Building 144, Al Mawrid, Markhiya, Doha', ['4417 3702', '+97444173702'], ['7766 9947', '+97477669947']],
      ['Nuaija', 'Nuaija, Doha', ['3102 6780', '+97431026780'], ['3032 7137', '+97430327137']],
      ['Najma', 'Nuaija, Doha', ['3102 6780', '+97431026780'], ['7049 9084', '+97470499084']],
      ['Al Waab', 'Al Waab, Doha', ['3009 4590', '+97430094590'], ['5585 3120', '+97455853120']],
      ['Abu Hamour', 'Abu Hamour, Doha', ['3004 4679', '+97430044679'], ['3002 2428', '+97430022428']]
    ] },
    { id: 'ae', en: 'UAE', ar: 'الإمارات', branches: [
      ['Karama, Dubai', '20b Street, Ground Floor, Hamdan Juma Building, near Al Karama, Dubai', ['04 398 4445', '+97143984445'], ['058 522 6900', '+971585226900']],
      ['Rolla, Sharjah', 'Al Aqad Street, Rolla, Sharjah', ['06 561 7577', '+97165617577'], ['058 540 1100', '+971585401100']]
    ] },
    { id: 'bh', en: 'Bahrain', ar: 'البحرين', branches: [
      ['Budaiya', 'Diraz, Budaiya', ['1732 0007', '+97317320007'], ['3834 0007', '+97338340007']]
    ] },
    { id: 'in', en: 'India', ar: 'الهند', branches: [
      ['Calicut', 'Chappayil, 15/1907, S Beach Road, Kuttichira, Kozhikode, Kerala', ['0495 355 9885', '+914953559885'], ['89433 33193', '+918943333193']],
      ['Naduvattam', 'Naduvattam, Calicut, Kerala', ['89433 02633', '+918943302633'], ['89433 02733', '+918943302733']],
      ['Kannur', 'Mahatma Gandhi Road, next to State Bank of India, Thavakkara, Kannur, Kerala', ['0497 355 1393', '+914973551393'], ['85940 94513', '+918594094513']]
    ] }
  ],

  services: [
    {
      slug: 'root-canal',
      en: { name: 'Root canal treatment', short: 'Saves a badly decayed tooth so you can keep it.',
        long: 'When decay reaches the inside of a tooth, we clean out the infected pulp, shape and seal the canals, and protect the tooth from fracturing. It is the treatment that saves a tooth you would otherwise lose.' },
      ar: { name: 'علاج قناة الجذر', short: 'ينقذ السن المتسوس بشدة لتحتفظ به.',
        long: 'عندما يصل التسوس إلى داخل السن، نقوم بتنظيف اللب الملتهب وتشكيل القنوات وإغلاقها، ونحمي السن من الكسر. إنه العلاج الذي ينقذ سنًا كنت ستفقده.' }
    },
    {
      slug: 'orthodontics',
      en: { name: 'Orthodontics', short: 'Straighter teeth and a healthier bite.',
        long: 'Orthodontic treatment is part of a complete dental plan. Straightening teeth and correcting the bite improves your oral health as well as your smile, and with good care your teeth can last a lifetime.' },
      ar: { name: 'تقويم الأسنان', short: 'أسنان مستقيمة وإطباق صحي.',
        long: 'علاج التقويم جزء من خطة شاملة لصحة الفم. تقويم الأسنان وتصحيح الإطباق يحسّن صحة فمك وجمال ابتسامتك، ومع العناية الجيدة تدوم أسنانك مدى الحياة.' }
    },
    {
      slug: 'restorative',
      en: { name: 'Restorative dentistry', short: 'Fillings that rebuild a tooth after decay.',
        long: 'After the decayed part of a tooth is removed, a filling seals and rebuilds what was lost. We will explain which filling material suits the tooth and where it sits in your mouth.' },
      ar: { name: 'طب الأسنان الترميمي', short: 'حشوات تعيد بناء السن بعد التسوس.',
        long: 'بعد إزالة الجزء المتسوس من السن، تقوم الحشوة بإغلاق السن وإعادة بناء ما فُقد. سنشرح لك نوع الحشوة الأنسب لسنك وموقعه في الفم.' }
    },
    {
      slug: 'implants',
      en: { name: 'Dental implants', short: 'A fixed replacement for a missing tooth.',
        long: 'An implant replaces the root of a missing tooth and supports a crown that looks and works like your own. We will assess your bone and gums first and plan each stage with you.' },
      ar: { name: 'زراعة الأسنان', short: 'بديل ثابت للسن المفقود.',
        long: 'تحل الزرعة محل جذر السن المفقود وتدعم تاجًا يبدو ويعمل مثل سنك الطبيعي. نقوم أولًا بتقييم العظم واللثة ونخطط لكل مرحلة معك.' }
    },
    {
      slug: 'gums',
      en: { name: 'Gum disease treatment', short: 'Periodontal care for gums and the bone beneath.',
        long: 'Gum disease is an inflammation that can destroy the gums and the bone that holds your teeth. Our periodontal care treats it early and helps you keep your teeth for longer.' },
      ar: { name: 'علاج أمراض اللثة', short: 'عناية باللثة والعظم الداعم للأسنان.',
        long: 'أمراض اللثة التهاب قد يدمّر اللثة والعظم الذي يثبّت أسنانك. نعالجها مبكرًا لنساعدك على الحفاظ على أسنانك لفترة أطول.' }
    },
    {
      slug: 'cosmetic',
      en: { name: 'Cosmetic dentistry', short: 'Tell us the smile you want. We will plan it.',
        long: 'We offer a range of cosmetic options depending on your teeth. The best start is simply to tell us how you would like your smile to look, and we will match the right treatment to it.' },
      ar: { name: 'تجميل الأسنان', short: 'أخبرنا بالابتسامة التي تريدها وسنخطط لها.',
        long: 'نقدم مجموعة من الحلول التجميلية حسب حالة أسنانك. أفضل بداية أن تخبرنا كيف تريد أن تبدو ابتسامتك، ونختار لك العلاج المناسب.' }
    },
    {
      slug: 'children',
      en: { name: "Children's dentistry", short: 'Gentle care for children and teens.',
        long: "We diagnose and treat dental problems in children and teenagers. Good habits start early, so bring your child in for their first check-up and we will make it an easy visit." },
      ar: { name: 'طب أسنان الأطفال', short: 'رعاية لطيفة للأطفال والمراهقين.',
        long: 'نشخّص ونعالج مشاكل الأسنان لدى الأطفال والمراهقين. العادات الجيدة تبدأ مبكرًا، فأحضر طفلك لأول فحص وسنجعلها زيارة سهلة.' }
    },
    {
      slug: 'preventive',
      en: { name: 'Preventive dentistry', short: 'Check-ups that catch problems early.',
        long: 'Regular check-ups find problems while they are small. When a tooth does need to come out, such as an infected or impacted wisdom tooth, we take care of the extraction too.' },
      ar: { name: 'طب الأسنان الوقائي', short: 'فحوصات تكشف المشاكل مبكرًا.',
        long: 'الفحوصات المنتظمة تكشف المشاكل وهي صغيرة. وعندما يحتاج السن إلى الخلع، مثل ضرس العقل الملتهب أو المنطمر، نتولى الخلع أيضًا.' }
    }
  ],

  faq: [
    { en: ['When is Kings Dental Center open?', 'Saturday to Thursday from 7 AM to midnight, and Friday from 2 PM to 10 PM, Doha time.'],
      ar: ['ما هي مواعيد عمل مركز كينجز لطب الأسنان؟', 'من السبت إلى الخميس من 7 صباحًا حتى منتصف الليل، ويوم الجمعة من 2 ظهرًا حتى 10 مساءً بتوقيت الدوحة.'] },
    { en: ['Where are your clinics?', 'We have 14 clinics across Qatar, including Asian Town, Al Wakrah, Al Khor, Duhail, Umm Salal and Al Markhiya, plus branches in Dubai, Sharjah, Bahrain and Kerala. See the full list with phone numbers under "Our clinics".'],
      ar: ['أين تقع عياداتكم؟', 'لدينا 14 عيادة في أنحاء قطر منها آسيان تاون والوكرة والخور والدحيل وأم صلال والمرخية، إضافة إلى فروع في دبي والشارقة والبحرين وكيرالا. اطلع على القائمة الكاملة مع أرقام الهواتف في قسم "عياداتنا".'] },
    { en: ['Which insurance do you accept?', 'We work with insurers including Al Koot, QLM, MetLife and Allianz. Send a photo of your card on WhatsApp and we will confirm your cover.'],
      ar: ['ما شركات التأمين التي تقبلونها؟', 'نتعامل مع شركات منها الكوت وQLM وميتلايف وأليانز. أرسل صورة بطاقتك عبر واتساب وسنؤكد لك التغطية.'] },
    { en: ['Do you treat children?', 'Yes. Our pediatric dentistry covers diagnosis and treatment for children and teenagers.'],
      ar: ['هل تعالجون الأطفال؟', 'نعم. يشمل قسم طب أسنان الأطفال التشخيص والعلاج للأطفال والمراهقين.'] },
    { en: ['How do I book an appointment?', 'Call +974 3102 6780, message us on WhatsApp, or use the booking form on this page.'],
      ar: ['كيف أحجز موعدًا؟', 'اتصل على 6780 3102 974+، أو راسلنا عبر واتساب، أو استخدم نموذج الحجز في هذه الصفحة.'] },
    { en: ['I am visiting Qatar. Can I get treatment?', 'Yes. Kings Dental Tourism looks after patients travelling to Qatar. Message us on WhatsApp with your dates and the treatment you need.'],
      ar: ['أنا زائر لقطر، هل يمكنني العلاج؟', 'نعم. تهتم خدمة كينجز للسياحة العلاجية بالمرضى القادمين إلى قطر. راسلنا عبر واتساب مع مواعيدك والعلاج الذي تحتاجه.'] }
  ],

  days: {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
  },

  t: {
    en: {
      heroKicker2: 'Kings Dental Center, Qatar',
      chatCta: 'Prefer to chat? Ask Noor, our virtual receptionist',
      reviewAsk: 'Been to one of our clinics? Your review helps other patients choose with confidence.', reviewWrite: 'Write a review',
      menu: 'Menu', statClinics: 'clinics', statCountries: 'countries', statSpecialties: 'specialties', statDays: 'days a week',
      netTitle2: 'Find your nearest clinic',
      tourTitle: 'Visiting Qatar for treatment?',
      tourText: "Kings Dental Tourism looks after patients travelling to Qatar for dental care. Send us your travel dates and the treatment you need on WhatsApp, and we'll plan your visits around your stay.",
      tourCta: 'Plan my visit on WhatsApp',
      heroW1: 'Smile,', heroW2: 'differently.', qbBtn: 'Book on WhatsApp',
      qbMsg: 'Hello Kings Dental Center, I would like to book an appointment.\nTreatment: {s}\nClinic: {c}',
      treatLede: 'Eight specialties, one team. Choose a treatment to see how it works.',
      readMore: 'How it works',
      stepsTitle: 'What happens at your visit?',
      step1t: 'A thorough examination', step1d: 'A specialist examines your teeth and gums carefully before recommending anything.',
      step2t: 'A plan that suits you', step2d: 'We recommend the treatment that fits your condition and explain it in plain words.',
      step3t: 'Treatment and prevention', step3d: 'We treat what needs treating, then help you keep your teeth healthy so problems don\'t return.',
      kidsTitle: 'Raise your children with healthy, glowing smiles.',
      kidsText: 'Our pediatric dentists take an affectionate approach, adapting to each child\'s mood and behaviour so they feel relaxed. Calm, hygienic clinics and a focus on prevention from the start make every visit a positive one.',
      kidsCta: 'Children\'s dentistry',
      netTitle: 'clinics in four countries', netLede: 'Find the Kings Dental Center nearest you. Tap a number to call the branch.',
      netCount: '{n} clinics', directions: 'Directions', callBranch: 'Call', mobile: 'Mobile',
      fClinic: 'Clinic', fClinicAny: 'Any clinic',
      footTreat: 'Treatments', allBranches: 'All branches',
      bookName: 'Book {s}', otherTreat: 'Other treatments', backHome: 'Kings Dental Center', treatCrumb: 'Treatments',
      atKings: 'At Kings Dental Center',
      treatCtaText: 'Call us or send your request on WhatsApp. We\'ll find a time that suits you.',
      skip: 'Skip to content', brandSub: 'Dental Center',
      navServices: 'Services', navVisit: 'Visit', navInsurance: 'Insurance', navFaq: 'Questions',
      heroKicker: 'Kings Dental Center, Doha', heroTitle: 'Smile, differently.',
      heroLede: 'Comprehensive dental care, near you. Eight specialties and 14 clinics across Qatar, open until midnight six days a week.',
      ctaBook: 'Book a visit', ctaCall: 'Call',
      throughTitle: 'Every specialty you need, in one place.',
      throughText: "From a child's first check-up to implants and orthodontics, your whole family can be cared for by one team.",
      servicesTitle: 'What can we treat?', servicesLede: 'Choose a treatment to read more, then book it in one tap.',
      bookThis: 'Book this treatment',
      statement: 'Kings Dental Center is part of the Kings family in Qatar, alongside Modern Dental Lab, Kings Pharmacy and Queens Dermatology Center.',
      visitTitle: 'When are we open?', clockLabel: 'Doha time', whereTitle: 'Head office', navClinics: 'Clinics',
      addr1: 'Kings Head Office, Gate 8', addr2: 'Grand Mall Building, Asian Town', addr3: 'Industrial Area, Doha, Qatar',
      ctaMap: 'Open in Google Maps',
      insureTitle: 'Do you accept my insurance?',
      insureLede: "We work with insurers including these. Send us your card on WhatsApp and we'll confirm your cover before your visit.",
      voiceTitle: 'What patients say',
      reviewEn: '"The best treatment I\'ve seen among the private hospitals, and their prices are very reasonable."',
      reviewSrc: 'Google review, November 2021', ctaReviews: 'Read all reviews on Google',
      faqTitle: 'Questions patients ask',
      bookTitle: 'Book your visit', bookLede: 'Fill this in and it opens WhatsApp with your request ready to send. Prefer to talk? Call us.',
      fName: 'Your name', fPhone: 'Mobile number', fService: 'Treatment', fWhen: 'Preferred day', fAny: 'Not sure yet',
      fSoonest: 'Soonest available', consent: 'We only use these details to arrange your appointment.',
      fSubmit: 'Send on WhatsApp', fNeed: 'Add your name and mobile number so we can reach you.',
      fOpened: 'WhatsApp opened with your request. Press send there to book.',
      footContact: 'Contact', footHours: 'Hours', footHours1: 'Saturday to Thursday, 7 AM to 12 AM', footHours2: 'Friday, 2 PM to 10 PM',
      footMore: 'Kings Dental', footTourism: 'Dental tourism', footCareers: 'Careers', footFollow: 'Follow',
      family: 'Part of the Kings group: Kings Pharmacy, Modern Dental Lab, Queens Dermatology Center, Queens Salon, Kings Trading and more.',
      dockWa: 'WhatsApp', dockChat: 'Noor', dockCall: 'Call',
      openUntil: 'Open now until {t}', opensAt: 'Closed. Opens {d} at {t}', opensToday: 'Closed. Opens today at {t}',
      callUs: 'Call us', midnight: 'midnight', tomorrow: 'tomorrow', closed: 'Closed', today: 'Today',
      longOpen: 'We are open right now, until {t}. Walk in or call ahead.',
      longClosed: 'We are closed right now and open again {d} at {t}. Message us on WhatsApp and we will reply when we open.',
      waMsg: 'Hello Kings Dental Center, I would like to book an appointment.\nName: {n}\nMobile: {p}\nTreatment: {s}\nClinic: {c}\nPreferred day: {w}'
    },
    ar: {
      heroKicker2: 'مركز كينجز لطب الأسنان، قطر',
      chatCta: 'تفضّل المحادثة؟ اسأل نور، موظفة الاستقبال الافتراضية',
      reviewAsk: 'زرت إحدى عياداتنا؟ تقييمك يساعد المرضى الآخرين على الاختيار بثقة.', reviewWrite: 'اكتب تقييمًا',
      menu: 'القائمة', statClinics: 'عيادة', statCountries: 'دول', statSpecialties: 'تخصصات', statDays: 'أيام في الأسبوع',
      netTitle2: 'اعثر على أقرب عيادة',
      tourTitle: 'تزور قطر للعلاج؟',
      tourText: 'تهتم خدمة كينجز للسياحة العلاجية بالمرضى القادمين إلى قطر لعلاج أسنانهم. أرسل لنا مواعيد سفرك والعلاج الذي تحتاجه عبر واتساب، وسنرتب زياراتك بما يناسب إقامتك.',
      tourCta: 'خطط لزيارتي عبر واتساب',
      heroW1: 'ابتسم،', heroW2: 'بشكل مختلف.', qbBtn: 'احجز عبر واتساب',
      qbMsg: 'مرحبًا مركز كينجز لطب الأسنان، أود حجز موعد.\nالعلاج: {s}\nالعيادة: {c}',
      treatLede: 'ثمانية تخصصات وفريق واحد. اختر العلاج لترى كيف يتم.',
      readMore: 'كيف يتم',
      stepsTitle: 'ماذا يحدث في زيارتك؟',
      step1t: 'فحص دقيق', step1d: 'يفحص أخصائي أسنانك ولثتك بعناية قبل أي توصية.',
      step2t: 'خطة تناسبك', step2d: 'نوصي بالعلاج المناسب لحالتك ونشرحه بكلمات واضحة.',
      step3t: 'العلاج والوقاية', step3d: 'نعالج ما يحتاج إلى علاج، ثم نساعدك على الحفاظ على صحة أسنانك حتى لا تعود المشاكل.',
      kidsTitle: 'ربِّ أطفالك على ابتسامات صحية ومشرقة.',
      kidsText: 'يتعامل أطباء أسنان الأطفال لدينا بأسلوب حنون يراعي مزاج كل طفل وسلوكه ليشعر بالراحة. عيادات هادئة ونظيفة وتركيز على الوقاية منذ البداية يجعلان كل زيارة تجربة إيجابية.',
      kidsCta: 'طب أسنان الأطفال',
      netTitle: 'عيادة في أربع دول', netLede: 'اعثر على أقرب مركز كينجز لطب الأسنان إليك. اضغط على الرقم للاتصال بالفرع.',
      netCount: '{n} عيادات', directions: 'الاتجاهات', callBranch: 'اتصال', mobile: 'جوال',
      fClinic: 'العيادة', fClinicAny: 'أي عيادة',
      footTreat: 'العلاجات', allBranches: 'كل الفروع',
      bookName: 'احجز {s}', otherTreat: 'علاجات أخرى', backHome: 'مركز كينجز لطب الأسنان', treatCrumb: 'العلاجات',
      atKings: 'في مركز كينجز لطب الأسنان',
      treatCtaText: 'اتصل بنا أو أرسل طلبك عبر واتساب وسنجد موعدًا يناسبك.',
      skip: 'انتقل إلى المحتوى', brandSub: 'لطب الأسنان',
      navServices: 'الخدمات', navVisit: 'الزيارة', navInsurance: 'التأمين', navFaq: 'الأسئلة',
      heroKicker: 'مركز كينجز لطب الأسنان، الدوحة', heroTitle: 'ابتسم، بشكل مختلف.',
      heroLede: 'رعاية شاملة للأسنان، بالقرب منك. ثمانية تخصصات و14 عيادة في أنحاء قطر، مفتوحة حتى منتصف الليل ستة أيام في الأسبوع.',
      ctaBook: 'احجز زيارة', ctaCall: 'اتصل',
      throughTitle: 'كل التخصصات التي تحتاجها، في مكان واحد.',
      throughText: 'من أول فحص لطفلك إلى الزراعة والتقويم، يمكن لعائلتك كلها أن تُعالج لدى فريق واحد.',
      servicesTitle: 'ماذا نعالج؟', servicesLede: 'اختر العلاج لتقرأ المزيد، ثم احجزه بلمسة واحدة.',
      bookThis: 'احجز هذا العلاج',
      statement: 'مركز كينجز لطب الأسنان جزء من مجموعة كينجز في قطر، إلى جانب مختبر مودرن للأسنان وصيدلية كينجز ومركز كوينز للأمراض الجلدية.',
      visitTitle: 'متى نكون مفتوحين؟', clockLabel: 'توقيت الدوحة', whereTitle: 'المكتب الرئيسي', navClinics: 'العيادات',
      addr1: 'المكتب الرئيسي لكينجز، البوابة 8', addr2: 'مبنى جراند مول، آسيان تاون', addr3: 'المنطقة الصناعية، الدوحة، قطر',
      ctaMap: 'افتح في خرائط جوجل',
      insureTitle: 'هل تقبلون تأميني؟',
      insureLede: 'نتعامل مع شركات تأمين منها هذه الشركات. أرسل لنا بطاقتك عبر واتساب وسنؤكد تغطيتك قبل زيارتك.',
      voiceTitle: 'ماذا يقول المرضى',
      reviewEn: '',
      reviewSrc: 'تقييم على جوجل، نوفمبر 2021', ctaReviews: 'اقرأ كل التقييمات على جوجل',
      faqTitle: 'أسئلة يطرحها المرضى',
      bookTitle: 'احجز زيارتك', bookLede: 'املأ النموذج وسيفتح واتساب برسالتك جاهزة للإرسال. تفضّل الاتصال؟ اتصل بنا.',
      fName: 'الاسم', fPhone: 'رقم الجوال', fService: 'العلاج', fWhen: 'اليوم المفضل', fAny: 'لست متأكدًا بعد',
      fSoonest: 'أقرب موعد متاح', consent: 'نستخدم هذه البيانات فقط لترتيب موعدك.',
      fSubmit: 'أرسل عبر واتساب', fNeed: 'أضف اسمك ورقم جوالك لنتمكن من التواصل معك.',
      fOpened: 'تم فتح واتساب برسالتك. اضغط إرسال هناك لإتمام الحجز.',
      footContact: 'تواصل', footHours: 'المواعيد', footHours1: 'السبت إلى الخميس، 7 صباحًا حتى 12 منتصف الليل', footHours2: 'الجمعة، 2 ظهرًا حتى 10 مساءً',
      footMore: 'كينجز لطب الأسنان', footTourism: 'السياحة العلاجية', footCareers: 'الوظائف', footFollow: 'تابعنا',
      family: 'جزء من مجموعة كينجز: صيدلية كينجز، مختبر مودرن للأسنان، مركز كوينز للأمراض الجلدية، صالون كوينز، كينجز للتجارة وغيرها.',
      dockWa: 'واتساب', dockChat: 'نور', dockCall: 'اتصال',
      openUntil: 'مفتوح الآن حتى {t}', opensAt: 'مغلق. نفتح {d} الساعة {t}', opensToday: 'مغلق. نفتح اليوم الساعة {t}',
      callUs: 'اتصل بنا', midnight: 'منتصف الليل', tomorrow: 'غدًا', closed: 'مغلق', today: 'اليوم',
      longOpen: 'نحن مفتوحون الآن حتى {t}. تفضل بالزيارة أو اتصل مسبقًا.',
      longClosed: 'نحن مغلقون الآن ونفتح {d} الساعة {t}. راسلنا عبر واتساب وسنرد عند الافتتاح.',
      waMsg: 'مرحبًا مركز كينجز لطب الأسنان، أود حجز موعد.\nالاسم: {n}\nالجوال: {p}\nالعلاج: {s}\nالعيادة: {c}\nاليوم المفضل: {w}'
    }
  }
};
