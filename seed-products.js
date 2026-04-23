require('dotenv').config();
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image_url: String,
    category: String,
    description: String,
    product_info: String,
    reviews: [{
        author: String,
        rating: Number,
        text: String
    }],
    product_care: String,
    oldId: Number
});
const Product = mongoose.model('Product', productSchema);

const products = [
    // ===== COATS (4 products) =====
    {
        name: "Noir Cashmere Overcoat",
        price: 389,
        image_url: "img/products/img-1.jpg",
        category: "coats",
        oldId: 1,
        description: "A masterfully tailored overcoat in deep noir cashmere, designed for the modern gentleman who demands both warmth and sophistication. The double-breasted silhouette features hand-stitched lapels and a full satin lining.",
        product_info: "Material: 100% Italian Cashmere\nLining: Pure Silk Satin\nClosure: Double-breasted with horn buttons\nPockets: 2 exterior flap pockets, 1 interior zip pocket\nLength: Mid-calf\nFit: Tailored / Slim\nOrigin: Handcrafted in Milan, Italy\nSeason: Autumn / Winter",
        reviews: [
            { author: "Alessandro M.", rating: 5, text: "Absolutely stunning quality. The cashmere is incredibly soft and the tailoring is impeccable. Worth every penny." },
            { author: "James W.", rating: 5, text: "This overcoat turns heads everywhere I go. The fit is perfect and it keeps me warm even in the harshest winters." },
            { author: "Raj K.", rating: 4, text: "Beautiful coat, luxurious feel. Runs slightly long — consider your height before ordering." }
        ],
        product_care: "Dry clean only. Store on a padded hanger in a breathable garment bag. Avoid direct sunlight and heat sources. Brush gently with a cashmere brush after each wear to maintain the nap. Steam lightly to remove wrinkles — do not iron directly."
    },
    {
        name: "Royal Navy Blazer",
        price: 425,
        image_url: "img/products/img-2.jpg",
        category: "coats",
        oldId: 2,
        description: "Commanding presence meets refined taste in this royal navy blazer. Crafted from premium Italian wool with a subtle herringbone weave, it transitions effortlessly from boardroom to evening events.",
        product_info: "Material: 95% Italian Merino Wool, 5% Cashmere\nLining: Viscose-Cupro blend\nClosure: Two-button front\nPockets: 3 exterior pockets (1 breast, 2 hip), 2 interior pockets\nVent: Double vent\nFit: Regular / Classic\nOrigin: Tailored in Naples, Italy\nSeason: All Season",
        reviews: [
            { author: "Michael R.", rating: 5, text: "The finest blazer I've ever owned. The wool has a beautiful drape and the construction is flawless." },
            { author: "David L.", rating: 5, text: "Versatile and elegant. I wear it to the office and to dinner — always get compliments." },
            { author: "Sophia T.", rating: 4, text: "Bought this for my husband and he absolutely loves it. The navy color is rich and deep." }
        ],
        product_care: "Professional dry cleaning recommended. Hang on a sturdy wooden hanger to maintain shoulder shape. Spot clean minor stains with a damp cloth and mild detergent. Rotate with other blazers to extend garment life."
    },
    {
        name: "Midnight Wool Trench",
        price: 520,
        image_url: "img/products/img-5.jpg",
        category: "coats",
        description: "A modern reinterpretation of the classic trench, rendered in midnight black virgin wool. Features a storm flap, adjustable waist belt, and gunmetal hardware for a sleek, architectural silhouette.",
        product_info: "Material: 100% Virgin Wool\nLining: 100% Cotton with check pattern\nClosure: Double-breasted with epaulettes\nBelt: Removable self-tie waist belt\nPockets: 2 deep side pockets, 1 interior pocket\nLength: Below-knee\nFit: Classic\nOrigin: London, England\nSeason: Autumn / Winter / Spring",
        reviews: [
            { author: "Oliver B.", rating: 5, text: "The quintessential trench — elevated. The wool quality is exceptional and the belt details are gorgeous." },
            { author: "Emma S.", rating: 5, text: "Bought this for myself and I'm obsessed. Fits beautifully and keeps me dry in London rain." },
            { author: "Hiroshi T.", rating: 5, text: "Incredible craftsmanship. The midnight color is versatile and timeless." },
            { author: "Anna P.", rating: 4, text: "Lovely coat, slightly heavy but that's expected with virgin wool. Great investment piece." }
        ],
        product_care: "Dry clean only. Do not machine wash or tumble dry. Hang to air out after each wear. Store with cedar blocks to prevent moths. Spot treat rain marks by brushing gently once dry."
    },
    {
        name: "Ivory Shearling Jacket",
        price: 680,
        image_url: "img/products/img-6.jpg",
        category: "coats",
        description: "Luxurious warmth meets haute couture in this ivory shearling jacket. The genuine Spanish merino shearling interior provides unparalleled insulation, while the suede exterior delivers a velvety soft finish.",
        product_info: "Material: Genuine Spanish Merino Shearling\nExterior: Premium Suede\nClosure: Asymmetric zip with snap collar\nPockets: 2 zip pockets, 1 interior pocket\nLength: Hip-length\nFit: Relaxed\nOrigin: Crafted in Barcelona, Spain\nSeason: Winter",
        reviews: [
            { author: "Isabella F.", rating: 5, text: "This is the warmest and most beautiful jacket I've ever owned. The shearling is incredibly plush." },
            { author: "Lucas D.", rating: 5, text: "A statement piece. I receive compliments every single time I wear it." },
            { author: "Sarah M.", rating: 4, text: "Gorgeous jacket, the ivory color is stunning. Just be careful with light colors and stains." }
        ],
        product_care: "Professional leather and suede cleaning only. Avoid water exposure. Store in a cool, dry place away from direct heat. Use a suede brush to maintain the nap. Apply suede protector spray before first wear."
    },

    // ===== BAGS (4 products) =====
    {
        name: "Premium Leather Bag",
        price: 250,
        image_url: "img/products/img-3.jpg",
        category: "bags",
        oldId: 3,
        description: "A structured leather bag that embodies timeless elegance. Crafted from full-grain Italian leather with hand-burnished edges, this bag develops a beautiful patina over time.",
        product_info: "Material: Full-Grain Italian Vegetable-Tanned Leather\nHardware: Solid Brass with antique finish\nLining: Cotton twill\nCompartments: Main compartment, 2 interior slip pockets, 1 zip pocket\nClosure: Magnetic snap\nStrap: Adjustable cross-body strap\nDimensions: 12\" × 9\" × 4\"\nOrigin: Florence, Italy",
        reviews: [
            { author: "Charlotte H.", rating: 5, text: "The leather quality is absolutely divine. It smells amazing and feels incredibly supple." },
            { author: "Thomas G.", rating: 5, text: "A perfect everyday bag. Holds everything I need and looks better with age." },
            { author: "Maria L.", rating: 4, text: "Beautiful bag, excellent craftsmanship. Wish it had one more exterior pocket." }
        ],
        product_care: "Condition with leather cream every 3-6 months. Avoid prolonged water exposure. Store stuffed with tissue paper to maintain shape. Keep away from direct sunlight to prevent fading. Clean with a soft, damp cloth."
    },
    {
        name: "Executive Briefcase",
        price: 485,
        image_url: "img/products/img-7.jpg",
        category: "bags",
        description: "Command authority with this handcrafted executive briefcase in deep cognac leather. Features a padded laptop compartment, organizer panel, and twin combination locks for security.",
        product_info: "Material: Premium Cognac Leather (Vegetable-tanned)\nHardware: Gunmetal with combination locks\nLining: Burgundy microsuede\nCompartments: Padded 15\" laptop slot, document section, organizer panel\nClosure: Twin combination locks + zip\nHandle: Rolled leather handle\nDimensions: 16\" × 12\" × 5\"\nOrigin: Florence, Italy",
        reviews: [
            { author: "William C.", rating: 5, text: "This briefcase exudes professionalism. My colleagues keep asking where I got it." },
            { author: "Jennifer K.", rating: 5, text: "Bought for my partner — the leather is spectacular and the locks add great security." },
            { author: "Daniel M.", rating: 5, text: "Perfect for carrying a laptop and documents. The organizer is incredibly useful." },
            { author: "Patricia A.", rating: 4, text: "Substantial weight but that's the price of real leather. Gorgeous piece." }
        ],
        product_care: "Apply leather conditioner quarterly. Wipe with a dry cloth after each use. Store upright in a dust bag. Avoid overstuffing to maintain structure. Polish hardware with a soft cloth."
    },
    {
        name: "Artisan Crossbody Satchel",
        price: 195,
        image_url: "img/products/img-8.jpg",
        category: "bags",
        description: "A compact yet stylish crossbody satchel designed for the urban explorer. Hand-stitched from pebble-grain leather with contrasting edge paint and antique brass fittings.",
        product_info: "Material: Pebble-Grain Calfskin Leather\nHardware: Antique Brass\nLining: Canvas with logo print\nCompartments: 2 main sections, 1 zip pocket, 2 card slots\nClosure: Flap with magnetic snap\nStrap: Adjustable leather crossbody strap\nDimensions: 9\" × 7\" × 3\"\nOrigin: Handmade in Portugal",
        reviews: [
            { author: "Emily R.", rating: 5, text: "Perfect size for everyday essentials. The pebble grain leather is gorgeous and durable." },
            { author: "Noah H.", rating: 4, text: "Great little bag. Fits my phone, wallet, keys and a small notebook perfectly." },
            { author: "Sophie W.", rating: 5, text: "I love the vintage feel of the brass hardware. This bag is a work of art." }
        ],
        product_care: "Clean with a damp microfiber cloth. Apply leather balm every 4-6 months. Avoid contact with perfumes or chemicals. Store in the provided dust bag when not in use. Keep away from extreme heat."
    },
    {
        name: "Noir Weekend Duffle",
        price: 395,
        image_url: "img/products/img-9.jpg",
        category: "bags",
        description: "Travel in style with this noir weekend duffle, crafted from waterproof Italian nylon with full-grain leather trim. Spacious enough for a 3-day trip, with dedicated compartments for shoes and toiletries.",
        product_info: "Material: Waterproof Italian Ballistic Nylon + Full-Grain Leather trim\nHardware: Matte Black Zinc Alloy\nLining: Nylon with antimicrobial coating\nCompartments: Main compartment, shoe compartment, 2 zip pockets, toiletry section\nClosure: Heavy-duty YKK zipper\nHandles: Rolled leather + Detachable shoulder strap\nDimensions: 22\" × 11\" × 12\"\nOrigin: Milan, Italy",
        reviews: [
            { author: "Robert J.", rating: 5, text: "The perfect weekend bag. The shoe compartment is genius and the nylon is truly waterproof." },
            { author: "Amanda T.", rating: 5, text: "Took this on a weekend getaway — fits everything beautifully and looks incredibly chic." },
            { author: "Carlos M.", rating: 4, text: "High quality construction. The leather accents elevate the overall look." }
        ],
        product_care: "Wipe nylon with a damp cloth. Condition leather trim seasonally. Machine wash not recommended. Air dry after use in humid conditions. Store unfolded to prevent creasing."
    },

    // ===== SHOES (4 products) =====
    {
        name: "Oxford Dress Shoes",
        price: 180,
        image_url: "img/products/img-4.jpg",
        category: "shoes",
        oldId: 4,
        description: "Classic Oxford dress shoes in burnished black calfskin with a Goodyear welted sole. The hallmark of gentlemanly refinement, featuring a closed-lace construction and subtle broguing on the toe cap.",
        product_info: "Material: Burnished Calfskin Leather\nSole: Goodyear Welted Leather Sole with rubber heel\nConstruction: Blake-stitched for flexibility\nInsole: Full leather cushioned insole\nLace: Waxed cotton laces\nLast: Classic round-toe\nOrigin: Handcrafted in Northampton, England\nAvailable Sizes: EU 39-46",
        reviews: [
            { author: "Andrew P.", rating: 5, text: "The finest dress shoes I've ever owned. The Goodyear welt means they'll last for decades." },
            { author: "Mark S.", rating: 5, text: "Perfectly balanced formality. Comfortable from day one — no break-in period needed." },
            { author: "Kevin L.", rating: 4, text: "Beautiful shoes, true to size. The burnished leather has a wonderful depth of color." }
        ],
        product_care: "Polish with quality shoe cream after every 3-4 wears. Use cedar shoe trees when not in use. Rotate with other shoes to allow drying. Apply waterproof wax before wet weather. Re-sole through our cobbler service when needed."
    },
    {
        name: "Monaco Suede Loafers",
        price: 245,
        image_url: "img/products/img-10.jpg",
        category: "shoes",
        description: "Effortless Italian elegance in these Monaco suede loafers. Crafted from butter-soft suede with hand-stitched moccasin construction and a flexible Blake-stitched sole for all-day comfort.",
        product_info: "Material: Italian Suede (Water-resistant treated)\nSole: Leather with rubber insert\nConstruction: Hand-stitched Moccasin\nInsole: Memory foam cushion with leather cover\nDetail: Penny strap with gold-tone keeper\nLast: Elegant elongated toe\nOrigin: Made in Tuscany, Italy\nAvailable Sizes: EU 39-46",
        reviews: [
            { author: "Francesco B.", rating: 5, text: "These loafers are the definition of la dolce vita. Incredibly comfortable and stylish." },
            { author: "George T.", rating: 5, text: "My go-to shoe for smart casual occasions. The suede quality is top-notch." },
            { author: "Diana K.", rating: 5, text: "Bought for my husband — he wears them almost every day now. That comfortable." },
            { author: "Ryan A.", rating: 4, text: "Beautiful shoes. The water-resistant treatment actually works. Highly recommend." }
        ],
        product_care: "Brush with a suede brush after each wear. Apply suede protector spray every 2 weeks. Store with shoe trees in a dust bag. Treat rain stains by letting dry naturally then brushing. Avoid wearing in heavy rain."
    },
    {
        name: "Heritage Chelsea Boots",
        price: 320,
        image_url: "img/products/img-11.jpg",
        category: "shoes",
        description: "Rugged sophistication in these heritage Chelsea boots. Built from hand-waxed leather with a chunky Vibram sole, pull tabs, and elastic gore panels for easy on/off. Designed to age beautifully.",
        product_info: "Material: Hand-Waxed Full-Grain Leather\nSole: Vibram® Lug Sole\nConstruction: Goodyear Welted\nGore: Heavy-duty elastic side panels\nPull Tab: Woven fabric with embossed logo\nInsole: Ortholite® cushioned insole\nOrigin: Handcrafted in León, Spain\nAvailable Sizes: EU 39-46",
        reviews: [
            { author: "Sebastian M.", rating: 5, text: "These boots are built like tanks but look absolutely stunning. The waxed leather is gorgeous." },
            { author: "Clara R.", rating: 5, text: "Perfect for autumn walks and city adventures. The Vibram sole grips on everything." },
            { author: "Paul N.", rating: 5, text: "After 6 months of wear, the patina is incredible. These boots just get better with time." }
        ],
        product_care: "Apply dubbin or leather wax every month. Clean with a horsehair brush. Condition with mink oil for extra water resistance. Store with cedar shoe trees. Re-wax at the start of each winter season."
    },
    {
        name: "Luxe Italian Sneakers",
        price: 275,
        image_url: "img/products/img-12.jpg",
        category: "shoes",
        description: "Minimalist luxury sneakers crafted from premium Italian nappa leather with a handmade margom sole. The clean silhouette and tonal stitching make these the perfect bridge between casual and refined.",
        product_info: "Material: Premium Italian Nappa Leather\nSole: Margom® rubber sole (made in Italy)\nConstruction: Hand-lasted and cemented\nInsole: Leather-covered memory foam\nLining: Full calfskin leather\nDetail: Embossed logo on heel counter\nOrigin: Marche region, Italy\nAvailable Sizes: EU 39-46",
        reviews: [
            { author: "Liam O.", rating: 5, text: "The most comfortable luxury sneakers I've found. The nappa leather is buttery soft from day one." },
            { author: "Mia J.", rating: 5, text: "Clean, minimal, and incredibly well-made. These replaced all my other white sneakers." },
            { author: "Alex C.", rating: 4, text: "Great quality for the price. The Margom sole is the gold standard in luxury sneakers." },
            { author: "Nina E.", rating: 5, text: "I've owned these for a year and they still look brand new with minimal care." }
        ],
        product_care: "Wipe with a damp cloth after each wear. Apply leather conditioner monthly. Use a magic eraser on the sole edges to keep them white. Store with shoe trees. Avoid machine washing."
    },

    // ===== ACCESSORIES (4 products) =====
    {
        name: "Chronograph Leather Watch",
        price: 450,
        image_url: "img/products/img-13.jpg",
        category: "accessories",
        description: "A refined chronograph timepiece with a Swiss Ronda quartz movement, sapphire crystal glass, and a hand-stitched alligator-embossed leather strap. 42mm case in brushed stainless steel.",
        product_info: "Movement: Swiss Ronda 5021.D Quartz Chronograph\nCase: 42mm Brushed Stainless Steel\nCrystal: Sapphire with anti-reflective coating\nWater Resistance: 50 meters / 5 ATM\nStrap: Alligator-embossed Italian Leather, 22mm\nDial: Matte Black with luminous indices\nFunctions: Hours, Minutes, Seconds, Chronograph, Date\nWarranty: 2-year international warranty",
        reviews: [
            { author: "Henry W.", rating: 5, text: "A stunning timepiece at this price point. The sapphire crystal and Swiss movement are premium touches." },
            { author: "Victoria N.", rating: 5, text: "Bought as a gift and it was a huge hit. The packaging alone makes it feel special." },
            { author: "Jason L.", rating: 5, text: "Keeps perfect time and the chronograph function is smooth. The strap is incredibly comfortable." },
            { author: "Rebecca D.", rating: 4, text: "Beautiful watch. The only reason for 4 stars is I wish the strap had quick-release pins." }
        ],
        product_care: "Avoid contact with water beyond splash resistance. Wipe crystal with a microfiber cloth. Service movement every 3-5 years. Replace battery at an authorized service center. Store in the provided watch box when not worn."
    },
    {
        name: "Silk Pocket Square Set",
        price: 85,
        image_url: "img/products/img-14.jpg",
        category: "accessories",
        description: "A curated set of three hand-rolled silk pocket squares in versatile colorways — midnight navy, burgundy, and champagne. Each piece features hand-stitched edges and a subtle jacquard weave.",
        product_info: "Material: 100% Mulberry Silk (19 momme weight)\nSize: 13\" × 13\" each\nEdge: Hand-rolled and hand-stitched\nPattern: Subtle Jacquard micro-pattern\nSet Includes: 3 pocket squares (Navy, Burgundy, Champagne)\nPackaging: Gift box with magnetic closure\nOrigin: Como, Italy",
        reviews: [
            { author: "Philip S.", rating: 5, text: "The quality of the silk is extraordinary — you can feel the difference immediately." },
            { author: "Alexandra M.", rating: 5, text: "Perfect gift for the well-dressed gentleman. The colors are versatile and elegant." },
            { author: "Theodore R.", rating: 5, text: "Hand-rolled edges are a sign of true quality. These rival pocket squares costing 3x more." }
        ],
        product_care: "Dry clean or hand wash in cold water with silk-safe detergent. Do not wring — press gently between towels. Iron on silk setting with a pressing cloth. Roll rather than fold for storage to prevent permanent creases."
    },
    {
        name: "Italian Leather Belt",
        price: 135,
        image_url: "img/products/img-15.jpg",
        category: "accessories",
        description: "A timeless Italian leather belt featuring a solid brass buckle with brushed satin finish. The full-grain bridle leather is vegetable-tanned for months to achieve a deep, rich color and exceptional durability.",
        product_info: "Material: Full-Grain Bridle Leather (Vegetable-tanned)\nBuckle: Solid Brass with Brushed Satin Finish\nWidth: 1.25\" (32mm)\nEdge: Burnished and waxed\nHoles: 5 punch holes at 1\" intervals\nSizing: Cut to fit — includes instructions\nOrigin: Tuscany, Italy\nAvailable Sizes: 30-44",
        reviews: [
            { author: "Marcus G.", rating: 5, text: "This belt will outlast me. The bridle leather is stiff at first but breaks in beautifully." },
            { author: "Catherine B.", rating: 5, text: "Bought for my son's graduation. The brass buckle is weighty and substantial — real quality." },
            { author: "Derek P.", rating: 5, text: "I've had this for 2 years and the patina is stunning. Gets better with every wear." },
            { author: "Julia H.", rating: 4, text: "Excellent belt. Runs slightly long — measure carefully and use the cut-to-fit guide." }
        ],
        product_care: "Condition with leather balm every 6 months. Avoid getting wet — if it does, dry naturally away from heat. Store hanging or rolled. Rotate with other belts for longevity. Polish the buckle with a soft cloth."
    },
    {
        name: "Cashmere Scarf",
        price: 165,
        image_url: "img/products/img-5.jpg",
        category: "accessories",
        description: "Pure Mongolian cashmere spun into an impossibly soft scarf with a subtle herringbone weave. Generously sized for wrapping, draping, or wearing as a travel blanket. A year-round essential for those who value luxury.",
        product_info: "Material: 100% Grade-A Mongolian Cashmere\nWeight: Ultra-light (2-ply)\nSize: 78\" × 28\" (generous oversized)\nPattern: Herringbone weave\nFringe: Hand-knotted 3\" fringe\nColor: Charcoal Grey\nPackaging: Luxury gift box\nOrigin: Inner Mongolia, processed in Scotland",
        reviews: [
            { author: "Elizabeth W.", rating: 5, text: "The softest thing I've ever felt. I use it as a scarf, a wrap, and even a travel blanket." },
            { author: "Jonathan P.", rating: 5, text: "Grade-A cashmere makes all the difference. This is noticeably softer than other 'cashmere' products." },
            { author: "Claire F.", rating: 5, text: "Bought two — one for me and one as a gift. Both recipients are thrilled." },
            { author: "Andrew K.", rating: 4, text: "Beautiful scarf but requires careful washing. Follow the care instructions exactly." }
        ],
        product_care: "Hand wash in lukewarm water with cashmere shampoo. Never wring — roll in a towel to remove excess water. Lay flat to dry. Store folded with cedar blocks. Use a cashmere comb to remove pilling."
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        // Remove existing products
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        // Insert new products
        const result = await Product.insertMany(products);
        console.log(`Inserted ${result.length} products successfully!`);

        // Display summary
        const categories = {};
        result.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });
        console.log('Products per category:', categories);

        await mongoose.disconnect();
        console.log('Done!');
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
