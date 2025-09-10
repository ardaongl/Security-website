import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Camera, ShieldCheck, Target, Smartphone, Wrench, Clock, Cog, Cpu, Mail, Phone, MapPin, ArrowDown, Linkedin, Twitter, Facebook, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import logoPng from "../../images/logo.png";
import ahdImg from "../../images/AHD-Cam.jpg";
import tviImg from "../../images/TVI-Cam.jpg";
import ipImg from "../../images/IP-Cam.jpg";
import cviImg from "../../images/CVI-Cam.avif";
import kablosuzImg from "../../images/Kablosuz-Cam.jpg";

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    const name = (payload.name || "").toString();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || `Request failed with ${res.status}`);
      }

      toast.success(`Teşekkürler${name ? ", " + name : ""}! Mesajınız iletildi.`);
      form.reset();
    } catch (err: any) {
      console.error("Contact form error", err);
      toast.error("Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.");
    }
  };

  return (
    <div className="min-h-screen text-foreground">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/70 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-white/10">
            <a href="#" className="flex items-center gap-2">
              <img src={logoPng} alt="Sentinel Vision logo" className="h-11 w-11 rounded-xl object-contain shadow-md" />
              <span className="text-base font-extrabold tracking-tight text-foreground">ER GÜVENLİK</span>
            </a>
            <nav className="hidden items-center gap-6 md:flex">
              <a href="#mission" className="text-sm font-medium text-foreground/80 hover:text-primary">Misyonumuz</a>
              <a href="#products" className="text-sm font-medium text-foreground/80 hover:text-primary">Ürünlerimiz</a>
              <a href="#services" className="text-sm font-medium text-foreground/80 hover:text-primary">Hizmetlerimiz</a>
              <a href="#contact" className="text-sm font-medium text-foreground/80 hover:text-primary">İletişim</a>
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
                <ShieldCheck className="h-3.5 w-3.5" /> Kurumsal Düzeyde Koruma
              </p>
              <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Güvenliğiniz, Önceliğimizdir
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg text-white/80">
              Hayatınızı ve işinizi korumak için ileri seviye güvenlik sistemleri sunuyoruz. Uzman ekibimiz 7 gün 24 saat kesintisiz hizmetinizde.              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#products" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Ürünleri Keşfedin <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
            
          </div>

          <div className="reveal mt-16 flex items-center justify-center">
            <a href="#mission" className="group inline-flex flex-col items-center text-white/80">
              <span className="text-xs">Kaydır</span>
              <ArrowDown className="mt-2 h-6 w-6 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Misyon & Vizyon</h2>
            <p className="mt-3 text-muted-foreground">Güven üzerine kurulmuş bir yol.</p>
          </div>
          <div className="mt-10 space-y-6">
            <div className="reveal rounded-2xl border bg-card p-8 shadow-soft transition hover:shadow-xl">
              <div className="flex items-start gap-6 md:gap-8">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-semibold text-foreground">Vizyonumuz</h3>
                  <p className="mt-3 text-muted-foreground">
                    Biz geleceğin güvenlik anlayışını bu gün inşa ediyoruz: Yapay zeka ve akıllı otomasyon sistemlerini entegre ederek, riskleri anında algılayan ve önleyici çözümler üreten teknolojileri geliştirmek, Alarım Kamera sistemlerini sadece koruma amaçlı değil, aynı zamanda yaşam ve iş güvenliğini arttıran akıllı bir alt yapı haline getirmek. Müşteri deneyimini her şeyin üzerinde tutarak; hızlı şeffaf ve güvenilir hizmet anlayışını sektörün değişmez standardı haline getirmek. Sürekli gelişim ve Ar-Ge yatırımları ile güvenlik teknolojilerinde global ölçekte "öncü" ve "yenilikçi" bir marka konumuna ulaşmak. Bizim vizyonumuz: sadece bir güvenlik firması olmak değil, "güvenin geleceğini tasarlayan bir teknoloji markası" olmaktır. Öyle ki, bizimle çalışan herkes için güvenlik artık bir endişe konusu değil, günlük yaşam doğal ve görünmez bir parçası olacaktır.
                  </p>
                </div>
              </div>
            </div>
            <div className="reveal rounded-2xl border bg-card p-8 shadow-soft transition hover:shadow-xl">
              <div className="flex items-start gap-6 md:gap-8">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-semibold text-foreground">Misyonumuz</h3>
                  <p className="mt-3 text-muted-foreground">
                  Biz; insanların, işletmelerinin ve kurumların güvenliğini en üst seviyeye taşımak için çalışıyoruz. Kurulduğumuz günden bu yana hedefimiz; elektronik güvenlik ve ses sistemlerinde en ileri teknolojiyi, en yüksek kalite standartlarıyla bir araya getirerek müşterilerimizin sadece güvenliğini değil, aynı zamanda huzurunu da garanti altına almak oldu. Her projede; doğru ihtiyaç analizi, profesyonel kurulum ve kesintisiz teknik destek ile güvenliğin bir ayrıcalık değil, herkesin hakkı olduğunu savunuyoruz. Yenilikçi çözümlerimizle; hırsızlık, yangın, acil durum gibi risklere karşı koruma sağlamakla kalmıyor, iş yerlerinde operasyonel verimliliği arttıracak entegre güvenlik çözümleri sunuyoruz. Bizim için güvenlik yalnızca cihazlardan ibaret değildir; aynı zamanda insanların hayatlarını, emeklerini , geleceklerini korumak demektir. Misyonumuz; bulunduğumuz her alanda güvenin ve huzurun simgesi olmak müşterilerimizin gözünü arkada bırakmamaktır.                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Kamera Ürünlerimiz</h2>
            <p className="mt-3 text-muted-foreground">Her senaryo için profesyonel düzeyde donanım.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              {
                title: "AHD Kamera",
                desc: "Yüksek çözünürlüklü Analog HD kamera çözümleri",
                image: ahdImg,
                features: [
                  "1080p / 4MP / 5MP seçenekleri",
                  "Koaksiyel kablo altyapısıyla uyumlu",
                  "Gece görüş (IR) desteği",
                ],
              },
              {
                title: "TVI Kamera",
                desc: "Analog sistemlerde yüksek bant genişliği ve net görüntü",
                image: tviImg,
                features: [
                  "Yüksek FPS akış",
                  "Uzun mesafe iletim",
                  "Mevcut DVR'larla uyumluluk",
                ],
              },
              {
                title: "IP Kamera",
                desc: "Ağ tabanlı, uzaktan erişim ve analitik destekli",
                image: ipImg,
                features: [
                  "PoE ile kolay kurulum",
                  "Akıllı hareket algılama",
                  "Mobil uygulama erişimi",
                ],
              },
              {
                title: "CVI Kamera",
                desc: "Esnek kurulum ve istikrarlı HD analog aktarım",
                image: cviImg,
                features: [
                  "Tak-çalıştır kolaylığı",
                  "Yüksek dinamik aralık (WDR)",
                  "IP66 hava koşullarına dayanıklılık",
                ],
              },
              {
                title: "Kablosuz Kamera",
                desc: "Kablo çekmeden hızlı devreye alma",
                image: kablosuzImg,
                features: [
                  "Wi‑Fi bağlantı",
                  "Pil veya adaptörle çalışma",
                  "Bulut kayıt entegrasyonu",
                ],
              },
            ].map((p, i) => (
              <article key={i} className="reveal group flex flex-col rounded-2xl border bg-card p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative overflow-hidden rounded-xl bg-white to-primary/5 aspect-[4/3]">
                  <img src={p.image} alt={p.title} className="h-full w-full object-contain" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                {p.features?.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {p.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Hizmetlerimiz</h2>
            <p className="mt-3 text-muted-foreground">İhtiyaçlarınıza göre özelleştirilmiş uçtan uca çözümler.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wrench, title: "Kurulum", desc: "Sertifikalı teknisyenler sorunsuz kurulum ve kalibrasyon sağlar." },
              { icon: Clock, title: "24/7 İzleme", desc: "Hızlı müdahale protokolleriyle sürekli tetikte olma." },
              { icon: Cog, title: "Bakım", desc: "Proaktif bakım ve talep üzerine onarımlarla kesinti sürelerini önleyin." },
              { icon: Cpu, title: "Akıllı Entegrasyon", desc: "Alarmlar, erişim kontrolü ve ev otomasyonu ile bağlantı kurun." },
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">İletişime Geçin</h2>
            <p className="mt-3 text-muted-foreground">Bugün bir güvenlik uzmanıyla görüşün.</p>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="reveal rounded-2xl border bg-card p-6 shadow-soft">
              <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-foreground">Ad Soyad</label>
                  <input name="name" required className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none ring-primary/0 transition focus:ring-2" placeholder="Jane Doe" />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                  <input type="email" name="email" required className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none ring-primary/0 transition focus:ring-2" placeholder="example@gmail.com" />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-medium text-foreground">Telefon</label>
                  <input type="tel" name="phone" className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none ring-primary/0 transition focus:ring-2" placeholder="555 123 4567" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-foreground">Mesaj</label>
                  <textarea name="message" rows={4} className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm outline-none ring-primary/0 transition focus:ring-2" placeholder="Mesajınızı giriniz..." />
                </div>
                <div className="sm:col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4" /> Güvenli ve gizli
                  </div>
                  <button type="submit" className="btn-primary">Mesaj Gönder</button>
                </div>
              </form>
            </div>
            <div className="reveal space-y-6">
              <div className="rounded-2xl border bg-card p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-foreground">İletişime Geçin</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Adres</p>
                      <p className="text-sm text-muted-foreground">Numune Evler Mah. Atatürk Cad. No:12 Dörtyol/Hatay</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Telefon</p>
                      <p className="text-sm text-muted-foreground">0326 713 19 32</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">info@er-guvenlik.com</p>
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
                  src="https://www.google.com/maps?q=Numune%20Evler%20Mah.%20Atat%C3%BCrk%20Cad.%20No%3A12%20D%C3%B6rtyol%20Hatay&output=embed"
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
              <img src={logoPng} alt="Sentinel Vision logo" className="h-9 w-9 rounded-xl object-contain" />
              <span className="text-base font-semibold">ER GÜVENLİK</span>
            </div>
            <p className="text-center text-sm text-white/70 sm:text-left">© {new Date().getFullYear()} ER Güvenlik. Tüm hakları saklıdır.</p>
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
