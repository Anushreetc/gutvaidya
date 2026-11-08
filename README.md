# GutVaidya — warm ivory reference redesign

Latest reference: WhatsApp Video 2026-10-29 at 10.44.21 PM.mp4.
This revision replaces the prior dark green cinematic landing with the latest reference's warm ivory, caramel and muted gold direction.

## Implemented
- Large sculpted powder-bowl illustration, gentle scroll rotation/parallax and ingredient annotations.
- Product spotlight using your actual Diet Powder pouch; large background typography.
- Three illustrated preparation cards. Copy refers to actual pack quantities and cooking directions.
- Interactive millets/seeds/herbs/spices tabs with animated bowl changes and keyboard navigation.
- Caramel editorial cards with your supplied daily ritual product photograph and the six manufacturing steps.
- Existing catalogue, cart, checkout, account/admin, reviews, recipes, FAQ and contact sections retained.
- No embedded video. No new libraries required. Reduced-motion treatment included.

The hero bowl is a CSS illustration, not a photograph of the product. The preparation cards are original SVG illustrations. This adapts the reference's visual structure to GutVaidya; an exact visual match has not been browser-verified.

## Install into existing project
Base repository: Anushreetc/gutvaidya at c9d77354bb1932735bbacdd90bced0c4fe4a3f5c.
1. Back up your project or create a branch.
2. Merge BOTH src and public folders from this ZIP into your project root.
3. Replace the homepage file only if you have no newer edits. Otherwise import ReferenceLanding and render it before ProofBand, preserving the existing remaining sections. Remove prior CinematicStory/ManufacturingJourney usage from the homepage.
4. Run npm ci, npm run build, npm run dev. Open http://localhost:3000.
5. Check desktop and mobile layout, ingredient tabs (including arrow keys), scroll motion, product links, cart and checkout.
6. Push your branch and review the Vercel preview before production deployment.
Old cinematic components may remain unused in your project. Any process.mp4/process-poster.jpg from an earlier version can be deleted; this version does not use them.

## Verification and limits
Production build and TypeScript compilation passed after clearing an invalid Next.js build cache. Referenced assets exist; git diff --check passed. Browser visual and interactive testing remains pending because the managed preview service supplied unsupported Next.js startup arguments. No checkout/payment/authentication transactions were tested. GitHub write access previously returned HTTP 403; nothing has been pushed or deployed. The live site is unchanged.


## October 30: simplified homepage and consistent theme
Removed the older ProofBand, IngredientsSection, ComparisonSection, RecipesSection and BlogsSection from homepage rendering; their source files are retained. Kept the reference landing, products, reviews, FAQ, contact and footer. Navigation now points to the new blend and preparation sections; footer home link fixed.

Shared Tailwind color tokens now use ivory, caramel, warm brown and muted gold throughout the storefront, navigation, cart, footer, product pages and account/admin pages. Hardcoded dark-green product surfaces and checkout branding were updated. Semantic status colors and third-party brand colors remain meaningful.

The old public/product.jpeg label is replaced with the supplied cream-and-green Diet Powder pouch photograph. The preparation instructions now match the uploaded back label: 1 scoop (25 g), 400 ml water/milk, low flame for 2 minutes, continuous stirring, optional jaggery or salt, serve comfortably warm. Updated homepage cards, FAQ, product-details steps, seed product and local data/products.json. Product gallery uses the actual pack back and daily-ritual photo.

IMPORTANT: This ZIP now includes shared styles, other page/component changes, public/product.jpeg, src/lib/products.ts and data/products.json. Merge files carefully if your project has newer changes. Do not overwrite a newer custom catalogue with data/products.json; merge only the matching gutvaidya-health-mix record. Live Supabase/admin product overrides may supersede the bundled seed/local product copy and must be checked in the deployed environment. No live database was changed.

Final validation: standard npm run build passed with TypeScript and 35 static pages; git diff --check and homepage navigation-anchor checks passed. Browser visual verification and deployment remain pending.
