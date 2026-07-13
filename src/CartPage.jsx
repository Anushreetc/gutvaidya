import { Link } from 'react-router-dom'
import './App.css'

const cartItems = [
  {
    name: 'GutVaidya Health Mix',
    qty: 1,
    price: '₹720',
    note: 'Improves immunity, gut health, and daily energy.',
  },
  {
    name: 'GutVaidya Ladoo',
    qty: 2,
    price: '₹540',
    note: 'A delicious, balanced wellness sweet.',
  },
]

function CartPage() {
  const subtotal = '₹1,260'

  return (
    <div className="page-shell cart-page">
      <header className="site-header">
        <Link className="brand" to="/">
          GutVaidya
        </Link>
        <Link className="header-btn" to="/">
          Continue Shopping
        </Link>
      </header>

      <main className="cart-layout">
        <section className="cart-items">
          <h1>Your Cart</h1>
          {cartItems.map((item) => (
            <div key={item.name} className="cart-card">
              <div>
                <h3>{item.name}</h3>
                <p>{item.note}</p>
              </div>
              <div className="cart-meta">
                <span>Qty: {item.qty}</span>
                <strong>{item.price}</strong>
              </div>
            </div>
          ))}
        </section>

        <aside className="summary-card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{subtotal}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>{subtotal}</strong>
          </div>
          <a className="btn btn-primary full-width" href="mailto:support@gutvaidya.in">
            Checkout
          </a>
        </aside>
      </main>
    </div>
  )
}

export default CartPage
