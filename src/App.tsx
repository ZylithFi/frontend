const APP_URL = "https://app.zylith.fi";
const DOCS_URL = "https://docs.zylith.fi";
const WHITEPAPER_URL = "https://whitepaper.zylith.fi";
const GITHUB_URL = "https://github.com/zylithfi";
const TWITTER_URL = "https://x.com/zylith.fi";
const DISCORD_URL = "https://discord.gg/zylith";

const corePillars = [
  [
    "Private Call Auctions",
    "Orders clear in fixed epochs where price, size, and side stay private. The private execution prover computes eligible fills and one uniform clearing price, tying settlement to the protocol clock rather than private order arrival.",
  ],
  [
    "Hidden Maker Liquidity",
    "Makers quote hidden curves across price levels. The auction can consume eligible depth without exposing inventory, curve shape, or unfilled depth.",
  ],
  [
    "MEV-Resistant Execution",
    "Trading intent stays hidden before the batch clears, reducing the surface for front-running, sandwiching, and pre-settlement order-flow extraction.",
  ],
  [
    "ZK-STARK Settlement",
    "The clearing result is bound to settlement, nullifier, and renewal statements verified on Starknet. The verifier checks fill validity, fees, root transitions, and the uniform clearing price without exposing private orders.",
  ],
  [
    "Shielded Note Balances",
    "Funds live as private notes. Wallets reconstruct balances locally while public state records commitments, nullifiers, roots, and withdrawal events instead of readable account balances.",
  ],
];

const executionLayers = [
  [
    "Clearing Price",
    "Zylith clears each batch at one uniform price. Private limit orders define acceptable bounds; hidden maker curves add depth across price levels. The auction chooses the price that maximizes executable volume while minimizing imbalance, then settles only orders whose limits are compatible with the clearing price.",
  ],
  [
    "Private Matching",
    "Encrypted orders are opened inside the private execution prover boundary. The clearing path checks funding notes, side, size, limits, min-fill rules, all-or-none constraints, and maker-curve capacity before producing the fill plan. No public book is exposed during matching.",
  ],
  [
    "ZK-STARK Settlement",
    "The private witness contains consumed notes, nullifiers, output commitments, fees, fills, and the clearing price. Public calldata carries root commitments, and Starknet finalizes the batch only after the proof facts verify.",
  ],
];

function Nav() {
  return (
    <header className="site-nav">
      <a className="brand-lockup" href="https://zylith.fi" aria-label="Zylith home">
        <img src="/zylith.png" alt="" aria-hidden="true" />
        <span>ZYLITH</span>
      </a>

      <a className="cut-button nav-cta" href={APP_URL}>
        Launch Zylith
      </a>
    </header>
  );
}

function FooterGlyph({ icon }: { icon: string }) {
  if (icon === "doc") {
    return (
      <svg className="footer-glyph" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 1.5h6.1L13 5.4v9.1H3z" />
        <path className="glyph-cut" d="M9.1 1.5v3.9H13z" />
      </svg>
    );
  }

  if (icon === "github") {
    return (
      <svg className="footer-glyph" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 0C3.6 0 0 3.6 0 8c0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.5c-2.2.5-2.7-.9-2.7-.9-.4-.9-.9-1.1-.9-1.1-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.2-.1-.2-.3-1 .1-2.1 0 0 .7-.2 2.2.8a7.7 7.7 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.7-3.6 3.9.3.2.5.7.5 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 16 8c0-4.4-3.6-8-8-8Z" />
      </svg>
    );
  }

  if (icon === "x") {
    return (
      <svg className="footer-glyph" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M12.6 1h2.2L10 6.5 15.7 15h-4.5L7.7 9.8 3.6 15H1.3l5.2-5.9L1 1h4.6l3.1 4.6zm-.8 12.5H13L4.9 2.4H3.6z" />
      </svg>
    );
  }

  return (
    <svg className="footer-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13.6 2.9a13 13 0 0 0-3.3-1 .1.1 0 0 0-.1 0 8 8 0 0 0-.4.8 12 12 0 0 0-3.6 0 8 8 0 0 0-.4-.8.1.1 0 0 0-.1 0 13 13 0 0 0-3.3 1C.4 5.9-.2 8.9.1 12a.1.1 0 0 0 0 .1 13.3 13.3 0 0 0 4 2 .1.1 0 0 0 .1 0 9 9 0 0 0 .8-1.4 8.3 8.3 0 0 1-1.3-.6.1.1 0 0 1 0-.1l.3-.2h.1a9.2 9.2 0 0 0 8 0h.1l.3.2a.1.1 0 0 1 0 .1 8.3 8.3 0 0 1-1.3.6 9 9 0 0 0 .8 1.4h.1a13.2 13.2 0 0 0 4-2 .1.1 0 0 0 0-.1c.3-3.4-.6-6.4-2.4-9.1ZM5.3 10.2c-.8 0-1.4-.7-1.4-1.6S4.5 7 5.3 7s1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6Zm5.4 0c-.8 0-1.4-.7-1.4-1.6S9.9 7 10.7 7s1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="btn-arrow" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M3 3h6v6M9 3 3 9" />
    </svg>
  );
}

