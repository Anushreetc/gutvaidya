-- =========================================================
-- Gut Vaidya E-Commerce Seed Data (Categories, Products, Coupons)
-- =========================================================

-- 1. Insert Categories
insert into public.categories (id, name, slug, description, image) values
('c1111111-1111-1111-1111-111111111111', 'Wellness Mixes', 'wellness-mixes', 'Signature daily sprouted grain & prebiotic herbal formulations.', '/product.jpeg'),
('c2222222-2222-2222-2222-222222222222', 'Nutritional Care', 'nutritional-care', 'Targeted wholesome nutritional blends for energy and recovery.', '/product.jpeg'),
('c3333333-3333-3333-3333-333333333333', 'Specialty Blends', 'specialty-blends', 'Ayurvedic formulations for metabolic balance, sugar regulation, and detox.', '/product.jpeg')
on conflict (slug) do nothing;

-- 2. Insert Products
insert into public.products (
    id, name, slug, short_description, description, price, compare_at_price, sku, stock_quantity,
    category_id, main_image, status, featured, benefits, ingredients, usage_instructions, weight_size, badge
) values
(
    'p1111111-1111-1111-1111-111111111111',
    'GutVaidya Health Mix',
    'gutvaidya-health-mix',
    'Contains handpicked traditional grains, millets, nuts, and natural herbs for daily immunity, gut health, and steady energy levels.',
    'GutVaidya Health Mix is crafted with over 36 sprouted grains, ancient millets, organic nuts, and sacred Ayurvedic herbs. Prepared following centuries-old tradition, this nutrient-dense mix is easy to digest, supports gut microbiome balance, soothes acidity, and provides sustained natural energy for the entire family without any artificial sweeteners or chemical preservatives.',
    799.00,
    999.00,
    'GV-HM-500',
    120,
    'c1111111-1111-1111-1111-111111111111',
    '/product.jpeg',
    'active',
    true,
    '["36+ Sprouted Natural Ingredients", "Zero Added Sugar & No Preservatives", "Rich in Prebiotic Fiber", "Deep Gut & Immunity Support", "Gentle on Sensitive Stomachs"]'::jsonb,
    'Sprouted Ragi, Foxtail Millet, Little Millet, Kodo Millet, Barnyard Millet, Sprouted Green Gram, Almonds, Walnuts, Pistachios, Cardamom, Dry Ginger, Shatavari, Licorice, Ashwagandha.',
    'Take 2 tablespoons (approx. 30g) of GutVaidya Health Mix. Mix with 250ml water or milk until smooth. Cook on medium flame for 3 to 5 minutes while stirring continuously. Add jaggery or honey to taste if desired. Enjoy warm as a wholesome breakfast.',
    '500g',
    'Bestseller'
),
(
    'p2222222-2222-2222-2222-222222222222',
    'GutVaidya Baal Vit',
    'gutvaidya-baal-vit',
    'Delicious, nutrient-dense wellness energy formulation specially balanced for growing children and youth.',
    'GutVaidya Baal Vit is formulated to support childhood growth, sharp cognitive development, bone strength, and strong natural immunity. Made with sprouted grains, organic dry fruits, and brain-supporting herbs like Brahmi and Shankhpushpi, it transforms daily milk into a powerhouse of natural bioavailable nutrition.',
    899.00,
    1099.00,
    'GV-BV-500',
    85,
    'c2222222-2222-2222-2222-222222222222',
    '/product.jpeg',
    'active',
    true,
    '["Rich in Natural Bioavailable Calcium & Iron", "Supports Cognitive Focus & Memory", "Strengthens Bones & Immunity", "100% Kid-Approved Natural Taste"]'::jsonb,
    'Sprouted Ragi, Whole Green Gram, Almonds, Cashews, Brahmi, Shankhpushpi, Saffron, Green Cardamom, Sprouted Barley.',
    'Mix 1-2 spoons in a glass of warm milk. Whisk thoroughly and serve in the morning or after sports.',
    '500g',
    'Kids Favorite'
),
(
    'p3333333-3333-3333-3333-333333333333',
    'GutVaidya Sampoora',
    'gutvaidya-sampoora',
    'Complete senior wellness and vitality nutrition for holistic daily strength and digestive ease.',
    'Formulated specifically for senior adults and individuals recovering from illness. Sampoora offers complete easily absorbable plant nutrition with joint-nourishing minerals, restorative Ayurvedic roots, and calming digestive seeds.',
    899.00,
    1099.00,
    'GV-SP-500',
    60,
    'c1111111-1111-1111-1111-111111111111',
    '/product.jpeg',
    'active',
    false,
    '["Ease on Digestion & Nutrient Absorption", "Supports Joint Flexibility", "Restores Daily Vitality & Stamina", "Natural Anti-inflammatory Compounds"]'::jsonb,
    'Sprouted Foxtail Millet, Sesame Seeds, Flax Seeds, Turmeric (Curcumin 3%), Dry Ginger, Ashwagandha, Methi (Fenugreek), Ajwain.',
    'Stir 2 spoons into warm water, buttermilk, or soup broth. Consume once daily after lunch or dinner.',
    '500g',
    'Popular'
),
(
    'p4444444-4444-4444-4444-444444444444',
    'GutVaidya Yuva Ojiva',
    'gutvaidya-yuva-ojiva',
    'High-vitality active lifestyle protein and adaptogen blend for working professionals and athletes.',
    'Packed with natural plant proteins, sprouted pulses, and revitalizing herbs, Yuva Ojiva fuels active days without stomach heaviness, bloating, or synthetic isolates. It promotes clean muscle recovery and balances stress cortisol.',
    899.00,
    1149.00,
    'GV-YO-500',
    75,
    'c2222222-2222-2222-2222-222222222222',
    '/product.jpeg',
    'active',
    true,
    '["100% Plant-Powered Protein", "Adaptogenic Stress Relief", "No Bloating or Heavy Fillers", "Clean Sustained Stamina"]'::jsonb,
    'Sprouted Moong, Roasted Bengal Gram, Chia Seeds, Pumpkin Seeds, Moringa Leaf, Safed Musli, Gokshura, Raw Cacao.',
    'Blend 2 scoops into your morning smoothie, almond milk, or warm water. Ideal post-workout or as a high-protein breakfast.',
    '500g',
    'Trending'
),
(
    'p5555555-5555-5555-5555-555555555555',
    'GutVaidya Proliva',
    'gutvaidya-proliva',
    'Liver detox and natural bile support blend promoting cellular gut-liver axis cleansing.',
    'The gut and liver work hand in hand. Proliva brings together classic hepatic herbs that stimulate gentle detoxification, enhance digestive fire (Agni), and protect liver tissue against oxidative stress.',
    899.00,
    1099.00,
    'GV-PL-500',
    50,
    'c3333333-3333-3333-3333-333333333333',
    '/product.jpeg',
    'active',
    false,
    '["Deep Liver Detox & Regeneration", "Promotes Healthy Bile Flow", "Relieves Chronic Sluggish Digestion", "Rich in Natural Antioxidants"]'::jsonb,
    'Bhumyamalaki, Kalmegh, Milk Thistle Seed, Punarnava, Kutki, Sprouted Horsegram, Cumin, Fennel.',
    'Take 1 teaspoon in lukewarm water first thing in the morning on an empty stomach.',
    '500g',
    'New Release'
),
(
    'p6666666-6666-6666-6666-666666666666',
    'GutVaidya Gluco Care',
    'gutvaidya-gluco-care',
    'Low-glycemic metabolic formula with bitter melon, jamun seeds, and soluble prebiotic fibers.',
    'Specifically tailored for individuals looking to maintain healthy blood glucose levels and insulin sensitivity naturally. Formulated with low-GI millets and potent glycemic-balancing herbs.',
    899.00,
    1199.00,
    'GV-GC-500',
    90,
    'c3333333-3333-3333-3333-333333333333',
    '/product.jpeg',
    'active',
    true,
    '["Supports Balanced Blood Sugar Levels", "Curbs Unhealthy Sugar Cravings", "Ultra Low Glycemic Index (<35)", "High Soluble Fiber Matrix"]'::jsonb,
    'Sprouted Barnyard Millet, Jamun Seed Powder, Karela (Bitter Gourd), Fenugreek Seeds, Vijaysar Bark, Gurmar (Gymnema Sylvestre), Cinnamon.',
    'Take 2 spoons stirred into warm water 15 minutes before breakfast and dinner.',
    '500g',
    'Recommended'
),
(
    'p7777777-7777-7777-7777-777777777777',
    'GutVaidya Fat Trim',
    'gutvaidya-fat-trim',
    'Thermogentic Ayurvedic metabolism booster designed to assist healthy weight management and gut transit.',
    'Fat Trim combines gentle thermogenic spices with detoxifying Triphala and sprouted grains to enhance resting metabolism, flush excess water weight, and maintain regular healthy bowel movements.',
    899.00,
    1199.00,
    'GV-FT-500',
    65,
    'c3333333-3333-3333-3333-333333333333',
    '/product.jpeg',
    'active',
    false,
    '["Stimulates Healthy Metabolic Rate", "Aids Natural Fat Metabolism", "Triphala-Enhanced Colon Cleanse", "Reduces Water Retention & Bloat"]'::jsonb,
    'Sprouted Horsegram, Triphala (Amalaki, Bibhitaki, Haritaki), Guggulu, Black Pepper, Long Pepper (Pippali), Ginger, Garcinia Cambogia, Green Tea Extract.',
    'Mix 1 tablespoon in warm water with a squeeze of fresh lemon juice, twice daily before meals.',
    '500g',
    'New Release'
)
on conflict (slug) do update set
    price = excluded.price,
    compare_at_price = excluded.compare_at_price,
    stock_quantity = excluded.stock_quantity,
    description = excluded.description,
    benefits = excluded.benefits;

-- 3. Insert Initial Active Coupons
insert into public.coupons (
    code, discount_type, discount_value, minimum_order_value, maximum_discount, usage_limit, active
) values
('GUTHEALTH10', 'percentage', 10.00, 500.00, 200.00, 1000, true),
('WELCOME50', 'fixed', 50.00, 499.00, 50.00, 500, true),
('FESTIVE100', 'fixed', 100.00, 1200.00, 100.00, 200, true)
on conflict (code) do nothing;
