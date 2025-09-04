import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Camera, ShieldCheck, Target, Smartphone, Wrench, Clock, Cog, Cpu, Mail, Phone, MapPin, ArrowDown, Linkedin, Twitter, Facebook, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

export default function Index() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enableDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", enableDark);
    setIsDark(enableDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.15 }
    );

    const els = document.querySelectorAll<HTMLElement>(".reveal");
    els.forEach((el) => observer.observe(el));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = heroRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const h = rect.height || 1;
        const progress = Math.min(1, Math.max(0, -rect.top / h));
        const parallax = progress * 160; // px
        const zoom = 1 + progress * 0.08; // slight zoom
        const blur = progress * 1.5; // px
        const overlay = 0.55 + progress * 0.25; // opacity 0.55 -> 0.8
        el.style.setProperty("--hero-parallax", parallax.toFixed(2) + "px");
        el.style.setProperty("--hero-zoom", zoom.toFixed(3));
        el.style.setProperty("--hero-blur", blur.toFixed(2) + "px");
        el.style.setProperty("--hero-overlay", overlay.toFixed(2));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") || "").toString();
    toast.success(`Thanks${name ? ", " + name : ""}! We'll reach out shortly.`);
    form.reset();
  };

  return (
    <div className="min-h-screen text-foreground">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/70 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-white/10">
            <a href="#" className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <Camera className="h-5 w-5" />
              </span>
              <span className="text-base font-extrabold tracking-tight text-foreground">Sentinel Vision</span>
            </a>
            <nav className="hidden items-center gap-6 md:flex">
              <a href="#mission" className="text-sm font-medium text-foreground/80 hover:text-primary">Mission</a>
              <a href="#products" className="text-sm font-medium text-foreground/80 hover:text-primary">Products</a>
              <a href="#services" className="text-sm font-medium text-foreground/80 hover:text-primary">Services</a>
              <a href="#contact" className="text-sm font-medium text-foreground/80 hover:text-primary">Contact</a>
            </nav>
            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/40 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white/60 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <a href="#contact" className="btn-primary">Get a Free Consultation</a>
            </div>
            <div className="md:hidden inline-flex items-center gap-2">
              <button
                type="button"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/40 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white/60 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <a href="#contact" className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg">Consult</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative flex min-h-[100dvh] items-center overflow-hidden pt-28 text-white" style={{"--hero-parallax":"0px"} as CSSProperties}>
        {/* Background image with parallax */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: "url(https://source.unsplash.com/2400x1400/?security,camera)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: "translateY(var(--hero-parallax)) scale(var(--hero-zoom))",
              filter: "blur(var(--hero-blur))",
              transition: "transform 0.05s linear",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / var(--hero-overlay, 0.7)), hsl(var(--brand-ink)))",
            }}
          />
        </div>

        {/* Subtle pattern overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(1000px 400px at 60% -10%, rgba(255,255,255,0.15), rgba(255,255,255,0)), radial-gradient(600px 300px at 10% 30%, rgba(255,255,255,0.12), rgba(255,255,255,0))",
            }}
          />
          <div
            className="absolute inset-0 bg-[length:32px_32px] opacity-10"
            style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.15) 1px, transparent 1px)" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="reveal">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Enterprise-Grade Protection
              </p>
              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Your Safety, Our Priority
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg text-white/80">
                We deliver cutting-edge surveillance solutions with uncompromising reliability. From smart IP systems to 24/7 monitoring, our experts protect what matters most.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#contact" className="btn-primary">Get a Free Consultation</a>
                <a href="#products" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                  Explore Products <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="reveal md:justify-self-end">
              <div className="glass relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl border border-white/15">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                <div className="absolute -right-12 top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-40 w-40 text-white/80" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-4 text-sm text-white/90 backdrop-blur">
                  4K Smart IP Camera • Night Vision • Motion Detection
                </div>
              </div>
            </div>
          </div>

          <div className="reveal mt-16 flex items-center justify-center">
            <a href="#mission" className="group inline-flex flex-col items-center text-white/80">
              <span className="text-xs">Scroll</span>
              <ArrowDown className="mt-2 h-6 w-6 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Mission & Vision</h2>
            <p className="mt-3 text-muted-foreground">Built on trust, driven by innovation.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="reveal rounded-2xl border bg-card p-8 shadow-soft transition hover:shadow-xl">
              <ShieldCheck className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-2xl font-semibold text-foreground">Our Mission</h3>
              <p className="mt-2 text-muted-foreground">
                To provide <span className="text-foreground font-semibold">reliable</span> and <span className="text-foreground font-semibold">scalable</span> security systems that safeguard homes and businesses, ensuring peace of mind through proactive monitoring and expert support.
              </p>
            </div>
            <div className="reveal rounded-2xl border bg-card p-8 shadow-soft transition hover:shadow-xl">
              <Target className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-2xl font-semibold text-foreground">Our Vision</h3>
              <p className="mt-2 text-muted-foreground">
                Empower communities with <span className="text-foreground font-semibold">intelligent</span> surveillance, leveraging <span className="text-foreground font-semibold">AI-driven</span> insights to create safer, smarter environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Camera Products</h2>
            <p className="mt-3 text-muted-foreground">Professional-grade hardware for every scenario.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "CCTV Camera", desc: "High-durability analog systems for wide-area coverage." },
              { title: "Dome Camera", desc: "Discreet and tamper-resistant for indoor environments." },
              { title: "IP Camera", desc: "Smart, network-connected with remote access and analytics." },
              { title: "Wireless Camera", desc: "Flexible installation with secure cloud connectivity." },
            ].map((p, i) => (
              <article key={i} className="reveal group rounded-2xl border bg-card p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-tr from-primary/10 to-primary/5 p-6">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  <Camera className="h-16 w-16 text-primary/80" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Services</h2>
            <p className="mt-3 text-muted-foreground">End-to-end solutions tailored to your needs.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wrench, title: "Installation", desc: "Certified technicians ensure seamless setup and calibration." },
              { icon: Clock, title: "24/7 Monitoring", desc: "Always-on vigilance with rapid response protocols." },
              { icon: Cog, title: "Maintenance", desc: "Proactive upkeep and on-demand repairs to prevent downtime." },
              { icon: Cpu, title: "Smart Integrations", desc: "Connect with alarms, access control, and home automation." },
            ].map((s, i) => (
              <article key={i} className="reveal group rounded-2xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Contact Us</h2>
            <p className="mt-3 text-muted-foreground">Speak with a security specialist today.</p>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="reveal rounded-2xl border bg-card p-6 shadow-soft">
              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
                  <input name="name" required className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none ring-primary/0 transition focus:ring-2" placeholder="Jane Doe" />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                  <input type="email" name="email" required className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none ring-primary/0 transition focus:ring-2" placeholder="jane@company.com" />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-foreground">Phone</label>
                  <input type="tel" name="phone" className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none ring-primary/0 transition focus:ring-2" placeholder="(555) 123-4567" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
                  <textarea name="message" rows={4} className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none ring-primary/0 transition focus:ring-2" placeholder="Tell us about your project..." />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4" /> Secure & confidential
                  </div>
                  <button type="submit" className="btn-primary">Send Message</button>
                </div>
              </form>
            </div>
            <div className="reveal space-y-6">
              <div className="rounded-2xl border bg-card p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-foreground">Get in touch</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Head Office</p>
                      <p className="text-sm text-muted-foreground">123 Secure Ave, Suite 400, New York, NY</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">(555) 987-6543</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">hello@sentinelvision.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border shadow-soft">
                <iframe
                  title="Company location"
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=D%C3%B6rtyol,+Hatay,+Turkey&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-[hsl(var(--brand-ink))] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                <Camera className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold">Sentinel Vision</span>
            </div>
            <p className="text-center text-sm text-white/70 sm:text-left">© {new Date().getFullYear()} Sentinel Vision. All rights reserved.</p>
            <div className="flex items-center gap-3 text-white/80">
              <a href="#" aria-label="LinkedIn" className="rounded-lg p-2 hover:bg-white/10"><Linkedin className="h-5 w-5" /></a>
              <a href="#" aria-label="Twitter" className="rounded-lg p-2 hover:bg-white/10"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="Facebook" className="rounded-lg p-2 hover:bg-white/10"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