function GradientFlowHero() {
  return (
    <section className="gradient-hero">
      <div className="vl-flow" aria-hidden="true">
        <div className="vl-p vl-p1" />
        <div className="vl-p vl-p2" />
        <div className="vl-p vl-p3" />
        <div className="vl-p vl-p4" />
      </div>
      <div className="vl-vig" aria-hidden="true" />
      <div className="hero-copy">
        <h1>Starknet&rsquo;s call auction darkpool.</h1>
        <p className="lede">Trade through call auctions where price, size, and side stay private.</p>
        <div className="hero-cta">
          <a className="cut-button" href={APP_URL}>Launch Zylith</a>
          <a className="outline-button" href={WHITEPAPER_URL}>
            Whitepaper
            <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

function CorePillars() {
  return (
    <section className="content-section">
      {corePillars.map(([title, body]) => (
        <article key={title} className="pillar-row">
          <h2>{title}</h2>
          <p>{body}</p>
        </article>
      ))}
    </section>
  );
}

function AccessPrivacy() {
  const boundaries = [
    [
      "01",
      "Order contents",
      "Side, size, limit price, funding identity, and maker intent must stay hidden from other traders, block proposers, and the public record.",
    ],
    [
      "02",
      "Settlement transcript",
      "The settlement transaction must not reconstruct private order flow through calldata shape, output count, fee rows, renewal records, or claim artifacts.",
    ],
    [
      "03",
      "Settlement sequence",
      "The pattern of many settlements must not leak through timing, cadence, transcript shape, claim timing, gas-payer behavior, or repeated observation.",
    ],
  ];

  return (
    <section className="access-privacy-section">
      <div className="access-timeline">
        <h2 className="access-timeline-title">
          <span>The Access-Pattern Privacy Thesis</span>
          <small>
            Private execution on public blockchains has three privacy boundaries, and a
            zero-knowledge proof only addresses one of them.
          </small>
        </h2>
        {boundaries.map(([number, title, body]) => (
          <article key={number} className="access-timeline-row">
            <span>{number}</span>
            <div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          </article>
        ))}
        <p className="access-timeline-defenses">
          Zylith address the broader surface with fixed epochs, root-only
          settlement, padded output bundles, pair heartbeats, delayed artifacts,
          submission smoothing, and fresh child commitments reducing information
          leakage beyond the contents of individual orders.
        </p>
      </div>
    </section>
  );
}

function ExecutionLayers() {
  return (
    <section className="content-section execution-section">
      <div className="execution-stack">
        {executionLayers.map(([title, body], index) => (
          <article
            key={title}
            className="execution-layer"
            style={{ transform: `translateX(${(2 - index) * 16}px)` }}
          >
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <p>Execution Privacy Beyond Order Flow.</p>
      <div className="cta-links">
        <a className="cut-button" href={APP_URL}>
          Launch Zylith
        </a>
        <a className="outline-button" href={DOCS_URL}>
          Docs
        </a>
      </div>
    </section>
  );
}

function Footer() {
  const links = [
    ["Documentation", DOCS_URL, "doc"],
    ["GitHub", GITHUB_URL, "github"],
    ["Twitter", TWITTER_URL, "x"],
    ["Discord", DISCORD_URL, "discord"],
  ];

  return (
    <footer className="site-footer">
      <div className="footer-links">
        {links.map(([label, href, icon], index) => (
          <a
            key={label}
            href={href}
            className={index > 0 ? "footer-icon-link" : undefined}
            aria-label={label}
          >
            <FooterGlyph icon={icon} />
            {index === 0 ? <span>{label}</span> : null}
          </a>
        ))}
      </div>
      <p className="footer-copy"><span aria-hidden="true">©</span> ZYLITH 2026</p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <Nav />
      <main>
        <GradientFlowHero />
        <AccessPrivacy />
        <CorePillars />
        <ExecutionLayers />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
