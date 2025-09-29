import ContactForm from '../components/ContactForm';

export default function Home() {
return (
<main style={{ padding: 24 }}>
<section style={{ padding: '48px 0' }}>
<h1 style={{ fontSize: 42, marginBottom: 8 }}>Horsepower Electrical</h1>
<p>Reliable residential & light commercial electricians in Brisbane.</p>
</section>

<section id="services" style={{ padding: '16px 0' }}>
<h2>Services</h2>
<ul>
<li>Power points & lighting</li>
<li>Switchboard upgrades</li>
<li>EV chargers</li>
<li>Ceiling fans & smoke alarms</li>
</ul>
</section>

<section id="about" style={{ padding: '16px 0' }}>
<h2>About</h2>
<p>Locally owned. Licensed & insured. Upfront quotes.</p>
</section>

<section id="contact" style={{ padding: '16px 0' }}>
<h2>Contact</h2>
<ContactForm />
</section>
</main>
);
}