import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu, X, ArrowRight, ArrowUpRight, Award, Factory, Truck, Users2,
  Hammer, ShieldCheck, PackageSearch, Globe2, Mountain, Scissors, Sparkle,
  ClipboardCheck, Boxes as BoxesIcon, Send, Mail, MapPin, Phone, Facebook,
  Instagram, Linkedin, IndianRupee, Clock, Timer, Wallet, LayoutList,
  ChevronLeft, ChevronRight, Star, TrendingUp, Trophy, Play, Quote,
  BadgeCheck,
} from 'lucide-react'
import Chatbot from '../components/Chatbot.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import { products, categories, categoryImages } from '../data/products.js'
import './Home.css'

/* ----------------------------------------------------------------
   Data — copy ported from the previous homepage (all facts, prices
   and routes preserved) but shaped for the new showroom layout.
   ---------------------------------------------------------------- */

const heroKeys = ['wall-tiles', 'bathroom-tiles', 'kitchen-tiles', 'floor-tiles', 'outdoor-tiles', 'granite-slabs', 'marble-collection']
const heroTaglines = {
  'wall-tiles': 'Interior feature walls, cast in high-gloss and textured finishes.',
  'bathroom-tiles': 'Anti-skid, wet-area tile engineered for daily safety.',
  'kitchen-tiles': 'Stain- and heat-resistant surfaces for working kitchens.',
  'floor-tiles': 'Vitrified and ceramic flooring built for decades of footfall.',
  'outdoor-tiles': 'Frost- and weather-proof tile for decks, courtyards and pool decks.',
  'granite-slabs': 'Quarry-cut Indian granite, gang-sawn and mirror polished.',
  'marble-collection': 'Imported and domestic marble for monuments and luxury interiors.',
}
const hiRes = (key) => (categoryImages[key] || '').replace('w=900', 'w=1800')
const heroSlides = heroKeys.map((key) => ({
  key,
  label: categories.find((c) => c.key === key)?.label,
  tagline: heroTaglines[key],
  img: hiRes(key),
}))

const collectionOrder = [
  { key: 'wall-tiles', desc: 'High-gloss and textured tile for feature walls and interior cladding.', tall: true },
  { key: 'bathroom-tiles', desc: 'Anti-skid, water-resistant tile engineered for wet-area safety.' },
  { key: 'kitchen-tiles', desc: 'Stain and heat resistant tile for countertops and kitchen floors.' },
  { key: 'floor-tiles', desc: 'Durable vitrified and ceramic tile for living rooms and commercial floors.', tall: true },
  { key: 'outdoor-tiles', desc: 'Weather and frost resistant tile for courtyards and pool decks.' },
  { key: 'granite-slabs', desc: 'Premium Indian granite slabs for countertops, flooring and cladding.', tall: true },
  { key: 'marble-collection', desc: 'Classic and imported marble slabs for luxury interiors and monuments.' },
  { key: 'parking-tiles', desc: 'Heavy-duty, load-bearing tile built for driveways and parking bays.' },
  { key: 'vitrified-tiles', desc: 'Full-body vitrified tile, including realistic marble-look finishes.' },
  { key: 'ceramic-tiles', desc: 'Economical, uniform-finish ceramic tile for walls and light-use floors.' },
].map((c) => ({ ...c, label: categories.find((cat) => cat.key === c.key)?.label, img: categoryImages[c.key] }))

const featuredProducts = products.filter((p) => ['granite-02', 'granite-01', 'floor-01', 'outdoor-02'].includes(p.id))
const trendingProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 6)
const bestSellers = [...products].sort((a, b) => b.stock - a.stock).slice(0, 6)

const whyChooseUs = [
  { icon: Award, title: 'Uncompromising Quality', desc: 'Every slab and tile batch is inspected for consistency, finish and durability before it leaves the plant.' },
  { icon: Timer, title: 'Fast, Reliable Delivery', desc: 'A dedicated logistics fleet and export packaging team keep dispatch times short and damage rates near zero.' },
  { icon: Wallet, title: 'Transparent Pricing', desc: 'Direct quarry sourcing and in-house production keep per sq.ft pricing competitive without compromising quality.' },
  { icon: LayoutList, title: 'A Large, Varied Range', desc: 'Ten product categories spanning tile and natural stone, in dozens of colours, sizes and finishes.' },
]

