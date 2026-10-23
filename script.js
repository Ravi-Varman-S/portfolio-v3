/* ============================================================
   Ravi Varman S — portfolio-v3 · interactions
   No dependencies. Progressive enhancement: page works without JS.
   ============================================================ */
"use strict";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer: fine)").matches;

/* ---------------- preloader ---------------- */
(function preloader() {
  const el = document.getElementById("preloader");
  const text = document.getElementById("preloaderText");
  if (!el) return;

  const msg = "loading portfolio_v3 ...";
  if (prefersReduced) {
    el.classList.add("done");
    return;
  }

  let i = 0;
  const typer = setInterval(() => {
    if (!text) return;
    text.textContent = msg.slice(0, ++i);
    if (i >= msg.length) clearInterval(typer);
  }, 42);

  const hide = () => el.classList.add("done");
  window.addEventListener("load", () => setTimeout(hide, 700));
  setTimeout(hide, 2200); // safety net
})();

/* ---------------- kinetic hero letters ---------------- */
(function kinetic() {
  const nodes = document.querySelectorAll("[data-kinetic]");
  nodes.forEach((node, lineIdx) => {
    const text = node.textContent;
    node.textContent = "";
    const base = 0.45 + lineIdx * 0.28;
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--i", i);
      span.style.setProperty("--base", base + "s");
      span.textContent = ch;
      node.appendChild(span);
    });
  });
})();

/* ---------------- role rotator ---------------- */
(function roles() {
  const el = document.getElementById("roleRotator");
  if (!el || prefersReduced) return;
  const roles = [
    "Software Developer",
    "Python · Java · JavaScript",
    "React & Node.js builder",
    "Automation tinkerer",
  ];
  let idx = 0;
  setInterval(() => {
    el.classList.add("swap");
    setTimeout(() => {
      idx = (idx + 1) % roles.length;
      el.textContent = roles[idx];
      el.classList.remove("swap");
    }, 320);
  }, 2800);
})();

