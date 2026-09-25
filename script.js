(function(){
  "use strict";

  /* ---------------- ICONS ---------------- */
  var icons = {
    vase:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M24 10h16l-2 10c4 4 6 10 6 16 0 10-7 16-12 16s-12-6-12-16c0-6 2-12 6-16z"/><line x1="22" y1="10" x2="42" y2="10"/></svg>',
    lamp:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 22l4-12h20l4 12z"/><line x1="32" y1="22" x2="32" y2="44"/><line x1="24" y1="50" x2="40" y2="50"/><line x1="32" y1="44" x2="32" y2="50"/></svg>',
    frame:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="14" y="12" width="36" height="40" rx="2"/><rect x="20" y="18" width="24" height="28" rx="1"/></svg>',
    basket:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 26h36l-4 24a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z"/><path d="M22 26c0-8 4-14 10-14s10 6 10 14"/></svg>',
    clock:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="32" r="20"/><path d="M32 22v10l7 5"/></svg>',
    pot:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 28h24l-3 22a3 3 0 0 1-3 3H26a3 3 0 0 1-3-3z"/><path d="M18 28h28"/><path d="M32 28c0-10-8-12-8-20 6 0 8 8 8 8s2-8 8-8c0 8-8 10-8 20z"/></svg>',
    box:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><rect x="14" y="26" width="36" height="24" rx="2"/><path d="M14 30l18-12 18 12"/></svg>',
    mirror:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="32" cy="26" rx="14" ry="18"/><line x1="32" y1="44" x2="32" y2="54"/><line x1="24" y1="54" x2="40" y2="54"/></svg>',
    garland:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 16c10 8 34 8 44 0"/><line x1="18" y1="18" x2="18" y2="30"/><line x1="32" y1="22" x2="32" y2="38"/><line x1="46" y1="18" x2="46" y2="30"/><circle cx="18" cy="34" r="4"/><circle cx="32" cy="42" r="4"/><circle cx="46" cy="34" r="4"/></svg>',
    keychainTrophy:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="8" r="4"/><line x1="32" y1="12" x2="32" y2="18"/><path d="M24 18h16l-2 10c3 3 4 7 4 11 0 7-5 11-10 11s-10-4-10-11c0-4 1-8 4-11z"/><line x1="22" y1="18" x2="42" y2="18"/><path d="M26 46h12l1 6H25z"/></svg>',
    keychainGiraffe:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="8" r="4"/><line x1="32" y1="12" x2="32" y2="17"/><ellipse cx="32" cy="24" rx="7" ry="6"/><circle cx="29" cy="22" r="1.4" fill="currentColor" stroke="none"/><circle cx="35" cy="22" r="1.4" fill="currentColor" stroke="none"/><path d="M27 30c-2 8-3 16-2 24" /><path d="M37 30c2 8 3 16 2 24"/><path d="M26 54h4M34 54h4"/></svg>',
    keychainVase:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="8" r="4"/><line x1="32" y1="12" x2="32" y2="18"/><path d="M27 18h10l-1 7c3 3 4 6 4 10 0 6-4 10-8 10s-8-4-8-10c0-4 1-7 4-10z"/><line x1="26" y1="18" x2="38" y2="18"/></svg>',
    floorLamp:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 8h20l-4 12H26z"/><line x1="32" y1="20" x2="32" y2="52"/><ellipse cx="32" cy="56" rx="12" ry="3"/><line x1="24" y1="56" x2="24" y2="56"/></svg>',
    clockWoven:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="20" stroke-dasharray="2 4"/><circle cx="32" cy="32" r="13"/><path d="M32 24v8l6 4"/></svg>',
    wallPlanter:'<svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 6l16 4-4 34-14-4z"/><line x1="26" y1="10" x2="18" y2="2"/><line x1="38" y1="10" x2="42" y2="2"/><path d="M26 20c2 6 1 12-1 18" stroke-width="1.6"/></svg>'
  };

  // Products with a real photo set `photo` to a path under assets/products/;
  // thumbHTML() uses that photo everywhere instead of the placeholder SVG icon.
  function thumbHTML(p){
    if(!p) return '';
    if(p.imagePath){
      return '<img src="assets/' + p.imagePath + '" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
    }
    if(p.photo){
      return '<img src="assets/products/' + p.photo + '" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
    }
    return (icons && p.icon && icons[p.icon]) ? icons[p.icon] : (icons && icons.vase ? icons.vase : '');
  }

  /* ---------------- I18N ---------------- */
  var LANG_KEY = 'decorna_lang';
  var storedLang = localStorage.getItem(LANG_KEY);
  var lang = (storedLang === 'en' || storedLang === 'ar') ? storedLang : 'fr';
  var RTL_LANGS = {ar:true};

  var i18n = {
    fr: {
      page_title: 'Decorna — Déco recyclée, faite à Khemisset',
      loading: 'Chargement…',
      nav_home: 'Accueil',
      nav_products: 'Produits',
      nav_about: 'À propos',
      nav_team: 'Notre équipe',
      aria_logo_home: 'Accueil Decorna',
      aria_hamburger: 'Ouvrir le menu',
      aria_profile: 'Mon profil',
      aria_view_cart: 'Voir le panier',
      aria_cart_drawer: 'Panier',
      aria_close_cart: 'Fermer le panier',
      aria_search: 'Rechercher un produit',
      aria_deco_open: "Ouvrir l'assistant DECO",
      aria_deco_panel: 'Assistant DECO',
      aria_deco_close: "Fermer l'assistant",
      aria_deco_input: 'Écrire à DECO',
      aria_deco_send: 'Envoyer',
      aria_theme_toggle_dark: 'Activer le mode sombre',
      aria_theme_toggle_light: 'Activer le mode clair',
      eyebrow_home: 'Atelier du recyclage · Lycée Al Fath · Khemisset',
      hero_title: 'Du plastique recyclé, devenu objet de collection.',
      hero_lede: 'Decorna est une entreprise scolaire née au Lycée Al Fath à Khemisset. Nous collectons le plastique abandonné pour le transformer, à la main, en pièces de décoration durables et uniques.',
      see_products: 'Découvrir la collection',
      our_story_btn: 'Notre démarche',
      stat_waste: 'Déchets revalorisés',
      stat_designs: 'Modèles d\'atelier',
      stat_students: 'Façonné par les élèves',
      pillar1_title: 'Collecte locale & tri',
      pillar1_desc: 'Plastiques propres récupérés auprès des commerçants de proximité à Khemisset.',
      pillar2_title: 'Façonnage artisanal',
      pillar2_desc: 'Découpe de précision, renfort structurel et finitions soignées réalisées à la main par les élèves du Lycée Al Fath.',
      pillar3_title: 'Design circulaire',
      pillar3_desc: 'Une seconde vie noble sous forme d\'objets singuliers et durables, pensés pour embellir les intérieurs avec sens.',
      bestsellers_eyebrow: 'Sélection de l\'Atelier',
      bestsellers_title: 'Nos créations phares',
      home_quote: 'Transformer un déchet en objet d\'artisanat, c\'est redonner de la valeur à ce que l\'on ne regardait plus, tout en formant les créateurs de demain.',
      home_quote_author: '— L\'Atelier Decorna · Élèves entrepreneurs du Lycée Al Fath, Khemisset',
      video_eyebrow: 'Documentaire Atelier · Khemisset',
      video_title: "De la matière brute à l'objet singulier",
      video_desc: "À Khemisset, le plastique collecté trouve une seconde vie entre les mains des élèves du Lycée Al Fath. Chaque création témoigne d'un savoir-faire artisanal et d'un engagement environnemental concret.",
      showcase_eyebrow: 'En vidéo',
      showcase_title: "Tous nos produits en un coup d'œil",
      showcase_desc: 'Un aperçu rapide de toute la collection Decorna — vases, luminaires, cadres et plus, tous faits main.',
      view_all: 'Tout voir',
      eyebrow_shop: 'Boutique',
      our_products_title: 'Nos produits',
      search_placeholder: 'Rechercher un objet déco…',
      empty_state: 'Aucun produit ne correspond à votre recherche. Essayez un autre mot-clé.',
      eyebrow_story: 'Notre histoire',
      about_title: 'Une entreprise née dans un lycée',
      about_p1: "Decorna est un projet entrepreneurial porté par des élèves du Lycée Al Fath, à Khemisset. Notre constat est simple : le plastique jeté chaque jour peut devenir de belles pièces pour la maison, au lieu de finir à la décharge.",
      about_p2: "Nous récupérons les matériaux auprès de commerces et de familles du quartier, puis nous les nettoyons, les renforçons et les transformons en vases, lampes, cadres et objets de rangement, entièrement façonnés à la main par notre équipe.",
      step1_title: 'Collecte',
      step1_desc: 'On récupère le plastique auprès des commerces et habitants de Khemisset.',
      step2_title: 'Tri',
      step2_desc: 'Chaque matériau est nettoyé et trié selon sa solidité et sa couleur.',
      step3_title: 'Transformation',
      step3_desc: 'Découpe, renforcement et assemblage à la main par les élèves.',
      step4_title: 'Création',
      step4_desc: 'Peinture, finitions et contrôle qualité avant la mise en vente.',
      credit_title: "Un projet d'élèves, pour la planète",
      credit_desc: "Decorna est conçu et géré par des lycéens du Lycée Al Fath de Khemisset, dans le cadre d'un projet entrepreneurial scolaire centré sur le recyclage local.",
      contact_eyebrow: "Nous contacter",
      contact_title: "Une question ? Un partenariat ?",
      contact_desc: "L'équipe Decorna est à votre écoute pour toute demande d'information, commande sur mesure ou proposition de collaboration.",
      contact_btn_email: "Nous écrire par email",
      contact_btn_ig: "Instagram",
      eyebrow_team: "L'équipe",
      team_title: "L'équipe",
      team_intro: "Nous croyons que réunir des personnes dans le meilleur cadre possible, autour de valeurs communes fortes, donne naissance à de grandes choses. Decorna est une aventure humaine portée par une petite équipe soudée d'élèves du Lycée Al Fath.",
      team1_name: 'Taoufiq Essasbou',
      team1_role: 'PDG — Président-Directeur Général',
      team1_bio: "Supervise l'ensemble du projet Decorna et coordonne les équipes.",
      team2_name: 'Mohamed Bout',
      team2_role: 'DP — Directeur de Production',
      team2_bio: 'Pilote la fabrication des produits, du tri des matériaux à la finition.',
      team3_name: 'Maroua Kachouch',
      team3_role: 'RP — Responsable de Production',
      team3_bio: 'Assiste la production : découpe, assemblage et contrôle qualité.',
      team4_name: 'Haytam Azzarwal',
      team4_role: 'DTV — Directeur Technologie & Développement',
      team4_bio: 'Pilote le développement technique et les outils technologiques de Decorna.',
      team5_name: 'Sara Boushaba',
      team5_role: 'RTV — Responsable Technologie & Développement',
      team5_bio: 'Participe au développement du site et au support technique.',
      team6_name: 'Tassnim Qada',
      team6_role: 'DM — Directeur Marketing',
      team6_bio: "Définit la stratégie marketing et l'image de Decorna.",
      team7_name: 'Malak Benwazan',
      team7_role: 'RM — Responsable Marketing',
      team7_bio: 'Anime les réseaux sociaux et soutient les actions marketing.',
      team_note: 'Envie de rejoindre l\'aventure Decorna ou de proposer un partenariat\u00a0? Écrivez-nous — nos coordonnées sont juste en bas de page.',
      tab_login: 'Se connecter',
      tab_signup: 'Créer un compte',
      label_email: 'Adresse e-mail',
      placeholder_email: 'toi@exemple.com',
      label_password: 'Mot de passe',
      label_fullname: 'Nom complet',
      placeholder_name: 'Ton nom',
      btn_signup_submit: 'Créer mon compte',
      btn_logout: 'Se déconnecter',
      order_empty_pre: "Tu n'as pas encore de commande. Va faire un tour dans nos ",
      order_empty_link: 'produits',
      order_empty_post: ' !',
      gallery_title: 'Galerie Decorna',
      gallery_sub: 'Quelques inspirations de décoration recyclée.',
      alt_deco1: 'Décoration recyclée',
      alt_deco2: 'Lampe décorative',
      alt_deco3: 'Intérieur écologique',
      footer_desc: 'Déco recyclée fabriquée à Khemisset par les élèves du Lycée Al Fath, Maroc.',
      footer_bottom: '© 2026 Decorna — Projet des élèves du Lycée Al Fath, Khemisset, Maroc',
      cart_title: 'Ton panier',
      cart_total_label: 'Total',
      checkout_btn: 'Valider la commande',
      payment_title: 'Mode de paiement',
      payment_cod: 'À la livraison',
      payment_card: 'Carte bancaire',
      card_name_placeholder: 'Nom sur la carte',
      card_number_placeholder: '1234 1234 1234 1234',
      card_demo_note: "Paiement de démonstration — aucune vraie transaction n'est effectuée.",
      guest_email_label: 'Email pour le suivi de commande',
      card_error_number: 'Numéro de carte invalide.',
      card_error_name: 'Le nom sur la carte est requis.',
      card_error_expiry: "Date d'expiration invalide (MM/AA).",
      card_error_cvc: 'CVC invalide.',
      toast_order_cod: 'Commande enregistrée — règlement à la livraison.',
      toast_order_card: 'Paiement validé — commande confirmée.',
      toast_order_error: "Une erreur est survenue, veuillez réessayer.",
      cart_empty: 'Votre panier est vide pour le moment. Découvrez nos créations d\'atelier.',
      deco_subtitle: 'Assistant d\'Atelier',
      deco_input_placeholder: 'Posez votre question…',
      add_btn: 'Ajouter',
      read_more_btn: 'Détails',
      product_page_back: 'Retour à la collection',
      product_page_collection: 'Collection',
      product_page_view_cart: 'Voir mon panier',
      stock_label: '{n} en stock',
      stock_low: "Plus que {n} en stock !",
      stock_out: 'Rupture de stock',
      remove_btn: 'Retirer',
      aria_qty_dec: 'Réduire la quantité',
      aria_qty_inc: 'Augmenter la quantité',
      toast_added_suffix: 'ajouté au panier',
      toast_removed: 'Article retiré du panier',
      toast_cart_empty: 'Votre panier est vide',
      toast_order_simulated: 'Commande enregistrée — merci pour votre soutien.',
      toast_login_success: 'Connexion réussie',
      toast_welcome: 'Bienvenue chez Decorna, {name} !',
      toast_logout: 'À bientôt !',
      profile_greeting: 'Bonjour, {name}',
      deco_greeting: 'Bonjour, je suis DECO, votre guide d\'atelier. Comment puis-je vous renseigner sur nos créations artisanales ?',
      q_see_products: 'Voir les produits',
      q_how_add_cart: 'Comment ajouter au panier ?',
      q_create_account: 'Créer un compte',
      q_who_are_you: 'Qui êtes-vous ?',
      q_contact_us: 'Nous contacter',
      r_see_products: 'Voilà notre boutique ! Tu peux utiliser la barre de recherche ou les filtres en haut pour trouver un objet précis.',
      r_how_add_cart: 'Sur chaque produit, clique sur le bouton "Ajouter". Tu peux ensuite ouvrir ton panier avec l’icône en haut à droite, et ajuster les quantités avec + et −.',
      r_create_account: 'Tu es sur la page Profil. Clique sur l’onglet "Créer un compte" et remplis le formulaire pour t’inscrire.',
      r_who_are_you: 'Decorna est un projet d’élèves du Lycée Al Fath à Khemisset : on recycle le plastique pour en faire de la déco. Tu trouveras tous les détails sur cette page.',
      r_contact_us: 'Tu peux nous écrire sur Instagram @decorna_officiel et Facebook Decorna Decornaofficiel, ou par e-mail à decornacontact@gmail.com — nos coordonnées sont aussi en bas de chaque page.',
      reply_cart: 'Pour ajouter un produit, clique sur "Ajouter" depuis une fiche produit, puis ouvre ton panier via l’icône en haut à droite pour gérer les quantités ou valider la commande.',
      reply_products: 'Je t’ai emmené vers la page Produits. Utilise la barre de recherche ou les filtres pour trouver ce que tu cherches.',
      reply_account: 'Voici la page Profil : choisis "Se connecter" si tu as déjà un compte, ou "Créer un compte" pour t’inscrire.',
      reply_contact: 'Retrouve-nous sur Instagram @decorna_officiel et Facebook Decorna Decornaofficiel, ou par e-mail à decornacontact@gmail.com.',
      reply_about: 'Decorna est un projet scolaire du Lycée Al Fath à Khemisset, qui transforme le plastique recyclé en objets déco.',
      reply_greeting: 'Salut ! Comment puis-je t’aider à naviguer sur Decorna aujourd’hui ?',
      reply_thanks: 'Avec plaisir ! 🌿',
      reply_fallback: 'Je ne suis pas sûr de comprendre, mais voici quelques idées pour naviguer :'
    },
    en: {
      page_title: 'Decorna — Recycled décor, made in Khemisset',
      loading: 'Loading…',
      nav_home: 'Home',
      nav_products: 'Products',
      nav_about: 'About',
      nav_team: 'Our Team',
      aria_logo_home: 'Decorna home',
      aria_hamburger: 'Open menu',
      aria_profile: 'My profile',
      aria_view_cart: 'View cart',
      aria_cart_drawer: 'Cart',
      aria_close_cart: 'Close cart',
      aria_search: 'Search for a product',
      aria_deco_open: 'Open the DECO assistant',
      aria_deco_panel: 'DECO assistant',
      aria_deco_close: 'Close assistant',
      aria_deco_input: 'Write to DECO',
      aria_deco_send: 'Send',
      aria_theme_toggle_dark: 'Turn on dark mode',
      aria_theme_toggle_light: 'Turn on light mode',
      eyebrow_home: 'Recycling Atelier · Al Fath High School · Khemisset',
      hero_title: 'Reclaimed cardboard and plastic, turned into collector pieces.',
      hero_lede: 'Decorna is a student-led social enterprise born at Al Fath High School in Khemisset. We collect abandoned cardboard and plastics to transform them by hand into enduring, singular home décor.',
      see_products: 'Discover the collection',
      our_story_btn: 'Our craftsmanship',
      stat_waste: 'Waste upcycled',
      stat_designs: 'Original models',
      stat_students: 'Crafted by students',
      pillar1_title: 'Local collection & sorting',
      pillar1_desc: 'Corrugated packaging boxes and clean polymers sourced from local merchants across Khemisset.',
      pillar2_title: 'Handcrafted precision',
      pillar2_desc: 'Precision cutting, structural reinforcement, and hand-finishing done entirely by high school students.',
      pillar3_title: 'Circular design',
      pillar3_desc: 'Meaningful, durable decorative pieces made to elevate interiors while reducing environmental impact.',
      bestsellers_eyebrow: 'Atelier Selection',
      bestsellers_title: 'Featured creations',
      home_quote: 'Turning discarded waste into artisanal decor means giving value back to what was once overlooked, while empowering the makers of tomorrow.',
      home_quote_author: '— The Decorna Atelier · Student entrepreneurs of Al Fath High School, Khemisset',
      video_eyebrow: 'Atelier Documentary · Khemisset',
      video_title: 'From raw waste to singular design',
      video_desc: 'In Khemisset, reclaimed cardboard and plastic find a second life in the hands of Al Fath High School students. Every piece reflects genuine craftsmanship and tangible environmental impact.',
      showcase_eyebrow: 'On video',
      showcase_title: 'All our products at a glance',
      showcase_desc: 'A quick look at the full Decorna collection — vases, lighting, frames and more, all handmade.',
      view_all: 'View all',
      eyebrow_shop: 'Shop',
      our_products_title: 'Our products',
      search_placeholder: 'Search for a décor item…',
      empty_state: 'No product matches your search. Try a different keyword.',
      eyebrow_story: 'Our story',
      about_title: 'A business born in a high school',
      about_p1: "Decorna is an entrepreneurial project led by students at Al Fath High School in Khemisset. Our starting point was simple: the cardboard and plastic thrown away every day can become beautiful pieces for the home instead of ending up in a landfill.",
      about_p2: "We collect materials from local shops and families in the neighborhood, then clean, reinforce, and transform them into vases, lamps, frames, and storage objects, all entirely handcrafted by our team.",
      step1_title: 'Collection',
      step1_desc: 'We collect cardboard and plastic from shops and residents of Khemisset.',
      step2_title: 'Sorting',
      step2_desc: 'Each material is cleaned and sorted by sturdiness and color.',
      step3_title: 'Transformation',
      step3_desc: 'Cutting, reinforcing, and assembling by hand, done by the students.',
      step4_title: 'Creation',
      step4_desc: 'Painting, finishing touches, and quality control before going on sale.',
      credit_title: 'A student project, for the planet',
      credit_desc: 'Decorna is designed and run by high school students at Al Fath High School in Khemisset, as part of a school entrepreneurship project centered on local recycling.',
      contact_eyebrow: "Contact Us",
      contact_title: "A question? A partnership?",
      contact_desc: "The Decorna team is here for any information requests, custom orders, or collaboration proposals.",
      contact_btn_email: "Email us",
      contact_btn_ig: "Instagram",
      eyebrow_team: 'The team',
      team_title: 'The Team',
      team_intro: 'We believe that bringing people together in the best possible environment, around strong shared values, gives rise to great things. Decorna is a human adventure carried by a small, close-knit team of Al Fath High School students.',
      team1_name: 'Taoufiq Essasbou',
      team1_role: 'CEO — President & CEO',
      team1_bio: 'Oversees the whole Decorna project and coordinates the teams.',
      team2_name: 'Mohamed Bout',
      team2_role: 'Production Director',
      team2_bio: 'Leads product manufacturing, from sorting materials to finishing.',
      team3_name: 'Maroua Kachouch',
      team3_role: 'Production Officer',
      team3_bio: 'Supports production: cutting, assembly, and quality control.',
      team4_name: 'Haytam Azzarwal',
      team4_role: 'Technology & Development Director',
      team4_bio: "Leads Decorna's technical development and digital tools.",
      team5_name: 'Sara Boushaba',
      team5_role: 'Technology & Development Officer',
      team5_bio: 'Contributes to website development and technical support.',
      team6_name: 'Tassnim Qada',
      team6_role: 'Marketing Director',
      team6_bio: "Defines Decorna's marketing strategy and brand image.",
      team7_name: 'Malak Benwazan',
      team7_role: 'Marketing Officer',
      team7_bio: 'Runs the social media accounts and supports marketing efforts.',
      team_note: 'Want to join the Decorna adventure or propose a partnership? Write to us — our contact details are right at the bottom of the page.',
      tab_login: 'Log in',
      tab_signup: 'Create an account',
      label_email: 'Email address',
      placeholder_email: 'you@example.com',
      label_password: 'Password',
      label_fullname: 'Full name',
      placeholder_name: 'Your name',
      btn_signup_submit: 'Create my account',
      btn_logout: 'Log out',
      order_empty_pre: "You don't have any orders yet. Go take a look at our ",
      order_empty_link: 'products',
      order_empty_post: '!',
      gallery_title: 'Decorna Gallery',
      gallery_sub: 'A few recycled décor inspirations.',
      alt_deco1: 'Recycled décor',
      alt_deco2: 'Decorative lamp',
      alt_deco3: 'Eco-friendly interior',
      footer_desc: 'Recycled décor made in Khemisset by students of Al Fath High School, Morocco.',
      footer_bottom: '© 2026 Decorna — A student project by Al Fath High School, Khemisset, Morocco',
      cart_title: 'Your cart',
      cart_total_label: 'Total',
      checkout_btn: 'Place order',
      payment_title: 'Payment method',
      payment_cod: 'Cash on delivery',
      payment_card: 'Credit card',
      card_name_placeholder: 'Name on card',
      card_number_placeholder: '1234 1234 1234 1234',
      card_demo_note: 'Demo payment — no real transaction is processed.',
      guest_email_label: 'Email for order tracking',
      card_error_number: 'Invalid card number.',
      card_error_name: 'Name on card is required.',
      card_error_expiry: 'Invalid expiry date (MM/YY).',
      card_error_cvc: 'Invalid CVC.',
      toast_order_cod: 'Order placed — payment on delivery.',
      toast_order_card: 'Payment accepted — order confirmed.',
      toast_order_error: 'Something went wrong, please try again.',
      cart_empty: 'Your cart is empty for now. Go discover our atelier creations.',
      deco_subtitle: 'Atelier Assistant',
      deco_input_placeholder: 'Ask your question…',
      add_btn: 'Add',
      read_more_btn: 'Details',
      product_page_back: 'Back to collection',
      product_page_collection: 'Collection',
      product_page_view_cart: 'View cart',
      stock_label: '{n} in stock',
      stock_low: 'Only {n} left!',
      stock_out: 'Out of stock',
      remove_btn: 'Remove',
      aria_qty_dec: 'Decrease quantity',
      aria_qty_inc: 'Increase quantity',
      toast_added_suffix: 'added to cart',
      toast_removed: 'Item removed from cart',
      toast_cart_empty: 'Your cart is empty',
      toast_order_simulated: 'Order recorded — thanks for your support.',
      toast_login_success: 'Logged in successfully',
      toast_welcome: 'Welcome to Decorna, {name}!',
      toast_logout: 'See you soon!',
      profile_greeting: 'Hello, {name}',
      deco_greeting: "Hello, I'm DECO, your atelier guide. How can I help you discover our handcrafted creations today?",
      q_see_products: 'See our products',
      q_how_add_cart: 'How do I add to cart?',
      q_create_account: 'Create an account',
      q_who_are_you: 'Who are you?',
      q_contact_us: 'Contact us',
      r_see_products: "Here's our shop! You can use the search bar or the filters at the top to find a specific item.",
      r_how_add_cart: 'On each product, click the "Add" button. You can then open your cart with the icon at the top right, and adjust quantities with + and −.',
      r_create_account: 'You\u2019re on the Profile page. Click the "Create an account" tab and fill in the form to sign up.',
      r_who_are_you: 'Decorna is a project by students at Al Fath High School in Khemisset: we recycle cardboard and plastic into décor. You\u2019ll find all the details on this page.',
      r_contact_us: 'You can reach us on Instagram @decorna_officiel and Facebook Decorna Decornaofficiel, or by email at decornacontact@gmail.com — our contact details are also at the bottom of every page.',
      reply_cart: 'To add a product, click "Add" on a product card, then open your cart via the icon at the top right to manage quantities or place your order.',
      reply_products: 'I\u2019ve taken you to the Products page. Use the search bar or the filters to find what you\u2019re looking for.',
      reply_account: 'Here\u2019s the Profile page: choose "Log in" if you already have an account, or "Create an account" to sign up.',
      reply_contact: 'Find us on Instagram @decorna_officiel and Facebook Decorna Decornaofficiel, or by email at decornacontact@gmail.com.',
      reply_about: 'Decorna is a school project from Al Fath High School in Khemisset, turning recycled cardboard and plastic into décor objects.',
      reply_greeting: 'Hi! How can I help you find your way around Decorna today?',
      reply_thanks: 'My pleasure!',
      reply_fallback: "I'm not sure I understand, but here are a few ideas to get around:"
    },
    ar: {
      page_title: 'ديكورنا — ديكور معاد تدويره، صُنع في الخميسات',
      loading: 'جارٍ التحميل…',
      nav_home: 'الرئيسية',
      nav_products: 'المنتجات',
      nav_about: 'من نحن',
      nav_team: 'فريقنا',
      aria_logo_home: 'الصفحة الرئيسية لديكورنا',
      aria_hamburger: 'فتح القائمة',
      aria_profile: 'حسابي',
      aria_view_cart: 'عرض السلة',
      aria_cart_drawer: 'السلة',
      aria_close_cart: 'إغلاق السلة',
      aria_search: 'البحث عن منتج',
      aria_deco_open: 'فتح مساعد ديكو',
      aria_deco_panel: 'مساعد ديكو',
      aria_deco_close: 'إغلاق المساعد',
      aria_deco_input: 'الكتابة إلى ديكو',
      aria_deco_send: 'إرسال',
      aria_theme_toggle_dark: 'تفعيل الوضع الداكن',
      aria_theme_toggle_light: 'تفعيل الوضع الفاتح',
      eyebrow_home: 'ورشة إعادة التدوير · ثانوية الفتح · الخميسات',
      hero_title: 'من كرتون وبلاستيك مسترجع، إلى تحف ديكور راقية.',
      hero_lede: 'ديكورنا مقاولة مدرسية وتضامنية تأسست بثانوية الفتح بالخميسات. نجمع مخلفات الكرتون والبلاستيك لنعيد تشكيلها يدويًا إلى قطع ديكور فريدة ومستدامة.',
      see_products: 'اكتشف المجموعة',
      our_story_btn: 'نهجنا الحرفي',
      stat_waste: 'نفايات مسترجعة',
      stat_designs: 'نماذج الورشة',
      stat_students: 'صُنع بأيدي التلاميذ',
      pillar1_title: 'جمع محلي وفرز دقيق',
      pillar1_desc: 'كرتون التغليف وبلاستيك نظيف يُجمع أسبوعيًا من تجار وأسر مدينة الخميسات.',
      pillar2_title: 'صناعة يدوية متقنة',
      pillar2_desc: 'قص دقيق وتقوية هيكلية وتشطيبات متقنة من إنجاز تلاميذ ثانوية الفتح.',
      pillar3_title: 'تصميم دائري مستدام',
      pillar3_desc: 'إحياء جديد للمواد على هيئة مزهريات وإضاءات تدوم طويلاً وتضفي لمسة جمالية مسؤولة.',
      bestsellers_eyebrow: 'مختارات الورشة',
      bestsellers_title: 'أبرز ابتكاراتنا',
      home_quote: 'تحويل مادة مهملة إلى قطعة حرفية هو إعادة القيمة لما لم نعد نلتفت إليه، مع بناء جيل واعد من صُنّاع الغد.',
      home_quote_author: '— ورشة ديكورنا · تلاميذ مقاولون بثانوية الفتح، الخميسات',
      video_eyebrow: 'وثائقي الورشة · الخميسات',
      video_title: 'من المادة المسترجعة إلى قطعة ديكور فريدة',
      video_desc: 'في الخميسات، يجد الكرتون والبلاستيك المجموعان حياة ثانية بين أيدي تلاميذ ثانوية الفتح. كل ابتكار يجسد مهارة يدوية حقيقية والتزامًا بيئيًا ملموسًا.',
      showcase_eyebrow: 'بالفيديو',
      showcase_title: 'كل منتجاتنا في لمحة واحدة',
      showcase_desc: 'نظرة سريعة على مجموعة ديكورنا كاملة — مزهريات وإضاءة وإطارات وأكثر، كلها مصنوعة يدويًا.',
      view_all: 'عرض الكل',
      eyebrow_shop: 'المتجر',
      our_products_title: 'منتجاتنا',
      search_placeholder: 'ابحث عن قطعة ديكور…',
      empty_state: 'لا يوجد منتج يطابق بحثك. جرّب كلمة بحث أخرى.',
      eyebrow_story: 'قصتنا',
      about_title: 'مقاولة وُلدت داخل ثانوية',
      about_p1: 'ديكورنا هو مشروع مقاولاتي يقوده تلاميذ ثانوية الفتح بالخميسات. فكرتنا بسيطة: الكرتون والبلاستيك اللذان يُرميان يوميًا يمكن أن يتحوّلا إلى قطع جميلة للمنزل بدل أن ينتهيا في المطرح.',
      about_p2: 'نجمع المواد من المحلات والعائلات بالحي، ثم ننظفها ونقويها ونحوّلها إلى مزهريات ومصابيح وإطارات وأدوات تخزين، وكلها مصنوعة يدويًا بالكامل من طرف فريقنا.',
      step1_title: 'الجمع',
      step1_desc: 'نجمع الكرتون والبلاستيك من المحلات وسكان الخميسات.',
      step2_title: 'الفرز',
      step2_desc: 'يتم تنظيف كل مادة وفرزها حسب متانتها ولونها.',
      step3_title: 'التحويل',
      step3_desc: 'القص والتقوية والتجميع يدويًا من طرف التلاميذ.',
      step4_title: 'الإبداع',
      step4_desc: 'الطلاء واللمسات الأخيرة ومراقبة الجودة قبل البيع.',
      credit_title: 'مشروع تلاميذ، من أجل الكوكب',
      credit_desc: 'ديكورنا مشروع يديره تلاميذ ثانوية الفتح بالخميسات، في إطار مشروع مقاولاتي مدرسي يركز على إعادة التدوير المحلي.',
      contact_eyebrow: "تواصل معنا",
      contact_title: "سؤال؟ أو شراكة؟",
      contact_desc: "فريق ديكورنا تحت تصرفك لأي طلب معلومات، طلبات مخصصة أو اقتراح تعاون.",
      contact_btn_email: "راسلنا عبر البريد",
      contact_btn_ig: "إنستغرام",
      eyebrow_team: 'الفريق',
      team_title: 'الفريق',
      team_intro: 'نؤمن بأن جمع الأشخاص في أفضل إطار ممكن، حول قيم مشتركة قوية، يولّد أشياء عظيمة. ديكورنا مغامرة إنسانية يحملها فريق صغير ومتماسك من تلاميذ ثانوية الفتح.',
      team1_name: 'Taoufiq Essasbou',
      team1_role: 'PDG — الرئيس المدير العام',
      team1_bio: 'يشرف على مشروع ديكورنا بأكمله وينسق بين الفرق.',
      team2_name: 'Mohamed Bout',
      team2_role: 'DP — مدير الإنتاج',
      team2_bio: 'يقود تصنيع المنتجات، من فرز المواد إلى التشطيب.',
      team3_name: 'Maroua Kachouch',
      team3_role: 'RP — مسؤولة الإنتاج',
      team3_bio: 'تساعد في الإنتاج: القص والتجميع ومراقبة الجودة.',
      team4_name: 'Haytam Azzarwal',
      team4_role: 'DTV — مدير التكنولوجيا والتطوير',
      team4_bio: 'يقود التطوير التقني والأدوات الرقمية لديكورنا.',
      team5_name: 'Sara Boushaba',
      team5_role: 'RTV — مسؤولة التكنولوجيا والتطوير',
      team5_bio: 'تساهم في تطوير الموقع والدعم التقني.',
      team6_name: 'Tassnim Qada',
      team6_role: 'DM — مديرة التسويق',
      team6_bio: 'تحدد استراتيجية التسويق وصورة العلامة لديكورنا.',
      team7_name: 'Malak Benwazan',
      team7_role: 'RM — مسؤولة التسويق',
      team7_bio: 'تدير حسابات التواصل الاجتماعي وتدعم الأنشطة التسويقية.',
      team_note: 'تريد الانضمام لمغامرة ديكورنا أو اقتراح شراكة؟ راسلنا — معلومات التواصل أسفل الصفحة مباشرة.',
      tab_login: 'تسجيل الدخول',
      tab_signup: 'إنشاء حساب',
      label_email: 'البريد الإلكتروني',
      placeholder_email: 'anta@example.com',
      label_password: 'كلمة المرور',
      label_fullname: 'الاسم الكامل',
      placeholder_name: 'اسمك',
      btn_signup_submit: 'إنشاء حسابي',
      btn_logout: 'تسجيل الخروج',
      order_empty_pre: 'ليس لديك أي طلب بعد. تفضل بزيارة ',
      order_empty_link: 'منتجاتنا',
      order_empty_post: ' !',
      gallery_title: 'معرض ديكورنا',
      gallery_sub: 'بعض الأفكار للديكور المُعاد تدويره.',
      alt_deco1: 'ديكور معاد تدويره',
      alt_deco2: 'مصباح للديكور',
      alt_deco3: 'ديكور داخلي صديق للبيئة',
      footer_desc: 'ديكور معاد تدويره، صُنع بالخميسات من طرف تلاميذ ثانوية الفتح، المغرب.',
      footer_bottom: '© 2026 ديكورنا — مشروع تلاميذ ثانوية الفتح، الخميسات، المغرب',
      cart_title: 'سلتك',
      cart_total_label: 'المجموع',
      checkout_btn: 'تأكيد الطلب',
      payment_title: 'طريقة الدفع',
      payment_cod: 'الدفع عند الاستلام',
      payment_card: 'بطاقة بنكية',
      card_name_placeholder: 'الاسم على البطاقة',
      card_number_placeholder: '1234 1234 1234 1234',
      card_demo_note: 'دفع تجريبي — لا تتم أي معاملة حقيقية.',
      guest_email_label: 'البريد الإلكتروني لتتبع الطلب',
      card_error_number: 'رقم البطاقة غير صالح.',
      card_error_name: 'الاسم على البطاقة مطلوب.',
      card_error_expiry: 'تاريخ انتهاء غير صالح (شهر/سنة).',
      card_error_cvc: 'رمز التحقق CVC غير صالح.',
      toast_order_cod: 'تم تسجيل الطلب — الدفع عند الاستلام.',
      toast_order_card: 'تم قبول الدفع — تم تأكيد الطلب بنجاح.',
      toast_order_error: 'حدث خطأ ما، يرجى المحاولة مرة أخرى.',
      cart_empty: 'سلتك فارغة حاليًا. تفضل باكتشاف إبداعات الورشة.',
      deco_subtitle: 'مرشد الورشة',
      deco_input_placeholder: 'اطرح سؤالك…',
      add_btn: 'أضف',
      read_more_btn: 'تفاصيل',
      product_page_back: 'العودة إلى المجموعة',
      product_page_collection: 'المجموعة',
      product_page_view_cart: 'عرض السلة',
      stock_label: 'متوفر: {n}',
      stock_low: 'بقي فقط {n}!',
      stock_out: 'نفدت الكمية',
      remove_btn: 'إزالة',
      aria_qty_dec: 'تقليل الكمية',
      aria_qty_inc: 'زيادة الكمية',
      toast_added_suffix: 'أُضيف إلى السلة',
      toast_removed: 'تمت إزالة المنتج من السلة',
      toast_cart_empty: 'سلتك فارغة',
      toast_order_simulated: 'تم تسجيل الطلب — شكرًا لدعمكم.',
      toast_login_success: 'تم تسجيل الدخول بنجاح',
      toast_welcome: 'مرحبًا بك في ديكورنا، {name}!',
      toast_logout: 'إلى اللقاء قريبًا!',
      profile_greeting: 'مرحبًا، {name}',
      deco_greeting: 'مرحبًا، أنا ديكو مرشدك في ورشة ديكورنا. كيف يمكنني مساعدتك في استكشاف إبداعاتنا الحرفية اليوم؟',
      q_see_products: 'شاهد المنتجات',
      q_how_add_cart: 'كيف أضيف إلى السلة؟',
      q_create_account: 'إنشاء حساب',
      q_who_are_you: 'من أنتم؟',
      q_contact_us: 'اتصل بنا',
      r_see_products: 'ها هو متجرنا! يمكنك استخدام شريط البحث أو الفلاتر أعلاه للعثور على منتج معين.',
      r_how_add_cart: 'اضغط على زر "أضف" في كل منتج. يمكنك بعدها فتح سلتك من الأيقونة أعلى اليمين وضبط الكميات بـ + و −.',
      r_create_account: 'أنت في صفحة الحساب. اضغط على تبويب "إنشاء حساب" واملأ الاستمارة للتسجيل.',
      r_who_are_you: 'ديكورنا مشروع تلاميذ ثانوية الفتح بالخميسات: نعيد تدوير الكرتون والبلاستيك لصنع الديكور. ستجد كل التفاصيل في هذه الصفحة.',
      r_contact_us: 'يمكنك مراسلتنا على إنستغرام @decorna_officiel وفيسبوك Decorna Decornaofficiel، أو عبر البريد الإلكتروني decornacontact@gmail.com — تجد معلومات الاتصال أيضًا أسفل كل صفحة.',
      reply_cart: 'لإضافة منتج، اضغط على "أضف" من بطاقة المنتج، ثم افتح سلتك من الأيقونة أعلى اليمين لضبط الكميات أو تأكيد الطلب.',
      reply_products: 'أخذتك إلى صفحة المنتجات. استخدم شريط البحث أو الفلاتر لإيجاد ما تبحث عنه.',
      reply_account: 'هذه صفحة الحساب: اختر "تسجيل الدخول" إذا كان لديك حساب، أو "إنشاء حساب" للتسجيل.',
      reply_contact: 'تجدنا على إنستغرام @decorna_officiel وفيسبوك Decorna Decornaofficiel، أو عبر البريد الإلكتروني decornacontact@gmail.com.',
      reply_about: 'ديكورنا مشروع مدرسي من ثانوية الفتح بالخميسات، يحوّل الكرتون والبلاستيك المعاد تدويرهما إلى قطع ديكور.',
      reply_greeting: 'مرحبًا! كيف يمكنني مساعدتك في التنقل داخل ديكورنا اليوم؟',
      reply_thanks: 'بكل سرور!',
      reply_fallback: 'لست متأكدًا من فهم سؤالك، لكن إليك بعض الأفكار للتنقل:'
    }
  };

  function t(key){
    return (i18n[lang] && i18n[lang][key] !== undefined) ? i18n[lang][key] : (i18n.fr[key] !== undefined ? i18n.fr[key] : key);
  }
  function tf(key, vars){
    var s = t(key);
    Object.keys(vars || {}).forEach(function(k){ s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }
  function pl(obj){
    if(!obj) return '';
    if(typeof obj === 'string') return obj;
    return obj[lang] || obj.fr || obj.en || '';
  }

  /* ---------------- DATA ---------------- */
  var catLabels = {
    all:      { fr:'Tous',               en:'All' },
    vases:    { fr:'Vases & Pots',       en:'Vases & Pots' },
    lighting: { fr:'Éclairage',          en:'Lighting' },
    frames:   { fr:'Cadres & Miroirs',   en:'Frames & Mirrors' },
    storage:  { fr:'Rangement',          en:'Storage' },
    clocks:   { fr:'Horloges',           en:'Clocks' },
    walldeco: { fr:'Déco murale',        en:'Wall Décor' },
    keychains:{ fr:'Porte-clés',         en:'Keychains' }
  };

  var API = (function(){
    var p = window.location.pathname;
    var m = p.match(/^(.*\/decorna)/i);
    return (m ? m[1] : '') + '/api';
  })();

  var products = [];
  var categoryKeys = ['all', 'vases', 'lighting', 'frames', 'storage', 'clocks', 'walldeco', 'keychains'];

  function updateCategories(){
    var set = {};
    products.forEach(function(p){ if(p.catKey) set[p.catKey] = true; });
    var dynamicKeys = Object.keys(set);
    if(dynamicKeys.length){
      categoryKeys = ['all'].concat(dynamicKeys);
    } else {
      categoryKeys = ['all', 'vases', 'lighting', 'frames', 'storage', 'clocks', 'walldeco', 'keychains'];
    }
  }

  function loadProducts(){
    return fetch(API + '/products', { credentials: 'include' })
      .then(function(res){
        if(!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then(function(data){
        products = data || [];
        updateCategories();
        renderChips();
        renderProducts();
        renderFeatured();
      })
      .catch(function(err){
        console.warn('API /products unavailable:', err);
        products = [];
        renderChips();
        renderProducts();
        renderFeatured();
      });
  }

  /* ---------------- STATE ---------------- */
  var state = {
    cart: {},          // id -> qty
    user: null,        // {name, email}
    search: '',
    cat: 'all'
  };

  /* ---------------- HELPERS ---------------- */
  function $(sel){ return document.querySelector(sel); }
  function $all(sel){ return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function fmt(n){ return n + ' DH'; }

  function toast(msg){
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._tm);
    toast._tm = setTimeout(function(){ el.classList.remove('show'); }, 2400);
  }

  function productById(id){
    return products.filter(function(p){ return Number(p.id) === Number(id); })[0];
  }

  /* ---------------- LANGUAGE ---------------- */
  function applyStaticTranslations(){
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS[lang] ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', !!RTL_LANGS[lang]);
    $all('[data-i18n]').forEach(function(el){
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    $all('[data-i18n-placeholder]').forEach(function(el){
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    $all('[data-i18n-aria]').forEach(function(el){
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    $all('[data-i18n-alt]').forEach(function(el){
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });
    $('#langFr').classList.toggle('active', lang === 'fr');
    $('#langEn').classList.toggle('active', lang === 'en');
    var langAr = document.getElementById('langAr');
    if(langAr) langAr.classList.toggle('active', lang === 'ar');
    staggerHeroTitle();
    applyThemeAria();
  }

  /* ---------------- HERO TITLE: word-by-word entrance ---------------- */
  function staggerHeroTitle(){
    var h1 = document.querySelector('.hero h1[data-i18n="hero_title"]');
    if(!h1) return;
    var words = h1.textContent.trim().split(/\s+/);
    h1.innerHTML = words.map(function(w, i){
      return '<span class="inline-block animate-word-in" style="animation-delay:' + (i * 0.07).toFixed(2) + 's">' + w + '&nbsp;</span>';
    }).join('');
  }

  function setLang(newLang){
    if(newLang !== 'fr' && newLang !== 'en' && newLang !== 'ar') return;
    lang = newLang;
    localStorage.setItem(LANG_KEY, lang);
    applyStaticTranslations();
    renderChips();
    renderProducts();
    renderFeatured();
    renderCart();
    renderProfile();
    if(decoOpened) renderQuick();
  }

  var langAr = document.getElementById('langAr');
  if(langAr) langAr.addEventListener('click', function(){ setLang('ar'); });

  $('#langFr').addEventListener('click', function(){ setLang('fr'); });
  $('#langEn').addEventListener('click', function(){ setLang('en'); });

  /* ---------------- NAVIGATION ---------------- */
  function goTo(view){
    var apply = function(){
      $all('.view').forEach(function(v){ v.classList.remove('active'); });
      $('#view-' + view).classList.add('active');
      $all('.main-nav button').forEach(function(b){
        var active = b.dataset.nav === view || (view === 'product' && b.dataset.nav === 'products');
        b.classList.toggle('active', active);
      });
      $('#profileBtn').classList.toggle('active', view === 'profile');
      closeMobileNav();
      window.scrollTo({top:0, behavior:'smooth'});
      if(view === 'profile') renderProfile();
    };
    if(document.startViewTransition){
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  $all('[data-nav]').forEach(function(el){
    el.addEventListener('click', function(){ goTo(el.dataset.nav); });
  });

  function closeMobileNav(){
    $('#mainNav').classList.remove('open');
    $('#hamburger').setAttribute('aria-expanded','false');
  }
  $('#hamburger').addEventListener('click', function(){
    var open = $('#mainNav').classList.toggle('open');
    this.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ---------------- PRODUCTS RENDER ---------------- */
  function stockHTML(p){
    if(!p || p.stock <= 0){
      return '<span class="stock-badge stock-out">' + t('stock_out') + '</span>';
    }
    if(p.stock <= 5){
      return '<span class="stock-badge stock-low">' + tf('stock_low', {n: p.stock}) + '</span>';
    }
    return '<span class="stock-badge stock-ok">' + tf('stock_label', {n: p.stock}) + '</span>';
  }

  function cardHTML(p, i){
    if(!p) return '';
    var delay = Math.min((i || 0) * 0.05, 0.3).toFixed(2) + 's';
    var outOfStock = p.stock <= 0;
    var catName = catLabels[p.catKey] ? pl(catLabels[p.catKey]) : (p.catKey || '');
    return '' +
      '<div class="product-card" data-id="' + p.id + '">' +
        '<div class="product-thumb" data-details="' + p.id + '">' +
          thumbHTML(p) +
          '<span class="product-origin-tag">' + pl(p.material) + '</span>' +
        '</div>' +
        '<h3 data-details="' + p.id + '">' + pl(p.name) + '</h3>' +
        '<p class="product-desc">' + pl(p.desc) + '</p>' +
        stockHTML(p) +
        '<button class="read-more-btn" data-details="' + p.id + '">' + t('read_more_btn') +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none"/></svg>' +
        '</button>' +
        '<div class="product-foot">' +
          '<span class="price mono">' + fmt(p.price) + '</span>' +
          '<button class="add-btn' + (outOfStock ? ' add-btn-disabled' : '') + '" data-add="' + p.id + '"' + (outOfStock ? ' disabled' : '') + '>' + (outOfStock ? t('stock_out') : t('add_btn')) +
            (outOfStock ? '' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>') +
          '</button>' +
        '</div>' +
      '</div>';
  }

  function renderChips(){
    var row = $('#chipRow');
    if(!row) return;
    row.innerHTML = categoryKeys.map(function(k){
      var label = catLabels[k] ? pl(catLabels[k]) : k;
      return '<button class="chip' + (k === state.cat ? ' active' : '') + '" data-cat="' + k + '">' + label + '</button>';
    }).join('');
    $all('[data-cat]').forEach(function(b){
      b.addEventListener('click', function(){ state.cat = b.dataset.cat; renderProducts(); renderChips(); });
    });
  }

  function renderProducts(){
    var term = state.search.trim().toLowerCase();
    var list = products.filter(function(p){
      var matchCat = state.cat === 'all' || p.catKey === state.cat;
      var catName = catLabels[p.catKey] ? pl(catLabels[p.catKey]) : (p.catKey || '');
      var haystack = (pl(p.name) + ' ' + catName + ' ' + pl(p.material)).toLowerCase();
      var matchSearch = !term || haystack.indexOf(term) !== -1;
      return matchCat && matchSearch;
    });
    var apply = function(){
      var grid = $('#productGrid');
      if(grid) grid.innerHTML = list.map(cardHTML).join('');
      var empty = $('#emptyState');
      if(empty){
        if(!products.length){
          empty.textContent = (lang === 'ar')
            ? 'المتجر فارغ حاليًا. يرجى تسجيل الدخول إلى لوحة التحكم لإضافة المنتجات.'
            : ((lang === 'en') ? 'The catalog is currently empty. Log in to the admin panel to add products.' : 'Le catalogue est actuellement vide. Connectez-vous à l\'espace Admin pour ajouter vos premiers produits.');
          empty.style.display = 'block';
        } else {
          empty.textContent = t('empty_state');
          empty.style.display = list.length ? 'none' : 'block';
        }
      }
    };
    if(document.startViewTransition){
      document.startViewTransition(apply);
    } else {
      apply();
    }
  }

  function renderFeatured(){
    var picks = products.slice(0, 3);
    var el = $('#homeFeatured');
    if(!el) return;
    if(!picks.length){
      el.innerHTML = '<div class="empty-state" style="grid-column:1/-1;text-align:center;padding:34px;color:var(--canopy-dark);">' +
        (lang === 'ar' ? 'لا توجد منتجات حاليًا في هذا القسم.' : (lang === 'en' ? 'Our atelier catalog is currently being prepared.' : 'Les créations de l\'atelier sont actuellement en cours de préparation.')) +
        '</div>';
      return;
    }
    el.innerHTML = picks.map(cardHTML).join('');
  }

  // Single delegated listener handles every "Add" button, present or future —
  // avoids re-binding duplicate listeners every time a grid re-renders.
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-add]');
    if(btn) addToCart(parseInt(btn.dataset.add, 10), btn);
    var detailsBtn = e.target.closest('[data-details]');
    if(detailsBtn) openProductPage(parseInt(detailsBtn.dataset.details, 10));
  });

  /* ---------------- PRODUCT DETAILS PAGE ---------------- */
  function openProductPage(id){
    var p = productById(id);
    if(!p) return;
    $('#productPageMedia').innerHTML = thumbHTML(p);
    $('#productPageTitle').textContent = pl(p.name);
    $('#productPageMaterial').textContent = pl(p.material);
    var shortDesc = pl(p.desc);
    var longDesc = pl(p.long);
    var fullDesc = (shortDesc && longDesc && shortDesc !== longDesc)
      ? (shortDesc + '\n\n' + longDesc)
      : (longDesc || shortDesc);
    var descEl = $('#productPageDesc');
    descEl.textContent = fullDesc;
    descEl.style.whiteSpace = 'pre-line';
    $('#productPageStock').innerHTML = stockHTML(p);
    $('#productPagePrice').textContent = fmt(p.price);
    var addBtn = $('#productPageAdd');
    addBtn.setAttribute('data-add', p.id);
    addBtn.disabled = p.stock <= 0;
    addBtn.classList.toggle('add-btn-disabled', p.stock <= 0);
    addBtn.querySelector('span').textContent = p.stock <= 0 ? t('stock_out') : t('add_btn');
    goTo('product');
  }
  $('#productPageViewCart').addEventListener('click', openCart);

  $('#searchInput').addEventListener('input', function(e){
    state.search = e.target.value;
    renderProducts();
  });

  /* ---------------- CART ---------------- */
  function addToCart(id, sourceEl){
    var p = productById(id);
    if(!p || p.stock <= 0) return;
    var currentQty = state.cart[id] || 0;
    if(currentQty >= p.stock){
      toast(tf('stock_low', {n: p.stock}));
      return;
    }
    state.cart[id] = currentQty + 1;
    renderCart();
    toast(pl(p.name) + ' ' + t('toast_added_suffix'));
    animateAddToCart(sourceEl);
  }

  function animateAddToCart(sourceEl){
    var cartBtn = $('#cartBtn');
    if(!cartBtn) return;
    // Pulse the card itself
    var card = sourceEl && sourceEl.closest ? sourceEl.closest('.product-card') : null;
    if(card){
      card.classList.remove('added-pulse');
      void card.offsetWidth;
      card.classList.add('added-pulse');
    }
    // Bump the cart icon
    cartBtn.classList.remove('bump');
    void cartBtn.offsetWidth;
    cartBtn.classList.add('bump');
    // Fly a little dot from the button toward the cart icon
    if(!sourceEl || !sourceEl.getBoundingClientRect) return;
    var startRect = sourceEl.getBoundingClientRect();
    var endRect = cartBtn.getBoundingClientRect();
    var dot = document.createElement('span');
    dot.className = 'fly-dot';
    var size = 14;
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.left = (startRect.left + startRect.width / 2 - size / 2) + 'px';
    dot.style.top = (startRect.top + startRect.height / 2 - size / 2) + 'px';
    document.body.appendChild(dot);
    var dx = (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2);
    var dy = (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2);
    var anim = dot.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(' + (dx * 0.5) + 'px,' + (dy * 0.5 - 60) + 'px) scale(1.1)', opacity: 1, offset: 0.6 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.3)', opacity: 0 }
    ], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
    anim.onfinish = function(){ dot.remove(); };
  }
  function changeQty(id, delta){
    if(!state.cart[id]) return;
    if(delta > 0){
      var p = productById(id);
      if(p && state.cart[id] >= p.stock){
        toast(tf('stock_low', {n: p.stock}));
        return;
      }
    }
    state.cart[id] += delta;
    if(state.cart[id] <= 0) delete state.cart[id];
    renderCart();
  }
  function removeFromCart(id){
    delete state.cart[id];
    renderCart();
    toast(t('toast_removed'));
  }

  function cartRowHTML(id, qty, index){
    var p = productById(id);
    var delay = Math.min((index || 0) * 0.06, 0.3).toFixed(2) + 's';
    return '' +
      '<div class="cart-row cart-row-in" style="animation-delay:' + delay + '">' +
        '<div class="cart-thumb">' + thumbHTML(p) + '</div>' +
        '<div class="cart-info">' +
          '<h4>' + pl(p.name) + '</h4>' +
          '<span class="price mono">' + fmt(p.price) + '</span>' +
          '<div class="qty-control">' +
            '<button data-dec="' + id + '" aria-label="' + t('aria_qty_dec') + '">−</button>' +
            '<span>' + qty + '</span>' +
            '<button data-inc="' + id + '" aria-label="' + t('aria_qty_inc') + '">+</button>' +
          '</div>' +
          '<button class="remove-btn" data-rm="' + id + '">' + t('remove_btn') + '</button>' +
        '</div>' +
      '</div>';
  }

  function renderCart(){
    var ids = Object.keys(state.cart);
    var count = 0, total = 0;
    ids.forEach(function(id){
      var p = productById(parseInt(id, 10));
      if(p){
        count += state.cart[id];
        total += state.cart[id] * p.price;
      } else {
        delete state.cart[id];
      }
    });
    var badge = $('#cartCount');
    if(badge.textContent !== String(count)){
      badge.textContent = count;
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }

    if(!ids.length){
      $('#cartBody').innerHTML = '<div class="empty-state">' + t('cart_empty') + '</div>';
    } else {
      $('#cartBody').innerHTML = ids.map(function(id, i){ return cartRowHTML(parseInt(id,10), state.cart[id], i); }).join('');
    }
    var totalEl = $('#cartTotal');
    totalEl.textContent = fmt(total);
    totalEl.classList.remove('flash');
    void totalEl.offsetWidth;
    totalEl.classList.add('flash');

    $all('[data-inc]').forEach(function(b){ b.addEventListener('click', function(){ changeQty(parseInt(b.dataset.inc,10), 1); }); });
    $all('[data-dec]').forEach(function(b){ b.addEventListener('click', function(){ changeQty(parseInt(b.dataset.dec,10), -1); }); });
    $all('[data-rm]').forEach(function(b){ b.addEventListener('click', function(){ removeFromCart(parseInt(b.dataset.rm,10)); }); });
  }

  function openCart(){
    $('#cartDrawer').classList.add('open'); $('#cartOverlay').classList.add('show');
    $('#guestEmailField').hidden = !!state.user;
  }
  function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#cartOverlay').classList.remove('show'); }
  $('#cartBtn').addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  $('#cartOverlay').addEventListener('click', closeCart);

  /* ---------------- PAYMENT METHOD TOGGLE ---------------- */
  var cardFieldsEl = $('#cardFields');
  $all('input[name="paymentMethod"]').forEach(function(radio){
    radio.addEventListener('change', function(){
      cardFieldsEl.hidden = ($('input[name="paymentMethod"]:checked').value !== 'card');
    });
  });

  // Format card number as "1234 1234 1234 1234" while typing
  $('#cardNumber').addEventListener('input', function(){
    var digits = this.value.replace(/\D/g, '').slice(0, 19);
    this.value = digits.replace(/(.{4})/g, '$1 ').trim();
  });
  // Format expiry as MM/YY while typing
  $('#cardExpiry').addEventListener('input', function(){
    var digits = this.value.replace(/\D/g, '').slice(0, 4);
    this.value = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  });
  $('#cardCvc').addEventListener('input', function(){
    this.value = this.value.replace(/\D/g, '').slice(0, 4);
  });

  function clearFieldErrors(){
    $all('.field-input.field-error').forEach(function(el){ el.classList.remove('field-error'); });
  }

  function validateCardFields(){
    clearFieldErrors();
    var name = $('#cardName').value.trim();
    var number = $('#cardNumber').value.replace(/\D/g, '');
    var expiry = $('#cardExpiry').value.trim();
    var cvc = $('#cardCvc').value.trim();

    if(!name){ $('#cardName').classList.add('field-error'); return { valid:false, message: t('card_error_name') }; }
    if(number.length < 13 || number.length > 19){ $('#cardNumber').classList.add('field-error'); return { valid:false, message: t('card_error_number') }; }
    if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)){ $('#cardExpiry').classList.add('field-error'); return { valid:false, message: t('card_error_expiry') }; }
    if(cvc.length < 3 || cvc.length > 4){ $('#cardCvc').classList.add('field-error'); return { valid:false, message: t('card_error_cvc') }; }

    return { valid:true, card: { name: name, number: number, expiry: expiry, cvc: cvc } };
  }

  function buildOrderPayload(paymentMethod, cardPayload){
    var items = Object.keys(state.cart).map(function(id){
      return { productId: parseInt(id, 10), qty: state.cart[id] };
    });
    var payload = { items: items, paymentMethod: paymentMethod };
    if(paymentMethod === 'card') payload.card = cardPayload;
    if(state.user){
      payload.guestName = state.user.name;
      payload.guestEmail = state.user.email;
    } else {
      payload.guestEmail = $('#guestEmail').value.trim();
    }
    return payload;
  }

  function launchConfetti(){
    var colors = ['#2E7873', '#09BC61', '#E1CFA8', '#86CAC9', '#078C49'];
    var count = 26;
    for(var i = 0; i < count; i++){
      var el = document.createElement('span');
      el.className = 'confetti-piece';
      var startX = window.innerWidth / 2 + (Math.random() - 0.5) * 60;
      var dx = (Math.random() - 0.5) * 320;
      var dy = -(120 + Math.random() * 180);
      var rot = (Math.random() - 0.5) * 540;
      el.style.left = startX + 'px';
      el.style.top = (window.innerHeight - 90) + 'px';
      el.style.background = colors[i % colors.length];
      el.style.setProperty('--dx', dx + 'px');
      el.style.setProperty('--dy', dy + 'px');
      el.style.setProperty('--rot', rot + 'deg');
      el.style.animationDelay = (Math.random() * 0.15) + 's';
      document.body.appendChild(el);
      el.addEventListener('animationend', function(){ this.remove(); });
    }
  }

  function finishCheckout(paymentMethod){
    var toastKey = paymentMethod === 'card' ? 'toast_order_card' : 'toast_order_cod';
    toast(t(toastKey));
    launchConfetti();
    state.cart = {};
    renderCart();
    closeCart();
    $('#cardName').value = ''; $('#cardNumber').value = ''; $('#cardExpiry').value = ''; $('#cardCvc').value = '';
    clearFieldErrors();
  }

  $('#checkoutBtn').addEventListener('click', function(){
    if(!Object.keys(state.cart).length){ toast(t('toast_cart_empty')); return; }

    var paymentMethod = $('input[name="paymentMethod"]:checked').value;
    var cardPayload = null;

    if(paymentMethod === 'card'){
      var check = validateCardFields();
      if(!check.valid){ toast(check.message); return; }
      cardPayload = check.card;
    }

    if(!state.user){
      var guestEmail = $('#guestEmail').value.trim();
      if(!guestEmail || guestEmail.indexOf('@') === -1){
        $('#guestEmail').classList.add('field-error');
        toast(t('toast_order_error'));
        return;
      }
    }

    var payload = buildOrderPayload(paymentMethod, cardPayload);
    var btn = $('#checkoutBtn');
    btn.disabled = true;

    fetch(API + '/orders', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function(res){
      if(!res.ok) return res.json().then(function(data){ throw new Error(data.error || 'Order failed'); });
      return res.json();
    }).then(function(){
      btn.disabled = false;
      finishCheckout(paymentMethod);
    }).catch(function(err){
      btn.disabled = false;
      toast(err.message || 'Erreur lors de la commande');
    });
  });

  /* ---------------- PROFILE / AUTH ---------------- */
  $('#tabLogin').addEventListener('click', function(){ switchTab('login'); });
  $('#tabSignup').addEventListener('click', function(){ switchTab('signup'); });
  function switchTab(which){
    $('#tabLogin').classList.toggle('active', which === 'login');
    $('#tabSignup').classList.toggle('active', which === 'signup');
    $('#loginForm').classList.toggle('active', which === 'login');
    $('#signupForm').classList.toggle('active', which === 'signup');
  }

  $('#loginForm').addEventListener('submit', function(e){
    e.preventDefault();
    var email = $('#loginEmail').value.trim();
    var password = $('#loginPass').value;
    if(!email || !password) return;

    var submitBtn = $('#loginForm button[type="submit"]');
    submitBtn.disabled = true;

    fetch(API + '/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    }).then(function(res){
      return res.json().then(function(data){
        if(!res.ok) throw new Error(data.error || 'Identifiants invalides');
        return data;
      });
    }).then(function(user){
      submitBtn.disabled = false;
      state.user = {
        id: user.id,
        name: user.fullName || user.email.split('@')[0],
        email: user.email,
        isAdmin: !!user.isAdmin
      };
      renderProfile();
      toast(t('toast_login_success'));
      $('#loginPass').value = '';
    }).catch(function(err){
      submitBtn.disabled = false;
      toast(err.message || 'Identifiants invalides');
    });
  });

  $('#signupForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = $('#suName').value.trim();
    var email = $('#suEmail').value.trim();
    var password = $('#suPass').value;
    if(!name || !email || !password){
      toast('Veuillez remplir tous les champs');
      return;
    }
    if(password.length < 6){
      toast('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    var submitBtn = $('#signupForm button[type="submit"]');
    submitBtn.disabled = true;

    fetch(API + '/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: name, email: email, password: password })
    }).then(function(res){
      return res.json().then(function(data){
        if(!res.ok) throw new Error(data.error || "Erreur lors de l'inscription");
        return data;
      });
    }).then(function(user){
      submitBtn.disabled = false;
      state.user = {
        id: user.id,
        name: user.fullName || name,
        email: user.email,
        isAdmin: !!user.isAdmin
      };
      renderProfile();
      toast(tf('toast_welcome', {name: state.user.name}));
      $('#suPass').value = '';
    }).catch(function(err){
      submitBtn.disabled = false;
      toast(err.message || "Erreur lors de la création du compte");
    });
  });

  $('#logoutBtn').addEventListener('click', function(){
    fetch(API + '/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).finally(function(){
      state.user = null;
      renderProfile();
      toast(t('toast_logout'));
    });
  });

  function checkAuth(){
    return fetch(API + '/auth/me', { credentials: 'include' })
      .then(function(res){ return res.ok ? res.json() : null; })
      .then(function(data){
        if(data && data.user){
          state.user = {
            id: data.user.id,
            name: data.user.fullName || data.user.email.split('@')[0],
            email: data.user.email,
            isAdmin: !!data.user.isAdmin
          };
        } else {
          state.user = null;
        }
        renderProfile();
      })
      .catch(function(){
        state.user = null;
        renderProfile();
      });
  }

  function renderProfile(){
    if(state.user){
      $('#authBlock').style.display = 'none';
      $('#accountBlock').style.display = 'block';
      $('#avatarInitial').textContent = state.user.name.charAt(0).toUpperCase();
      $('#accountGreeting').textContent = tf('profile_greeting', {name: state.user.name});
      $('#accountEmail').textContent = state.user.email;

      var adminLink = $('#profileAdminLink');
      if(state.user.isAdmin){
        if(!adminLink){
          adminLink = document.createElement('a');
          adminLink.id = 'profileAdminLink';
          adminLink.href = 'admin.html';
          adminLink.className = 'btn btn-primary btn-block';
          adminLink.style.marginTop = '12px';
          adminLink.style.textAlign = 'center';
          adminLink.style.textDecoration = 'none';
          adminLink.textContent = "⚙ Accéder à l'espace Admin";
          $('#logoutBtn').parentNode.insertBefore(adminLink, $('#logoutBtn'));
        }
        adminLink.style.display = 'block';
      } else if(adminLink){
        adminLink.style.display = 'none';
      }
    } else {
      $('#authBlock').style.display = 'block';
      $('#accountBlock').style.display = 'none';
      switchTab('login');
    }
  }

  /* ---------------- DECO CHATBOT ---------------- */
  var decoOpened = false;
  function quickReplyDefs(){
    return [
      { label: t('q_see_products'),   action: function(){ goTo('products'); botSay(t('r_see_products')); } },
      { label: t('q_how_add_cart'),   action: function(){ botSay(t('r_how_add_cart')); } },
      { label: t('q_create_account'), action: function(){ goTo('profile'); botSay(t('r_create_account')); } },
      { label: t('q_who_are_you'),    action: function(){ goTo('about'); botSay(t('r_who_are_you')); } },
      { label: t('q_contact_us'),     action: function(){ botSay(t('r_contact_us')); } }
    ];
  }

  function renderQuick(){
    var quickReplies = quickReplyDefs();
    $('#decoQuick').innerHTML = quickReplies.map(function(q,i){ return '<button data-q="'+i+'">'+q.label+'</button>'; }).join('');
    $all('[data-q]').forEach(function(b){
      b.addEventListener('click', function(){
        var defs = quickReplyDefs();
        var idx = parseInt(b.dataset.q,10);
        userSay(defs[idx].label);
        defs[idx].action();
      });
    });
  }

  function appendMsg(text, who){
    var d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    $('#decoMessages').appendChild(d);
    $('#decoMessages').scrollTop = $('#decoMessages').scrollHeight;
    return d;
  }
  function botSay(text){ appendMsg(text, 'bot'); }
  function userSay(text){ appendMsg(text, 'user'); }

  function showTyping(){
    var d = document.createElement('div');
    d.className = 'msg bot typing';
    d.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    $('#decoMessages').appendChild(d);
    $('#decoMessages').scrollTop = $('#decoMessages').scrollHeight;
    return d;
  }

  // Reveals the reply progressively, word by word, for a livelier
  // ChatGPT-style feel instead of the whole answer popping in at once.
  function typeOutReply(el, text){
    var words = text.split(' ');
    var i = 0;
    el.textContent = '';
    var iv = setInterval(function(){
      el.textContent += (i === 0 ? '' : ' ') + words[i];
      i++;
      $('#decoMessages').scrollTop = $('#decoMessages').scrollHeight;
      if(i >= words.length) clearInterval(iv);
    }, 28);
  }

  function openDeco(){
    $('#decoPanel').classList.add('open');
    if(!decoOpened){
      decoOpened = true;
      botSay(t('deco_greeting'));
      renderQuick();
    }
  }
  function closeDeco(){ $('#decoPanel').classList.remove('open'); }
  $('#decoBtn').addEventListener('click', function(){
    $('#decoPanel').classList.contains('open') ? closeDeco() : openDeco();
  });
  $('#closeDeco').addEventListener('click', closeDeco);

  // Rolling transcript sent to the backend so the assistant can follow a
  // real conversation, not just answer each message in isolation. Capped
  // client-side too, so a long chat session doesn't grow the payload forever.
  var chatHistory = [];

  function localFallbackReply(text){
    var t2 = text.toLowerCase();
    if(/panier|achat|command|cart|buy|order/.test(t2)) return t('reply_cart');
    if(/produit|boutique|achete|vase|lampe|cadre|product|shop|store/.test(t2)){ goTo('products'); return t('reply_products'); }
    if(/compte|profil|inscri|connex|login|account|profile|signup|sign up|sign-in/.test(t2)){ goTo('profile'); return t('reply_account'); }
    if(/contact|instagram|facebook|email|mail|gmail/.test(t2)) return t('reply_contact');
    if(/qui|histoire|lycee|lycée|khemisset|propos|who|about|story|school/.test(t2)){ goTo('about'); return t('reply_about'); }
    if(/bonjour|salut|slt|hello|hi|hey/.test(t2)) return t('reply_greeting');
    if(/merci|thanks|thank you/.test(t2)) return t('reply_thanks');
    return t('reply_fallback');
  }

  function handleInput(){
    var input = $('#decoInput');
    var text = input.value.trim();
    if(!text) return;
    userSay(text);
    input.value = '';
    $('#decoQuick').innerHTML = '';

    chatHistory.push({ role: 'user', content: text });
    if(chatHistory.length > 16) chatHistory = chatHistory.slice(-16);

    var typingEl = showTyping();

    fetch(API + '/chat', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: chatHistory.slice(0, -1) })
    }).then(function(res){
      if(!res.ok) throw new Error('chat request failed');
      return res.json();
    }).then(function(data){
      typingEl.remove();
      typingEl.classList.remove('typing');
      var el = appendMsg('', 'bot');
      typeOutReply(el, data.reply);
      chatHistory.push({ role: 'assistant', content: data.reply });
    }).catch(function(){
      // Backend unreachable or no AI configured — fall back to the local
      // rule-based responder so the assistant still feels responsive.
      setTimeout(function(){
        typingEl.remove();
        var reply = localFallbackReply(text);
        var el = appendMsg('', 'bot');
        typeOutReply(el, reply);
        chatHistory.push({ role: 'assistant', content: reply });
        if(reply === t('reply_fallback')) renderQuick();
      }, 300);
    });
  }
  $('#decoSend').addEventListener('click', handleInput);
  $('#decoInput').addEventListener('keydown', function(e){ if(e.key === 'Enter') handleInput(); });

  /* ---------------- 3D TILT ON PRODUCT CARDS ---------------- */
  document.addEventListener('pointermove', function(e){
    var card = e.target.closest && e.target.closest('.product-card');
    if(!card) return;
    var r = card.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width;   // 0..1
    var py = (e.clientY - r.top) / r.height;   // 0..1
    var ry = (px - 0.5) * 14;   // rotateY range
    var rx = (0.5 - py) * 10;   // rotateX range
    card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
  });
  document.addEventListener('pointerout', function(e){
    var card = e.target.closest && e.target.closest('.product-card');
    if(!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });

  /* ---------------- SCROLL REVEAL (Tailwind-driven) ---------------- */
  function initScrollReveal(){
    var targets = $all('.about-credit, .gallery-grid img, .section-head, .stats-row, .about-text, .about-intro p');
    var revealClasses = [
      'opacity-0', 'translate-y-7', 'transition-all', 'duration-700', 'ease-out',
      '[&.is-visible]:opacity-100', '[&.is-visible]:translate-y-0'
    ];
    targets.forEach(function(el, i){
      el.classList.add.apply(el.classList, revealClasses);
      el.classList.add('[transition-delay:' + (((i % 4) + 1) * 0.06).toFixed(2) + 's]');
    });
    if(!('IntersectionObserver' in window)){
      targets.forEach(function(el){ el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function(el){ io.observe(el); });
  }

  /* ---------------- ABOUT STEPS: connecting line reveal ---------------- */
  function initStepsLine(){
    var grid = document.querySelector('.steps-grid');
    if(!grid) return;
    if(!('IntersectionObserver' in window)){ grid.classList.add('in-view'); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    io.observe(grid);
  }

  /* ---------------- ANIMATED STAT COUNTERS (@property --num) ---------------- */
  function initStatCounters(){
    var nums = $all('.stat-num');
    if(!nums.length) return;
    if(!('IntersectionObserver' in window)){
      nums.forEach(function(el){ el.style.setProperty('--num', el.dataset.target); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var el = entry.target;
          // Force a reflow so the browser registers the 0 starting value
          // before we jump to the target, guaranteeing the transition runs.
          el.style.setProperty('--num', '0');
          void el.offsetWidth;
          el.classList.add('stat-num-pop');
          requestAnimationFrame(function(){
            el.style.setProperty('--num', el.dataset.target);
          });
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(function(el){ io.observe(el); });
  }

  /* ---------------- HERO PARALLAX ---------------- */
  /* ---------------- DARK / LIGHT THEME TOGGLE ---------------- */
  var THEME_KEY = 'decorna_theme';
  function applyThemeAria(){
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var btn = document.getElementById('themeToggle');
    if(btn) btn.setAttribute('aria-label', isDark ? t('aria_theme_toggle_light') : t('aria_theme_toggle_dark'));
  }
  function initThemeToggle(){
    var btn = document.getElementById('themeToggle');
    if(!btn) return;
    applyThemeAria();
    btn.addEventListener('click', function(){
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
      applyThemeAria();
    });
  }

  function initHeroParallax(){
    var heroArt = document.querySelector('.hero-art');
    if(!heroArt) return;
    var ticking = false;
    function update(){
      ticking = false;
      var y = window.scrollY || document.documentElement.scrollTop;
      var offset = Math.min(y * 0.18, 60);
      heroArt.style.setProperty('--hero-parallax', offset.toFixed(1));
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------------- RECYCLING VIDEO SECTION ---------------- */
  function initRecyclingVideo(){
    document.querySelectorAll('.video-hero').forEach(function(wrap){
      var video = wrap.querySelector('.video-hero-media');
      if(!video) return;
      video.addEventListener('canplay', function(){
        wrap.classList.add('video-ready');
        video.play().catch(function(){ /* autoplay blocked — poster still shows */ });
      });
      video.addEventListener('error', function(){
        wrap.classList.remove('video-ready');
      });
      video.load();
    });
  }

  /* ---------------- INIT ---------------- */
  applyStaticTranslations();
  loadProducts();
  checkAuth();
  renderChips();
  renderCart();
  renderProfile();
  initScrollReveal();
  initStatCounters();
  initStepsLine();
  initRecyclingVideo();
  initThemeToggle();

  var minTimer = new Promise(function(res){ setTimeout(res, 80); });
  var pageLoad = new Promise(function(res){
    if(document.readyState === 'complete') res();
    else window.addEventListener('load', res);
  });
  Promise.all([minTimer, pageLoad]).then(function(){
    var loader = $('#loader');
    if(loader) loader.classList.add('hide');
    document.body.classList.add('page-revealed');
  });

})();