const stats = [
  { value: '27+', label: 'Years of craftsmanship' },
  { value: '4', label: 'Manufacturing units' },
  { value: '1.2M+', label: 'Sq. ft. delivered / year' },
  { value: '19', label: 'Countries exported to' },
]

const services = [
  { icon: Mountain, title: 'Quarry Sourcing', desc: 'Direct-sourced raw granite and marble blocks from certified quarry partners across India.' },
  { icon: Scissors, title: 'Precision Cutting', desc: 'Gang-saw and CNC bridge cutting for accurate slab thickness and minimal wastage.' },
  { icon: Sparkle, title: 'Polishing & Finishing', desc: 'Mirror, honed and leathered finishes tailored to residential and commercial projects.' },
  { icon: BadgeCheck, title: 'Tile Manufacturing', desc: 'Ceramic, vitrified and mosaic tile production lines with consistent batch quality.' },
  { icon: Truck, title: 'Export & Logistics', desc: 'Crating, containerisation and freight coordination for domestic and export orders.' },
  { icon: ShieldCheck, title: 'Quality Assurance', desc: 'Multi-stage inspection for slab integrity, colour matching and surface tolerance.' },
]

const process = [
  { step: '01', title: 'Quarry Extraction', desc: 'Raw blocks are extracted and graded at partner quarries.' },
  { step: '02', title: 'Block Cutting', desc: 'Gang saws slice blocks into slabs of precise thickness.' },
  { step: '03', title: 'Polishing', desc: 'Automated lines bring out natural colour and shine.' },
  { step: '04', title: 'Quality Check', desc: 'Every slab is inspected for cracks and colour match.' },
  { step: '05', title: 'Packaging', desc: 'Slabs are bundled onto A-frames with protective padding.' },
  { step: '06', title: 'Dispatch', desc: 'Orders route to domestic sites or export containers.' },
]

const testimonials = [
  { name: 'Vikram Mehta', role: 'Director, Sri Lakshmi Builders', quote: 'Consistent slab quality and on-time dispatch have made them our default granite partner for every project.' },
  { name: 'Fatima Al-Sayed', role: 'Procurement Lead, Al Fahad Stone Trading', quote: 'Their export packaging and documentation are meticulous — zero transit damage across four container shipments.' },
  { name: 'Nandini Rao', role: 'Principal Architect, Studio Terra', quote: 'The tile finishing quality lets us specify their product with full confidence on high-end interior projects.' },
]

const swatches = [
  { name: 'Tan Brown', c1: '#8a5a34', c2: '#5c3a1f' },
  { name: 'Black Galaxy', c1: '#2b2b2b', c2: '#0e0e0e' },
  { name: 'Kashmir White', c1: '#e9e2d2', c2: '#c9bfa5' },
  { name: 'Steel Grey', c1: '#8a8f92', c2: '#5b6063' },
  { name: 'Ivory Ceramic', c1: '#efe6d3', c2: '#d8c9a8' },
  { name: 'Terracotta Wall', c1: '#c1663a', c2: '#8f4526' },
]

const awards = [
  { icon: Award, title: 'ISO 9001:2015 Certified', year: 'Since 2016' },
  { icon: ShieldCheck, title: 'BIS Quality Mark', year: 'Since 2018' },
  { icon: Trophy, title: 'State Export Excellence Award', year: '2022' },
  { icon: BadgeCheck, title: 'Green Manufacturing Compliance', year: '2023' },
]

/* ---------------------------------------------------------------- */

function BrandMark({ light = true }) {
  const stroke = light ? '#ede7d8' : '#14120f'
  return (
    <svg viewBox="0 0 40 40" className="sr-mark" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="32" height="32" transform="rotate(45 20 20)" fill="none" stroke="#9c7a46" strokeWidth="1.4" />
      <path d="M20 4 L20 36" stroke={stroke} strokeWidth="1.1" opacity="0.5" />
      <path d="M9 13 L31 27" stroke="#9c7a46" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="2.4" fill="#9c7a46" />
    </svg>
  )
}

