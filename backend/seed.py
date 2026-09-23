"""
seed.py — populate the Decorna database with the product catalog (mirrors the
data that used to live only inside the frontend's script.js) and create a
default admin account.

Usage:
    flask --app app init-db   # creates empty tables from schema.sql
    flask --app app seed      # fills them with demo data
"""
import click
from werkzeug.security import generate_password_hash

from db import get_db

# name / material / desc are given in fr / en / ar. `ar` is left blank for
# items that only ever had fr/en on the frontend (the UI already falls back
# to fr when an ar string is missing).
PRODUCTS = [
    dict(
        cat_key="vases", icon="vase", image_path="products/vase-mawja.jpg", price=150, stock=14,
        name_fr='Vase "Mawja"', name_en='"Mawja" Vase', name_ar=None,
        material_fr="Plastique", material_en="Plastic", material_ar=None,
        desc_fr="Vase ondulé en plastique recyclé fondu et moulé à la main.",
        desc_en="Wavy vase made from melted, hand-molded recycled plastic.",
        desc_ar=None,
        long_fr="Vase ondulé en plastique recyclé fondu et moulé à la main. "
                "Chaque vase est unique : les motifs et nuances varient légèrement selon le "
                "plastique récupéré, ce qui rend votre pièce irremplaçable. Résistant à l'eau, "
                "il convient aussi bien aux fleurs séchées qu'aux compositions fraîches.",
        long_en="Wavy vase made from melted, hand-molded recycled plastic. "
                "Each vase is unique: patterns and shades vary slightly depending on the "
                "recovered plastic, making your piece one of a kind. Water-resistant, it suits "
                "both dried flowers and fresh arrangements.",
        long_ar="كل مزهرية فريدة من نوعها: تختلف الأنماط والألوان قليلًا حسب البلاستيك المسترجع، "
                "مما يجعل قطعتك لا مثيل لها. مقاومة للماء، تناسب الزهور المجففة والباقات الطازجة "
                "على حد سواء.",
    ),
    dict(
        cat_key="lighting", icon="lamp", image_path="products/lampe-lumina.jpg", price=220, stock=8,
        name_fr='Lampe "Lumina"', name_en='"Lumina" Lamp', name_ar=None,
        material_fr="Carton", material_en="Cardboard", material_ar=None,
        desc_fr="Lampe de table en carton tressé, lumière douce et chaleureuse.",
        desc_en="Table lamp made of woven cardboard, with a soft, warm glow.",
        desc_ar=None,
        long_fr="Lampe de table en carton tressé, lumière douce et chaleureuse. "
                "Le tressage du carton diffuse une lumière chaude et enveloppante, idéale pour "
                "une ambiance cosy le soir. Livrée avec une douille E14 compatible avec la "
                "plupart des ampoules basse consommation.",
        long_en="Table lamp made of woven cardboard, with a soft, warm glow. "
                "The woven cardboard diffuses a warm, enveloping light, perfect for a cozy "
                "evening atmosphere. Comes with an E14 socket compatible with most low-energy "
                "bulbs.",
        long_ar="يبعث الكرتون المضفّر ضوءًا دافئًا وحميميًا، مثاليًا لأجواء مسائية مريحة. مزودة "
                "بمقبس E14 متوافق مع معظم المصابيح الموفرة للطاقة.",
    ),
    dict(
        cat_key="frames", icon="frame", image_path="products/cadre-souvenir.jpg", price=90, stock=20,
        name_fr='Cadre "Souvenir"', name_en='"Souvenir" Frame', name_ar=None,
        material_fr="Carton", material_en="Cardboard", material_ar=None,
        desc_fr="Cadre photo en carton renforcé, finition peinte mate.",
        desc_en="Photo frame in reinforced cardboard with a matte painted finish.",
        desc_ar=None,
        long_fr="Cadre photo en carton renforcé, finition peinte mate. "
                "Le cadre est renforcé par plusieurs couches de carton collées puis poncées, "
                "pour une rigidité proche du bois tout en restant léger. Finition mate peinte "
                "à la main, sans vernis chimique.",
        long_en="Photo frame in reinforced cardboard with a matte painted finish. "
                "The frame is reinforced with several layers of glued, sanded cardboard, "
                "giving a rigidity close to wood while staying lightweight. Hand-painted matte "
                "finish, with no chemical varnish.",
        long_ar="الإطار مقوّى بعدة طبقات من الكرتون الملصق والمصنفر، مما يمنحه صلابة قريبة من "
                "الخشب مع بقائه خفيف الوزن. تشطيب غير لامع مطلي يدويًا، بدون ورنيش كيميائي.",
    ),
    dict(
        cat_key="storage", icon="basket", image_path="products/panier-nida.jpg", price=130, stock=11,
        name_fr='Panier "Nida"', name_en='"Nida" Basket', name_ar=None,
        material_fr="Plastique", material_en="Plastic", material_ar=None,
        desc_fr="Panier de rangement tressé à partir de sacs plastiques recyclés.",
        desc_en="Storage basket woven from recycled plastic bags.",
        desc_ar=None,
        long_fr="Panier de rangement tressé à partir de sacs plastiques recyclés. "
                "Tressé fil à fil à partir de sacs plastiques nettoyés et découpés en lanières, "
                "ce panier est robuste et lavable à l'eau savonneuse. Parfait pour le rangement "
                "du linge, des jouets ou des accessoires.",
        long_en="Storage basket woven from recycled plastic bags. "
                "Woven strand by strand from cleaned plastic bags cut into strips, this basket "
                "is sturdy and washable with soapy water. Perfect for storing laundry, toys, or "
                "accessories.",
        long_ar="مضفّرة خيطًا بخيط من أكياس بلاستيكية منظفة ومقطعة إلى شرائط، هذه السلة متينة "
                "وقابلة للغسل بالماء والصابون. مثالية لتخزين الملابس أو الألعاب أو الإكسسوارات.",
    ),
    dict(
        cat_key="clocks", icon="clock", image_path="products/horloge-cercle-vert.jpg", price=180, stock=6,
        name_fr='Horloge "Cercle Vert"', name_en='"Green Circle" Clock', name_ar=None,
        material_fr="Mixte", material_en="Mixed", material_ar=None,
        desc_fr="Horloge murale en carton et plastique, cadran peint à la main.",
        desc_en="Wall clock made of cardboard and plastic, with a hand-painted dial.",
        desc_ar=None,
        long_fr="Horloge murale en carton et plastique, cadran peint à la main. "
                "Le mécanisme à quartz silencieux (pile AA non incluse) est fixé sur un cadran "
                "en carton et plastique peint à la main, chaque cadran ayant ses propres "
                "nuances de couleur.",
        long_en="Wall clock made of cardboard and plastic, with a hand-painted dial. "
                "The silent quartz movement (AA battery not included) is mounted on a "
                "hand-painted cardboard-and-plastic dial, each dial having its own shade "
                "variations.",
        long_ar="الآلية الصامتة تعمل بالكوارتز (بطارية AA غير مرفقة) ومثبتة على قرص من الكرتون "
                "والبلاستيك مطلي يدويًا، ولكل قرص درجات لونية خاصة به.",
    ),
    dict(
        cat_key="vases", icon="pot", image_path="products/pot-racine.jpg", price=75, stock=25,
        name_fr='Pot "Racine"', name_en='"Root" Pot', name_ar=None,
        material_fr="Plastique", material_en="Plastic", material_ar=None,
        desc_fr="Pot à plantes compact, idéal pour succulentes et herbes.",
        desc_en="Compact plant pot, perfect for succulents and herbs.",
        desc_ar=None,
        long_fr="Pot à plantes compact, idéal pour succulentes et herbes. "
                "Compact et léger, ce pot est percé d'un trou de drainage discret et livré "
                "avec une petite soucoupe assortie pour protéger vos meubles.",
        long_en="Compact plant pot, perfect for succulents and herbs. "
                "Compact and lightweight, this pot has a discreet drainage hole and comes with "
                "a matching small saucer to protect your furniture.",
        long_ar="خفيفة ومدمجة، هذه الأصيصة مثقوبة بفتحة تصريف خفية ومزودة بصحن صغير مطابق "
                "لحماية أثاثك.",
    ),
    dict(
        cat_key="storage", icon="box", image_path=None, price=110, stock=9,
        name_fr='Boîte "Trésor"', name_en='"Treasure" Box', name_ar=None,
        material_fr="Carton", material_en="Cardboard", material_ar=None,
        desc_fr="Boîte à bijoux en carton matelassé avec doublure intérieure.",
        desc_en="Jewelry box in quilted cardboard with an inner lining.",
        desc_ar=None,
        long_fr="Boîte à bijoux en carton matelassé avec doublure intérieure. "
                "L'intérieur est doublé d'un tissu doux recyclé pour protéger vos bijoux ou "
                "petits objets précieux. Le couvercle capitonné se referme avec un léger clic.",
        long_en="Jewelry box in quilted cardboard with an inner lining. "
                "The inside is lined with soft recycled fabric to protect your jewelry or "
                "small precious items. The quilted lid closes with a gentle click.",
        long_ar="الداخل مبطن بقماش ناعم معاد تدويره لحماية مجوهراتك أو أغراضك الثمينة الصغيرة. "
                "يُغلق الغطاء المبطن بنقرة خفيفة.",
    ),
    dict(
        cat_key="frames", icon="mirror", image_path="products/miroir-reflet.jpg", price=240, stock=5,
        name_fr='Miroir "Reflet"', name_en='"Reflection" Mirror', name_ar=None,
        material_fr="Carton", material_en="Cardboard", material_ar=None,
        desc_fr="Miroir ovale encadré de carton sculpté et verni.",
        desc_en="Oval mirror framed with carved, varnished cardboard.",
        desc_ar=None,
        long_fr="Miroir ovale encadré de carton sculpté et verni. "
                "Le cadre sculpté à la main est verni pour résister à l'humidité de la salle "
                "de bain comme à la poussière du salon. Miroir standard 3 mm, fixation murale "
                "incluse.",
        long_en="Oval mirror framed with carved, varnished cardboard. "
                "The hand-carved frame is varnished to withstand bathroom humidity as well as "
                "living-room dust. Standard 3 mm mirror, wall mount included.",
        long_ar="الإطار المنحوت يدويًا مطلي بورنيش لمقاومة رطوبة الحمام وغبار الصالون على حد "
                "سواء. مرآة قياسية 3 ملم، مع تثبيت جداري.",
    ),
    dict(
        cat_key="walldeco", icon="garland", image_path=None, price=160, stock=17,
        name_fr='Suspension "Feuillage"', name_en='"Foliage" Garland', name_ar=None,
        material_fr="Plastique", material_en="Plastic", material_ar=None,
        desc_fr="Guirlande murale en perles de plastique recyclé.",
        desc_en="Wall garland made of recycled plastic beads.",
        desc_ar=None,
        long_fr="Guirlande murale en perles de plastique recyclé. "
                "Chaque perle est façonnée à partir de bouchons et fragments plastiques "
                "fondus, puis enfilée à la main sur un fil solide. Idéale pour habiller un "
                "mur, une fenêtre ou une tête de lit.",
        long_en="Wall garland made of recycled plastic beads. "
                "Each bead is shaped from melted caps and plastic fragments, then hand-strung "
                "on a sturdy thread. Perfect for dressing up a wall, window, or headboard.",
        long_ar="كل خرزة مشكّلة من أغطية وشظايا بلاستيكية مذابة، ثم منظومة يدويًا على خيط "
                "متين. مثالية لتزيين جدار أو نافذة أو رأس السرير.",
    ),
    dict(
        cat_key="vases", icon="auroreCorail", image_path="products/vase-aurore-corail.jpg", price=210, stock=3,
        name_fr='Vase "Aurore Corail"', name_en='"Coral Dawn" Vase', name_ar=None,
        material_fr="Plastique", material_en="Plastic", material_ar=None,
        desc_fr="Vase évasé en dégradé terracotta vers corail poudré, finition brillante "
                "façon céramique.",
        desc_en="Flared vase in a terracotta-to-powder-coral gradient, with a glossy "
                "ceramic-like finish.",
        desc_ar=None,
        long_fr="Ce vase phare de la collection est moulé en plastique recyclé, puis passé "
                "sous une double couche de laque qui donne ce dégradé terracotta-corail et "
                "cet éclat façon céramique. Sa base évasée assure une bonne stabilité, même "
                "avec un bouquet généreux. Une pièce sculpturale qui devient le point focal "
                "de n'importe quelle pièce.",
        long_en="This flagship vase is molded from recycled plastic, then finished with a "
                "double lacquer coat that creates its terracotta-to-coral gradient and "
                "ceramic-like sheen. Its flared base keeps it stable even with a generous "
                "bouquet. A sculptural piece that becomes the focal point of any room.",
        long_ar="هذه المزهرية الرائدة في المجموعة مصبوبة من بلاستيك معاد تدويره، ثم مطلية "
                "بطبقتين من الورنيش تمنحانها هذا التدرج من التيراكوتا إلى المرجاني ولمعانًا "
                "يشبه السيراميك. قاعدتها المتسعة تمنحها ثباتًا حتى مع باقة أزهار كبيرة. "
                "قطعة نحتية تصبح نقطة التركيز في أي غرفة.",
    ),
    dict(
        cat_key="vases", icon="vaseNomade", image_path="products/vase-frange-cuir.jpg", price=195, stock=12,
        name_fr='Vase "Nomade"', name_en='"Nomade" Vase', name_ar=None,
        material_fr="Plastique & fibres", material_en="Plastic & fiber", material_ar=None,
        desc_fr="Vase cylindrique beige orné de franges tressées noires, inspiré des "
                "tentures berbères.",
        desc_en="Beige cylindrical vase adorned with braided black fringes, inspired by "
                "Berber textiles.",
        desc_ar=None,
        long_fr="Le corps du vase est moulé en plastique recyclé teinté dans la masse, "
                "puis habillé de franges tressées à la main à partir de fibres synthétiques "
                "récupérées, façon tenture berbère. Chaque frange est nouée individuellement, "
                "ce qui rend chaque vase légèrement différent de son voisin.",
        long_en="The vase body is molded from mass-dyed recycled plastic, then dressed "
                "with hand-braided fringes made from recovered synthetic fiber, in the style "
                "of a Berber wall hanging. Each fringe is individually knotted, making every "
                "vase slightly different from the next.",
        long_ar="جسم المزهرية مصبوب من بلاستيك معاد تدويره مصبوغ في الكتلة، ثم مزين "
                "بشرابات مضفّرة يدويًا من ألياف اصطناعية مسترجعة، على طراز المنسوجات "
                "الأمازيغية. كل شرابة معقودة بشكل فردي، مما يجعل كل مزهرية مختلفة قليلًا عن "
                "الأخرى.",
    ),
    dict(
        cat_key="storage", icon="coffretRose", image_path="products/coffret-rose.jpg", price=180, stock=10,
        name_fr='Coffret "Rose Éternelle"', name_en='"Eternal Rose" Gift Box', name_ar=None,
        material_fr="Carton recyclé & rose stabilisée", material_en="Recycled cardboard & preserved rose", material_ar=None,
        desc_fr="Écrin rose pâle en carton recyclé pressé, avec une rose stabilisée sous "
                "dôme et un tiroir doré.",
        desc_en="Pale pink gift box in pressed recycled cardboard, with a preserved rose "
                "under a dome and a gilded drawer.",
        desc_ar=None,
        long_fr="L'écrin est pressé à partir de carton recyclé recouvert d'un similicuir "
                "rose pâle, avec une finition dorée à chaud. La rose sous dôme est stabilisée "
                "pour garder son éclat plusieurs mois sans eau ni entretien. Le petit tiroir "
                "permet d'y glisser un bijou ou un mot doux.",
        long_en="The box is pressed from recycled cardboard covered in a pale pink faux "
                "leather, with a hot-stamped gilded finish. The rose under the dome is "
                "preserved to keep its bloom for months with no water or care needed. The "
                "small drawer is perfect for slipping in a piece of jewelry or a note.",
        long_ar="العلبة مضغوطة من كرتون معاد تدويره مغطى بجلد صناعي وردي فاتح، مع لمسة "
                "نهائية مذهبة بالحرارة. الوردة تحت القبة محفوظة لتحتفظ ببهائها لأشهر دون "
                "ماء أو عناية. الدرج الصغير مثالي لوضع مجوهرة أو رسالة صغيرة.",
    ),
    dict(
        cat_key="lighting", icon="lampeFeuillesDorees", image_path="products/lampe-feuilles-dorees.jpg", price=260, stock=7,
        name_fr='Suspension "Feuilles Dorées"', name_en='"Golden Leaves" Pendant Lamp', name_ar=None,
        material_fr="Métal recyclé", material_en="Recycled metal", material_ar=None,
        desc_fr="Suspension sphérique entièrement recouverte de feuilles en métal recyclé "
                "doré à la main.",
        desc_en="Spherical pendant lamp entirely covered in hand-gilded recycled-metal "
                "leaves.",
        desc_ar=None,
        long_fr="Chaque feuille est découpée dans du métal recyclé puis fixée une à une "
                "sur l'armature sphérique, avant une dorure appliquée entièrement à la main. "
                "Suspendue à sa chaîne, elle diffuse une lumière chaude et tamisée à travers "
                "les interstices entre les feuilles.",
        long_en="Each leaf is cut from recycled metal and individually fixed onto the "
                "spherical frame, before the whole piece is hand-gilded. Hung from its "
                "chain, it casts a warm, dappled light through the gaps between the leaves.",
        long_ar="كل ورقة مقصوصة من معدن معاد تدويره ومثبتة واحدة تلو الأخرى على الهيكل "
                "الكروي، قبل تذهيب القطعة بالكامل يدويًا. معلقة بسلسلتها، تبعث ضوءًا دافئًا "
                "ومرقّطًا عبر الفراغات بين الأوراق.",
    ),
    dict(
        cat_key="keychains", icon="keychainTrophy", image_path=None, price=35, stock=40,
        name_fr='Porte-clés "Trophée"', name_en='"Trophy" Keychain', name_ar=None,
        material_fr="Plastique recyclé", material_en="Recycled plastic", material_ar=None,
        desc_fr="Mini trophée doré moulé à partir de chutes de plastique recyclé, avec "
                "anneau porte-clés.",
        desc_en="Mini gold-tone trophy molded from recycled plastic offcuts, with keyring.",
        desc_ar=None,
        long_fr="Moulé à partir de chutes de plastique recyclé fondues puis teintées "
                "dorées, ce mini trophée est fixé à un anneau et une chaînette métallique "
                "robustes. Un clin d'œil ludique à offrir aux passionnés de sport.",
        long_en="Molded from melted, gold-tinted recycled plastic offcuts, this mini "
                "trophy is fixed to a sturdy keyring and chain. A playful little gift for "
                "any sports fan.",
        long_ar="مصبوب من بقايا بلاستيك معاد تدويره مذابة وملونة بالذهبي، مثبتة بحلقة "
                "مفاتيح وسلسلة معدنية متينة. هدية صغيرة وممتعة لعشاق الرياضة.",
    ),
    dict(
        cat_key="keychains", icon="keychainGiraffe", image_path=None, price=30, stock=35,
        name_fr='Porte-clés "Girafe"', name_en='"Giraffe" Keychain', name_ar=None,
        material_fr="Plastique recyclé", material_en="Recycled plastic", material_ar=None,
        desc_fr="Petite girafe colorée moulée à la main à partir de plastique recyclé, "
                "idéale à offrir.",
        desc_en="Small colorful giraffe hand-molded from recycled plastic, perfect as a "
                "little gift.",
        desc_ar=None,
        long_fr="Chaque girafe est moulée à la main à partir de plastique recyclé coloré, "
                "puis poncée pour un toucher doux. Format compact, parfait pour un trousseau "
                "de clés ou un sac à dos.",
        long_en="Each giraffe is hand-molded from colored recycled plastic, then sanded "
                "for a smooth touch. Compact size, perfect for a keyring or backpack.",
        long_ar="كل زرافة مصبوبة يدويًا من بلاستيك معاد تدويره ملون، ثم مصنفرة لملمس "
                "ناعم. حجم صغير مثالي لحلقة المفاتيح أو الحقيبة.",
    ),
    dict(
        cat_key="keychains", icon="keychainVase", image_path=None, price=28, stock=50,
        name_fr='Porte-clés "Mini Vase"', name_en='"Mini Vase" Keychain', name_ar=None,
        material_fr="Plastique recyclé", material_en="Recycled plastic", material_ar=None,
        desc_fr="Version miniature de nos vases signature, en plastique recyclé, pour "
                "emporter Decorna partout.",
        desc_en="Miniature version of our signature vases, in recycled plastic, to take "
                "Decorna everywhere.",
        desc_ar=None,
        long_fr="Une réplique miniature de nos vases en plastique recyclé, façonnée avec "
                "le même souci du détail que nos pièces grand format. Chaque exemplaire "
                "porte de légères variations de teinte, comme les vases originaux.",
        long_en="A miniature replica of our recycled-plastic vases, shaped with the same "
                "care as our full-size pieces. Each one carries slight shade variations, "
                "just like the original vases.",
        long_ar="نسخة مصغرة من مزهرياتنا المصنوعة من البلاستيك المعاد تدويره، مشكّلة بنفس "
                "العناية التي تُولى لقطعنا الكبيرة. كل نسخة تحمل اختلافات طفيفة في اللون، "
                "تمامًا مثل المزهريات الأصلية.",
    ),
    dict(
        cat_key="lighting", icon="floorLamp", image_path=None, price=340, stock=4,
        name_fr='Lampadaire "Amazigh"', name_en='"Amazigh" Floor Lamp', name_ar=None,
        material_fr="Bois & tissu recyclé", material_en="Wood & recycled fabric", material_ar=None,
        desc_fr="Lampadaire sur pied habillé de tissu à motifs berbères tissé à partir de "
                "fibres recyclées.",
        desc_en="Floor lamp dressed in Berber-pattern fabric woven from recycled fibers.",
        desc_ar=None,
        long_fr="L'armature en bois recyclé est habillée d'un tissu tissé main aux motifs "
                "berbères, à partir de chutes textiles récupérées. La douille standard E27 "
                "accepte la plupart des ampoules basse consommation.",
        long_en="The recycled-wood frame is dressed in a hand-woven fabric with Berber "
                "patterns, made from recovered textile offcuts. The standard E27 socket "
                "fits most low-energy bulbs.",
        long_ar="الهيكل الخشبي المعاد تدويره مكسو بنسيج منسوج يدويًا بزخارف أمازيغية، من "
                "بقايا قماش مسترجعة. المقبس القياسي E27 يناسب معظم المصابيح الموفرة للطاقة.",
    ),
    dict(
        cat_key="clocks", icon="clockWoven", image_path=None, price=210, stock=9,
        name_fr='Horloge "Tressée"', name_en='"Braided" Clock', name_ar=None,
        material_fr="Corde recyclée & bois", material_en="Recycled rope & wood", material_ar=None,
        desc_fr="Horloge murale au cadran tressé à partir de corde recyclée, orné de "
                "perles de bois et pierres récupérées.",
        desc_en="Wall clock with a dial braided from recycled rope, adorned with wooden "
                "beads and reclaimed stones.",
        desc_ar=None,
        long_fr="Le cadran est tressé fil à fil à partir de corde recyclée, puis orné de "
                "perles de bois et de petites pierres récupérées collées à la main. "
                "Mécanisme à quartz silencieux, pile AA non incluse.",
        long_en="The dial is braided strand by strand from recycled rope, then adorned "
                "with wooden beads and small reclaimed stones glued by hand. Silent quartz "
                "movement, AA battery not included.",
        long_ar="القرص مضفّر خيطًا بخيط من حبل معاد تدويره، ثم مزين بخرزات خشبية وأحجار "
                "صغيرة مسترجعة ملصقة يدويًا. آلية صامتة تعمل بالكوارتز، بطارية AA غير مرفقة.",
    ),
    dict(
        cat_key="walldeco", icon="wallPlanter", image_path=None, price=95, stock=15,
        name_fr='Support Mural "Bouture"', name_en='"Cutting" Wall Planter', name_ar=None,
        material_fr="Bois recyclé & verre récupéré", material_en="Recycled wood & reclaimed glass", material_ar=None,
        desc_fr="Support mural triangulaire en bois recyclé, avec petit tube en verre "
                "récupéré pour faire raciner vos boutures.",
        desc_en="Triangular wall support in recycled wood, with a small reclaimed-glass "
                "tube for rooting plant cuttings.",
        desc_ar=None,
        long_fr="Découpé dans des chutes de bois recyclé puis poncé et huilé, ce support "
                "suspend un petit tube en verre récupéré, parfait pour faire raciner une "
                "bouture avant de la mettre en terre.",
        long_en="Cut from recycled wood offcuts, then sanded and oiled, this support "
                "holds a small reclaimed-glass tube, perfect for rooting a cutting before "
                "potting it.",
        long_ar="مقصوص من بقايا خشب معاد تدويره ثم مصنفر ومزيّت، يحمل هذا الحامل أنبوبًا "
                "زجاجيًا صغيرًا مسترجعًا، مثاليًا لتجذير عقلة نباتية قبل زراعتها.",
    ),
]


def seed_products(db):
    cols = list(PRODUCTS[0].keys())
    placeholders = ", ".join("?" for _ in cols)
    col_list = ", ".join(cols)
    for p in PRODUCTS:
        db.execute(
            f"INSERT INTO products ({col_list}) VALUES ({placeholders})",
            [p[c] for c in cols],
        )


def seed_admin(db):
    db.execute(
        "INSERT OR IGNORE INTO users (full_name, email, password_hash, is_admin) "
        "VALUES (?, ?, ?, 1)",
        ("Admin Decorna", "admin@decorna.ma", generate_password_hash("Decorna2026!")),
    )


def run_seed():
    db = get_db()
    seed_products(db)
    seed_admin(db)
    db.commit()


@click.command("seed")
def seed_command():
    """CLI: `flask --app app seed` — fills the DB with demo products + admin user."""
    run_seed()
    click.echo(f"Seeded {len(PRODUCTS)} products and 1 admin user "
               f"(admin@decorna.ma / Decorna2026!).")


def init_app(app):
    app.cli.add_command(seed_command)
