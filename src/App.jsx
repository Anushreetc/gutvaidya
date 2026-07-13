import { Link } from 'react-router-dom'
import './App.css'

const benefits = [
  {
    title: 'Handpicked Goodness',
    text: 'Pure, natural ingredients selected with care for your family’s everyday wellness.',
  },
  {
    title: 'Nourished & Loved',
    text: 'A wholesome blend made to support immunity, gut health, and steady energy.',
  },
  {
    title: 'Energy in Every Sip',
    text: 'Two spoons daily can bring a simple, nourishing rhythm to your routine.',
  },
]

const recipes = [
  { title: 'Health Mix Drink', text: 'A quick, tasty blend for your morning routine.' },
  { title: 'Health Mix Dosa', text: 'Healthy, crispy, and perfect for a comforting meal.' },
  { title: 'Health Mix Ladoo', text: 'A sweet treat made with traditional goodness and balance.' },
]

function App() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="brand">GutVaidya</div>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#ingredients">Ingredients</a>
          <a href="#recipes">Recipes</a>
          <a href="#story">Our Story</a>
          <a href="#contact">Contact</a>
        </nav>
        <Link className="header-btn" to="/cart">
          View Cart
        </Link>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Good Food = Good Health</p>
            <h1>Nature’s best 36+ ingredients in every scoop.</h1>
            <p className="hero-text">
              GutVaidya Health Mix nourishes your body with improved immunity, gut health,
              and energy with just two spoons every day.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#contact">
                Shop GutVaidya
              </a>
              <a className="btn btn-secondary" href="#ingredients">
                Explore Ingredients
              </a>
            </div>
            <div className="proof">Trusted by 1,00,000+ happy families</div>
          </div>

          <div className="hero-visual">
            <img
              src="https://www.aurawill.in/cdn/shop/files/008-Product_Image_v1_with_badge_copy.webp?v=1778826178&width=823"
              alt="GutVaidya Health Mix product"
            />
          </div>
        </section>

        <section className="trust-strip">
          <div>
            <strong>4.8/5</strong>
            <span>Community rating</span>
          </div>
          <div>
            <strong>36+</strong>
            <span>Handpicked ingredients</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Traditional care</span>
          </div>
        </section>

        <section id="ingredients" className="benefits-section">
          <div className="section-heading">
            <p className="eyebrow">Why Our Community Chooses Us</p>
            <h2>Why to choose GutVaidya</h2>
          </div>
          <div className="card-grid">
            {benefits.map((item) => (
              <article key={item.title} className="info-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="recipes" className="recipes-section">
          <div className="section-heading">
            <p className="eyebrow">Tasty, Healthy, Easy</p>
            <h2>Simple recipes for everyday wellness</h2>
          </div>
          <div className="card-grid recipes-grid">
            {recipes.map((item) => (
              <article key={item.title} className="recipe-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="story" className="story-section">
          <div className="story-copy">
            <p className="eyebrow">Our Story</p>
            <h2>Rooted in tradition, crafted for modern families.</h2>
            <p>
              GutVaidya brings together time-tested wisdom and wholesome nutrition in one
              honest blend. Every scoop is made with care, transparency, and the belief that
              healthy food can be simple, natural, and delicious.
            </p>
          </div>
          <div className="story-visual">
            <img
              src="https://www.aurawill.in/cdn/shop/files/White-label.png?v=1741582343&width=200"
              alt="GutVaidya brand illustration"
            />
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div>
          <h2>Contact Us</h2>
          <p>support@gutvaidya.in</p>
          <p>+91 90250 67516</p>
        </div>
        <a className="btn btn-primary" href="mailto:support@gutvaidya.in">
          Get in Touch
        </a>
      </footer>
    </div>
  )
}

export default App
