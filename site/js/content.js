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
    { en: ['Where is the clinic?', 'At the Kings Head Office, Gate 8, Grand Mall Building, Asian Town in the Industrial Area of Doha. Tap "Open in Google Maps" for directions.'],
      ar: ['أين يقع المركز؟', 'في المكتب الرئيسي لكينجز، البوابة 8، مبنى جراند مول، آسيان تاون، المنطقة الصناعية بالدوحة. اضغط "افتح في خرائط جوجل" للاتجاهات.'] },
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
      skip: 'Skip to content', brandSub: 'Dental Center',
      navServices: 'Services', navVisit: 'Visit', navInsurance: 'Insurance', navFaq: 'Questions',
      heroKicker: 'Kings Dental Center, Doha', heroTitle: 'Smile, differently.',
      heroLede: 'Comprehensive dental care, near you. Eight specialties under one roof in Asian Town, open until midnight six days a week.',
      ctaBook: 'Book a visit', ctaCall: 'Call',
      throughTitle: 'Every specialty you need, in one place.',
      throughText: "From a child's first check-up to implants and orthodontics, your whole family can be cared for by one team.",
      servicesTitle: 'What can we treat?', servicesLede: 'Choose a treatment to read more, then book it in one tap.',
      bookThis: 'Book this treatment',
      statement: 'Kings Dental Center is part of the Kings family in Qatar, alongside Modern Dental Lab, Kings Pharmacy and Queens Dermatology Center.',
      visitTitle: 'When are we open?', clockLabel: 'Doha time', whereTitle: 'Where to find us',
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
      dockWa: 'WhatsApp',
      openUntil: 'Open now until {t}', opensAt: 'Closed. Opens {d} at {t}', opensToday: 'Closed. Opens today at {t}',
      callUs: 'Call us', midnight: 'midnight', tomorrow: 'tomorrow', closed: 'Closed', today: 'Today',
      longOpen: 'We are open right now, until {t}. Walk in or call ahead.',
      longClosed: 'We are closed right now and open again {d} at {t}. Message us on WhatsApp and we will reply when we open.',
      waMsg: 'Hello Kings Dental Center, I would like to book an appointment.\nName: {n}\nMobile: {p}\nTreatment: {s}\nPreferred day: {w}'
    },
    ar: {
      skip: 'انتقل إلى المحتوى', brandSub: 'لطب الأسنان',
      navServices: 'الخدمات', navVisit: 'الزيارة', navInsurance: 'التأمين', navFaq: 'الأسئلة',
      heroKicker: 'مركز كينجز لطب الأسنان، الدوحة', heroTitle: 'ابتسم، بشكل مختلف.',
      heroLede: 'رعاية شاملة للأسنان، بالقرب منك. ثمانية تخصصات تحت سقف واحد في آسيان تاون، مفتوح حتى منتصف الليل ستة أيام في الأسبوع.',
      ctaBook: 'احجز زيارة', ctaCall: 'اتصل',
      throughTitle: 'كل التخصصات التي تحتاجها، في مكان واحد.',
      throughText: 'من أول فحص لطفلك إلى الزراعة والتقويم، يمكن لعائلتك كلها أن تُعالج لدى فريق واحد.',
      servicesTitle: 'ماذا نعالج؟', servicesLede: 'اختر العلاج لتقرأ المزيد، ثم احجزه بلمسة واحدة.',
      bookThis: 'احجز هذا العلاج',
      statement: 'مركز كينجز لطب الأسنان جزء من مجموعة كينجز في قطر، إلى جانب مختبر مودرن للأسنان وصيدلية كينجز ومركز كوينز للأمراض الجلدية.',
      visitTitle: 'متى نكون مفتوحين؟', clockLabel: 'توقيت الدوحة', whereTitle: 'كيف تجدنا',
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
      dockWa: 'واتساب',
      openUntil: 'مفتوح الآن حتى {t}', opensAt: 'مغلق. نفتح {d} الساعة {t}', opensToday: 'مغلق. نفتح اليوم الساعة {t}',
      callUs: 'اتصل بنا', midnight: 'منتصف الليل', tomorrow: 'غدًا', closed: 'مغلق', today: 'اليوم',
      longOpen: 'نحن مفتوحون الآن حتى {t}. تفضل بالزيارة أو اتصل مسبقًا.',
      longClosed: 'نحن مغلقون الآن ونفتح {d} الساعة {t}. راسلنا عبر واتساب وسنرد عند الافتتاح.',
      waMsg: 'مرحبًا مركز كينجز لطب الأسنان، أود حجز موعد.\nالاسم: {n}\nالجوال: {p}\nالعلاج: {s}\nاليوم المفضل: {w}'
    }
  }
};