function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll('.sr-reveal')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' })
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function CountUpStat({ value, label }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState('0')
  const hasAnimated = useRef(false)

  useEffect(() => {
    const match = String(value).match(/^([\d.]+)(.*)$/)
    const numeric = match ? parseFloat(match[1]) : 0
    const suffix = match ? match[2] : ''
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const duration = 1300
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = numeric * eased
          setDisplay((Number.isInteger(numeric) ? Math.round(current) : current.toFixed(1)) + suffix)
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div className="sr-stat sr-reveal" ref={ref}>
      <div className="sr-stat-value">{display}</div>
      <div className="sr-stat-label">{label}</div>
    </div>
  )
}

function VideoShowcase() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className="sr-video-frame" onClick={() => setOpen(true)} aria-label="Play factory walkthrough">
        <img src={hiRes('granite-slabs')} alt="Granite polishing floor" loading="lazy" />
        <span className="sr-play"><Play size={22} fill="currentColor" /></span>
        <span className="sr-video-caption">Factory Walkthrough — Demo Preview</span>
      </button>
      {open && (
        <div className="pd-modal-backdrop" onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(20,18,15,.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#f6f2e9', maxWidth: 440, padding: '40px 34px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ position: 'absolute', top: 14, right: 14, color: '#2a2620' }}><X size={18} /></button>
            <Play size={30} color="#9c7a46" style={{ marginBottom: 14 }} />
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, marginBottom: 10, color: '#14120f' }}>Factory Walkthrough</h3>
            <p style={{ color: '#67604f', fontSize: 13.5, lineHeight: 1.7 }}>
              This is a demo project without a hosted video file — in a production build,
              this would embed a real factory walkthrough showing block cutting, polishing
              lines and the tile press floor.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function HeroSlider() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 5000)
    return () => clearInterval(timerRef.current)
  }, [])

  const goTo = useCallback((i) => {
    clearInterval(timerRef.current)
    setIndex(i)
    timerRef.current = setInterval(() => setIndex((cur) => (cur + 1) % heroSlides.length), 5000)
  }, [])
  const prev = () => goTo((index - 1 + heroSlides.length) % heroSlides.length)
  const next = () => goTo((index + 1) % heroSlides.length)
  const slide = heroSlides[index]

  return (
    <div className="sr-hero-visual">
      {heroSlides.map((s, i) => (
        <div key={s.key} className={`sr-hero-slide ${i === index ? 'active' : ''}`}>
          <img src={s.img} alt={s.label} loading={i === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}
      <div className="sr-placard">
        <div className="sr-placard-label">{String(index + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')} — Now Viewing</div>
        <h3>{slide.label}</h3>
        <Link to={`/product-catalog?category=${slide.key}`}>Explore range <ArrowUpRight size={13} /></Link>
      </div>
      <div className="sr-hero-nav">
        <div className="sr-hero-dots">
          {heroSlides.map((s, i) => (
            <button key={s.key} className={`sr-hero-dot ${i === index ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`View ${s.label}`} />
          ))}
        </div>
        <div className="sr-hero-arrows">
          <button className="sr-hero-arrow" onClick={prev} aria-label="Previous"><ChevronLeft size={16} /></button>
          <button className="sr-hero-arrow" onClick={next} aria-label="Next"><ChevronRight size={16} /></button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useRevealOnScroll()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="showroom">
      {/* ---------- Nav ---------- */}
      <header className={`sr-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="sr-wrap sr-nav-inner">
          <Link to="/" className="sr-brand">
            <BrandMark />
            <span className="sr-brand-word">Est. 1998<b>Granite &amp; Tile</b></span>
          </Link>
          <nav className={`sr-nav-links ${navOpen ? 'open' : ''}`}>
            <a href="#collection" onClick={() => setNavOpen(false)}>Collection</a>
            <a href="#services" onClick={() => setNavOpen(false)}>Services</a>
            <a href="#process" onClick={() => setNavOpen(false)}>Process</a>
            <a href="#testimonials" onClick={() => setNavOpen(false)}>Testimonials</a>
            <a href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
            <LanguageSwitcher className="sr-lang" />
            <Link to="/login" className="sr-btn sr-btn-line" onClick={() => setNavOpen(false)}>Sign In</Link>
          </nav>
          <div className="sr-nav-cta">
            <Link to="/dashboard" className="sr-btn sr-btn-bronze" onClick={() => setNavOpen(false)}>Client Portal</Link>
            <button className="sr-nav-burger" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle menu">
              {navOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="sr-hero">
        <div className="sr-hero-grid">
          <div className="sr-hero-copy">
            <div className="sr-hero-kicker"><span style={{ width: 6, height: 6, background: '#c9a968', display: 'inline-block' }} />Chennai, India · Since 1998</div>
            <h1 className="sr-hero-title">Stone cut with <em>precision.</em> Tile finished with <em>intent.</em></h1>
            <p>
              GraniteX runs a full quarry-to-showroom operation — sourcing raw stone, cutting and
              polishing slabs, producing ceramic tile, and delivering across India and 19 export
              markets. Every surface below is drawn from our own production floor.
            </p>
            <div className="sr-hero-actions">
              <Link to="/dashboard" className="sr-btn sr-btn-bronze">Enter Management System <ArrowRight size={15} /></Link>
              <a href="#collection" className="sr-btn sr-btn-line">View the Collection</a>
            </div>
            <div className="sr-hero-cert"><ShieldCheck size={18} color="#c9a968" /><span><b>ISO 9001:2015</b> certified manufacturing across all four units</span></div>
          </div>
          <HeroSlider />
        </div>
        <div className="sr-hero-scroll"><span>Scroll</span><span className="sr-hero-scroll-bar" /></div>
      </section>

      {/* ---------- Marquee ---------- */}
      <div className="sr-marquee">
        <div className="sr-marquee-track">
          {[...Array(2)].map((_, r) => (
            <div key={r} style={{ display: 'flex' }}>
              {heroSlides.map((s) => (
                <span className="sr-marquee-item" key={r + s.key}><b>{s.label}</b><span className="sr-marquee-dot" /></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Stats ---------- */}
      <section className="sr-stats">
        <div className="sr-wrap sr-stats-row">
          {stats.map((s) => <CountUpStat key={s.label} value={s.value} label={s.label} />)}
        </div>
      </section>

      {/* ---------- Who we are ---------- */}
      <section className="sr-intro">
        <div className="sr-wrap sr-intro-grid">
          <div className="sr-intro-media sr-reveal">
            <img src={hiRes('marble-collection')} alt="Marble slab yard" loading="lazy" />
            <div className="sr-intro-stat"><b>130+</b><span>Skilled workforce on the production floor</span></div>
          </div>
          <div className="sr-intro-copy sr-reveal">
            <div className="sr-eyebrow">Who We Are</div>
            <h2 className="sr-title">Built on stone,<br />run on process.</h2>
            <p>
              What began as a single gang-saw unit in 1998 has grown into a four-facility operation
              spanning block cutting, polishing, tile pressing and export packaging. Every slab that
              leaves our yard passes through the same disciplined workflow — sourced material,
              tracked production, inspected output, and a delivery record you can trace end to end.
            </p>
            <p>
              This platform is that workflow, digitised: masters for people and products, transactions
              for every order and dispatch, and reports that tell the plant manager exactly where
              revenue, stock and machine time are going.
            </p>
            <div className="sr-badges">
              <span className="sr-badge"><Hammer size={13} /> ISO 9001:2015 Certified</span>
              <span className="sr-badge"><Users2 size={13} /> 130+ Skilled Workforce</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Why choose us ---------- */}
      <section className="sr-why">
        <div className="sr-wrap">
          <div className="sr-why-grid sr-reveal">
            {whyChooseUs.map((w) => {
              const Icon = w.icon
              return (
                <div className="sr-why-card" key={w.title}>
                  <div className="sr-why-icon"><Icon size={22} /></div>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- Collection mosaic ---------- */}
      <section className="sr-collection" id="collection">
        <div className="sr-wrap">
          <div className="sr-head sr-reveal">
            <div className="sr-eyebrow">The Collection</div>
            <h2 className="sr-title">Ten categories, <em>one quality standard.</em></h2>
            <p className="sr-sub">Every surface is manufactured in-house and racked here exactly as it appears on our showroom floor.</p>
          </div>
        </div>
        <div className="sr-wrap">
          <div className="sr-collection-mosaic">
            {collectionOrder.map((c, i) => (
              <Link to={`/product-catalog?category=${c.key}`} className={`sr-tile sr-reveal ${c.tall ? 'tall' : ''}`} key={c.key} style={{ transitionDelay: `${(i % 4) * 0.06}s` }}>
                <img src={c.img} alt={c.label} loading="lazy" />
                <div className="sr-tile-plate">
                  <div className="sr-tile-num">{String(i + 1).padStart(2, '0')}</div>
                  <h3>{c.label}</h3>
                  <p>{c.desc}</p>
                  <span className="sr-tile-link">Explore range <ArrowUpRight size={13} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Featured products ---------- */}
      <section className="sr-featured" id="featured">
        <div className="sr-wrap">
          <div className="sr-head sr-reveal">
            <div className="sr-eyebrow">Featured Products</div>
            <h2 className="sr-title">Our most requested <em>slabs &amp; tile.</em></h2>
          </div>
          <div className="sr-featured-grid sr-reveal">
            {featuredProducts.map((p) => (
              <Link to={`/product-catalog/${p.id}`} className="sr-pcard" key={p.id}>
                <div className="sr-pcard-img"><img src={categoryImages[p.category]} alt={p.name} loading="lazy" /></div>
                <div className="sr-pcard-body">
                  <div className="sr-pcard-cat">{categories.find((c) => c.key === p.category)?.label}</div>
                  <h4>{p.name}</h4>
                  <div className="sr-pcard-meta">
                    <span className="sr-pcard-price"><IndianRupee size={12} style={{ verticalAlign: -1 }} />{p.price} / {p.unit}</span>
                    <span className="sr-pcard-link">View <ArrowRight size={12} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="sr-featured-more"><Link to="/product-catalog" className="sr-btn sr-btn-line-dark">Browse Full Catalog <ArrowRight size={15} /></Link></div>
        </div>
      </section>

      {/* ---------- Trending ---------- */}
      <section className="sr-strip">
        <div className="sr-wrap">
          <div className="sr-head sr-reveal" style={{ marginBottom: 34 }}>
            <div className="sr-eyebrow">Trending Now</div>
            <h2 className="sr-title" style={{ fontSize: 'clamp(26px,3.2vw,36px)' }}>What customers are viewing most.</h2>
          </div>
          <div className="sr-strip-scroll sr-reveal">
            {trendingProducts.map((p) => (
              <Link to={`/product-catalog/${p.id}`} className="sr-strip-card" key={p.id}>
                <span className="sr-strip-tag"><TrendingUp size={11} /> Trending</span>
                <div className="sr-strip-img"><img src={categoryImages[p.category]} alt={p.name} loading="lazy" /></div>
                <div className="sr-strip-body">
                  <h4>{p.name}</h4>
                  <div className="sr-strip-meta">
                    <span className="sr-strip-rating"><Star size={11} fill="currentColor" /> {p.rating.toFixed(1)}</span>
                    <span><IndianRupee size={11} style={{ verticalAlign: -1 }} />{p.price}/{p.unit}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Best sellers ---------- */}
      <section className="sr-strip" style={{ paddingTop: 0 }}>
        <div className="sr-wrap">
          <div className="sr-head sr-reveal" style={{ marginBottom: 34 }}>
            <div className="sr-eyebrow">Best Sellers</div>
            <h2 className="sr-title" style={{ fontSize: 'clamp(26px,3.2vw,36px)' }}>Our highest-moving stock.</h2>
          </div>
          <div className="sr-strip-scroll sr-reveal">
            {bestSellers.map((p) => (
              <Link to={`/product-catalog/${p.id}`} className="sr-strip-card" key={p.id}>
                <span className="sr-strip-tag gold"><Trophy size={11} /> Best Seller</span>
                <div className="sr-strip-img"><img src={categoryImages[p.category]} alt={p.name} loading="lazy" /></div>
                <div className="sr-strip-body">
                  <h4>{p.name}</h4>
                  <div className="sr-strip-meta">
                    <span className="sr-strip-rating"><Star size={11} fill="currentColor" /> {p.rating.toFixed(1)}</span>
                    <span><IndianRupee size={11} style={{ verticalAlign: -1 }} />{p.price}/{p.unit}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="sr-services" id="services">
        <div className="sr-wrap">
          <div className="sr-head sr-reveal">
            <div className="sr-eyebrow on-dark">What We Do</div>
            <h2 className="sr-title on-dark">Quarry to showroom, <em>in six services.</em></h2>
          </div>
        </div>
        <div className="sr-wrap">
          <div className="sr-services-grid sr-reveal">
            {services.map((s, i) => {
              const Icon = s.icon
              return (
                <div className="sr-service" key={s.title}>
                  <div className="sr-service-num">{String(i + 1).padStart(2, '0')}</div>
                  <Icon size={22} color="#c9a968" style={{ marginTop: 14 }} />
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- Material palette ---------- */}
      <section className="sr-palette" id="gallery">
        <div className="sr-wrap">
          <div className="sr-head sr-reveal">
            <div className="sr-eyebrow">Product Gallery</div>
            <h2 className="sr-title">A sample of our <em>stone &amp; tile finishes.</em></h2>
          </div>
          <div className="sr-palette-row sr-reveal">
            {swatches.map((s) => (
              <div className="sr-swatch" key={s.name}>
                <div className="sr-swatch-block" style={{ background: `linear-gradient(135deg, ${s.c1}, ${s.c2})` }} />
                <div className="sr-swatch-name">{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="sr-process" id="process">
        <div className="sr-wrap">
          <div className="sr-head sr-reveal">
            <div className="sr-eyebrow">Manufacturing Process</div>
            <h2 className="sr-title">From raw block <em>to finished slab.</em></h2>
          </div>
          <div className="sr-process-line sr-reveal">
            <div className="sr-process-steps">
              {process.map((p) => (
                <div className="sr-pstep" key={p.step}>
                  <div className="sr-pstep-num">{p.step}</div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Video ---------- */}
      <section className="sr-video" id="video">
        <div className="sr-wrap">
          <div className="sr-head sr-reveal">
            <div className="sr-eyebrow">See It In Action</div>
            <h2 className="sr-title">A walk through <em>our production floor.</em></h2>
          </div>
          <div className="sr-reveal"><VideoShowcase /></div>
        </div>
      </section>

      {/* ---------- Awards ---------- */}
      <section className="sr-awards">
        <div className="sr-wrap">
          <div className="sr-head sr-reveal" style={{ marginBottom: 34 }}>
            <div className="sr-eyebrow">Recognised Quality</div>
            <h2 className="sr-title" style={{ fontSize: 'clamp(26px,3.2vw,36px)' }}>Awards &amp; certifications.</h2>
          </div>
          <div className="sr-awards-row sr-reveal">
            {awards.map((a) => {
              const Icon = a.icon
              return (
                <div className="sr-award" key={a.title}>
                  <Icon size={22} className="sr-award-icon" />
                  <div><h4>{a.title}</h4><span>{a.year}</span></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="sr-testi" id="testimonials">
        <div className="sr-wrap">
          <div className="sr-head sr-reveal">
            <div className="sr-eyebrow on-dark">Client Feedback</div>
            <h2 className="sr-title on-dark">Trusted by builders, <em>architects &amp; traders.</em></h2>
          </div>
        </div>
        <div className="sr-wrap">
          <div className="sr-testi-grid sr-reveal">
            {testimonials.map((t) => (
              <div className="sr-testi-card" key={t.name}>
                <Quote size={20} color="#9c7a46" />
                <p className="sr-testi-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="sr-testi-person">
                  <div className="sr-testi-avatar">{t.name.split(' ').map((n) => n[0]).join('')}</div>
                  <div>
                    <div className="sr-testi-name">{t.name}</div>
                    <div className="sr-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section className="sr-contact" id="contact">
        <div className="sr-wrap sr-contact-grid">
          <div className="sr-reveal">
            <div className="sr-eyebrow">Get in Touch</div>
            <h2 className="sr-title">Talk to our sales <em>&amp; production team.</em></h2>
            <p className="sr-sub">Have a project in mind or need a bulk quotation for granite slabs or tile? Send us your requirements and our team will respond within one business day.</p>
            <div className="sr-contact-info">
              <div className="sr-contact-row"><MapPin size={16} /> SIDCO Industrial Estate, Chennai, Tamil Nadu</div>
              <div className="sr-contact-row"><Phone size={16} /> +91 44 2345 6789</div>
              <div className="sr-contact-row"><Mail size={16} /> info@granitex-mms.com</div>
              <div className="sr-contact-row"><Clock size={16} /> Mon – Sat, 9:00 AM – 6:30 PM</div>
            </div>
            <div className="sr-map">
              <div className="sr-map-pin"><MapPin size={26} fill="#9c7a46" color="#6e5530" /></div>
              <span className="sr-map-label">SIDCO Industrial Estate, Chennai</span>
            </div>
          </div>

          <form className="sr-form sr-reveal" onSubmit={(e) => e.preventDefault()}>
            <div className="sr-form-row">
              <div className="sr-field"><label>Full Name</label><input type="text" placeholder="Your name" /></div>
              <div className="sr-field"><label>Phone Number</label><input type="tel" placeholder="+91 98xxx xxxxx" /></div>
            </div>
            <div className="sr-field"><label>Email</label><input type="email" placeholder="you@example.com" /></div>
            <div className="sr-field">
              <label>Requirement</label>
              <textarea rows={4} placeholder="Tell us what you're looking for — product, quantity, project location..." />
            </div>
            <button type="submit" className="sr-btn sr-btn-solid"><Send size={15} /> Send Enquiry</button>
          </form>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="sr-cta">
        <div className="sr-wrap sr-cta-inner">
          <div>
            <h2>Run the plant <em>from one dashboard.</em></h2>
            <p>Masters, transactions and reports — all in one management system.</p>
          </div>
          <Link to="/dashboard" className="sr-btn sr-btn-bronze">Enter Management System <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="sr-footer">
        <div className="sr-wrap sr-footer-top">
          <div>
            <div className="sr-footer-brand"><BrandMark /><span className="sr-footer-word">Granite &amp; Tile</span></div>
            <p className="sr-footer-desc">Quarry-to-showroom granite and tile manufacturing, managed end to end.</p>
            <div className="sr-footer-social">
              <a href="#" aria-label="Facebook"><Facebook size={15} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={15} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={15} /></a>
            </div>
          </div>
          <div>
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#featured">Featured Products</a></li>
              <li><a href="#process">Manufacturing Process</a></li>
              <li><Link to="/product-catalog">Product Catalog</Link></li>
            </ul>
          </div>
          <div>
            <h5>Modules</h5>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/product-master">Product Master</Link></li>
              <li><Link to="/sales-order">Sales Orders</Link></li>
              <li><Link to="/report-center">Reports</Link></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul className="sr-footer-contact">
              <li><MapPin size={13} /> SIDCO Industrial Estate, Chennai, TN</li>
              <li><Phone size={13} /> +91 44 2345 6789</li>
              <li><Mail size={13} /> info@granitex-mms.com</li>
            </ul>
          </div>
        </div>
        <div className="sr-footer-bottom">© 2026 Granite &amp; Tile Manufacturing Management System. Academic MWT Project.</div>
      </footer>

      <Chatbot />
    </div>
  )
}