/* ---------------- starfield canvas ---------------- */
(function starfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext("2d");

  let w, h, points, raf;
  const COUNT = window.innerWidth < 768 ? 42 : 84;
  const mouse = { x: -9999, y: -9999 };

  function resize() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }

  function spawn() {
    points = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.28 * devicePixelRatio,
      r: (Math.random() * 1.4 + 0.5) * devicePixelRatio,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    const linkDist = 128 * devicePixelRatio;

    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 211, 238, 0.55)";
      ctx.fill();
    }

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(148, 163, 184, ${0.16 * (1 - dist / linkDist)})`;
          ctx.lineWidth = devicePixelRatio * 0.7;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(step);
  }

  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * devicePixelRatio;
    mouse.y = (e.clientY - rect.top) * devicePixelRatio;
  });

  window.addEventListener("resize", () => { resize(); spawn(); });
  resize();
  spawn();
  step();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else step();
  });
})();

/* ---------------- custom cursor ---------------- */
(function cursor() {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring || !isFinePointer || prefersReduced) return;

  document.body.classList.add("cursor-on");
  let rx = 0, ry = 0, tx = 0, ty = 0;

  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
  });

  (function follow() {
    rx += (tx - rx) * 0.16;
    ry += (ty - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();

  const hoverables = "a, button, summary, [data-tilt], .orbit__chip";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest(hoverables)) document.body.classList.add("cursor-hover");
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest(hoverables)) document.body.classList.remove("cursor-hover");
  });
})();

/* ---------------- scroll: progress + nav ---------------- */
(function scrollUI() {
  const bar = document.getElementById("progressBar");
  const nav = document.getElementById("nav");
  const sections = [...document.querySelectorAll("section[id]")];
  const links = [...document.querySelectorAll(".nav__links a")];

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = pct + "%";
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);

    const y = window.scrollY + window.innerHeight * 0.35;
    let current = "";
    for (const s of sections) if (s.offsetTop <= y) current = s.id;
    links.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current)
    );
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------------- mobile nav ---------------- */
(function mobileNav() {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("navBurger");
  if (!nav || !burger) return;

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  });

  nav.querySelectorAll(".nav__links a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    })
  );
})();

/* ---------------- reveal on scroll ---------------- */
(function reveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || prefersReduced) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px" }
  );
  items.forEach((el) => io.observe(el));
})();

/* ---------------- count-up stats ---------------- */
(function counters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;

  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    if (prefersReduced) { el.textContent = target.toFixed(decimals); return; }
    const dur = 1400;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
})();

/* ---------------- skill orbit ---------------- */
(function orbit() {
  const stage = document.getElementById("orbit");
  if (!stage) return;

  /* guide rings (position set inline so it never depends on nth-of-type) */
  [
    { inset: "30%", color: "rgba(34, 211, 238, 0.22)" },
    { inset: "16%", color: "rgba(167, 139, 250, 0.18)" },
  ].forEach((r) => {
    const ring = document.createElement("div");
    ring.className = "orbit__ring";
    ring.style.inset = r.inset;
    ring.style.borderColor = r.color;
    stage.appendChild(ring);
  });

  const rings = [
    { dur: 30, frac: 0.30, skills: ["Python", "Java", "JavaScript", "C", "SQL"] },
    { dur: 42, frac: 0.55, skills: ["React", "Node.js", "Express", "REST APIs", "FastAPI"] },
    { dur: 56, frac: 0.82, skills: ["MongoDB", "MySQL", "Playwright", "Git", "Postman", "UiPath"] },
  ];

  rings.forEach((ring, rIdx) => {
    const spinner = document.createElement("div");
    spinner.className = "orbit__spinner";
    spinner.style.setProperty("--dur", ring.dur + "s");
    const cw = rIdx % 2 === 1; // alternate directions
    if (cw) spinner.style.animationDirection = "reverse";

    ring.skills.forEach((skill, i) => {
      const a = ((360 / ring.skills.length) * i - 90) * (Math.PI / 180);
      const node = document.createElement("div");
      node.className = "orbit__node";
      node.style.left = 50 + ring.frac * 50 * Math.cos(a) + "%";
      node.style.top = 50 + ring.frac * 50 * Math.sin(a) + "%";

      const chip = document.createElement("span");
      chip.className = "orbit__chip";
      chip.textContent = skill;

      /* counter-rotate the chip (opposite keyframes) so text stays upright */
      if (!prefersReduced) {
        chip.style.setProperty("--dur", ring.dur + "s");
        chip.style.animationName = cw ? "spin-ccw" : "spin-cw";
      }

      node.appendChild(chip);
      spinner.appendChild(node);
    });

    stage.appendChild(spinner);
  });
})();

/* ---------------- marquee: duplicate content for a seamless loop ---------------- */
(function marquee() {
  const track = document.getElementById("marqueeTrack");
  if (!track) return;
  track.innerHTML += track.innerHTML;
})();

/* ---------------- project tilt + glow ---------------- */
(function tilt() {
  if (!isFinePointer || prefersReduced) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      card.style.transform =
        `perspective(900px) rotateY(${(px - 0.5) * 7}deg) rotateX(${(0.5 - py) * 7}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ---------------- magnetic buttons ---------------- */
(function magnet() {
  if (!isFinePointer || prefersReduced) return;
  document.querySelectorAll("[data-magnet]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.24}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
})();

/* ---------------- timeline scroll draw ---------------- */
(function timeline() {
  const wrap = document.getElementById("timeline");
  const fill = document.getElementById("timelineFill");
  const items = [...document.querySelectorAll(".tl")];
  if (!wrap || !fill) return;

  const LEN = 1000;
  fill.style.strokeDasharray = LEN;

  function draw() {
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh * 0.4;
    const passed = vh * 0.72 - rect.top;
    const p = Math.max(0, Math.min(passed / total, 1));

    fill.style.strokeDashoffset = LEN * (1 - p);

    const litLine = rect.top + rect.height * p;
    items.forEach((li) => {
      const dot = li.querySelector(".tl__dot");
      if (!dot) return;
      const dotY = dot.getBoundingClientRect().top;
      li.classList.toggle("lit", dotY <= litLine + 8);
    });
  }

  window.addEventListener("scroll", draw, { passive: true });
  window.addEventListener("resize", draw);
  draw();
})();

/* ---------------- toast ---------------- */
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------------- resume download toast ---------------- */
document.querySelectorAll("[data-resume]").forEach((a) => {
  a.addEventListener("click", () =>
    showToast("⬇ Resume downloading — Ravi_Varman_S_Resume.pdf")
  );
});

/* ---------------- copy email ---------------- */
(function copyEmail() {
  const btn = document.getElementById("copyEmail");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const email = "ravivarmansenthilkumar@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      showToast("✓ Email copied — " + email);
    } catch {
      showToast("Email: " + email);
    }
  });
})();

/* ---------------- footer year ---------------- */
document.getElementById("year").textContent = new Date().getFullYear();
