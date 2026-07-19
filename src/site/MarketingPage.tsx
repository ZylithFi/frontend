const NAV_LINKS = [
  { href: "https://x.com/zylith.fi", label: "Twitter" },
  { href: "https://docs.zylith.fi", label: "Docs" },
  { href: "https://github.com/zylithfi", label: "GitHub" },
] as const;

const VOLUME_BARS = [
  { side: "bid", left: "14%", height: "18%", delay: "0s" },
  { side: "bid", left: "23%", height: "31%", delay: "0.08s" },
  { side: "bid", left: "32%", height: "46%", delay: "0.16s" },
  { side: "bid", left: "41%", height: "58%", delay: "0.24s" },
  { side: "clear", left: "50%", height: "72%", delay: "0.32s" },
  { side: "ask", left: "59%", height: "62%", delay: "0.40s" },
  { side: "ask", left: "68%", height: "49%", delay: "0.48s" },
  { side: "ask", left: "77%", height: "34%", delay: "0.56s" },
  { side: "ask", left: "86%", height: "20%", delay: "0.64s" },
] as const;

const SETTLEMENT_ROWS = [
  { top: "36%", width: "24%", delay: "0s" },
  { top: "46%", width: "28%", delay: "0.18s" },
  { top: "56%", width: "21%", delay: "0.36s" },
  { top: "66%", width: "26%", delay: "0.54s" },
] as const;

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9.5" rx="1" stroke="#c6c6cd" strokeWidth="1.4" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="#c6c6cd" strokeWidth="1.4" />
    </svg>
  );
}

function ButtonArrow() {
  return (
    <svg className="btn-arrow" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 3h6v6M9 3 3 9" />
    </svg>
  );
}

function DocumentationIcon() {
  return (
    <svg className="footer-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 1.5h6.1L13 5.4v9.1H3z" />
      <path className="glyph-cut" d="M9.1 1.5v3.9H13z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="footer-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 0C3.6 0 0 3.6 0 8c0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.5c-2.2.5-2.7-.9-2.7-.9-.4-.9-.9-1.1-.9-1.1-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.2-.1-.2-.3-1 .1-2.1 0 0 .7-.2 2.2.8a7.7 7.7 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.7-3.6 3.9.3.2.5.7.5 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 16 8c0-4.4-3.6-8-8-8Z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="footer-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M12.6 1h2.2L10 6.5 15.7 15h-4.5L7.7 9.8 3.6 15H1.3l5.2-5.9L1 1h4.6l3.1 4.6zm-.8 12.5H13L4.9 2.4H3.6z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="footer-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M13.6 2.9a13 13 0 0 0-3.3-1 .1.1 0 0 0-.1 0 8 8 0 0 0-.4.8 12 12 0 0 0-3.6 0 8 8 0 0 0-.4-.8.1.1 0 0 0-.1 0 13 13 0 0 0-3.3 1C.4 5.9-.2 8.9.1 12a.1.1 0 0 0 0 .1 13.3 13.3 0 0 0 4 2 .1.1 0 0 0 .1 0 9 9 0 0 0 .8-1.4 8.3 8.3 0 0 1-1.3-.6.1.1 0 0 1 0-.1l.3-.2h.1a9.2 9.2 0 0 0 8 0h.1l.3.2a.1.1 0 0 1 0 .1 8.3 8.3 0 0 1-1.3.6 9 9 0 0 0 .8 1.4h.1a13.2 13.2 0 0 0 4-2 .1.1 0 0 0 0-.1c.3-3.4-.6-6.4-2.4-9.1ZM5.3 10.2c-.8 0-1.4-.7-1.4-1.6S4.5 7 5.3 7s1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6Zm5.4 0c-.8 0-1.4-.7-1.4-1.6S9.9 7 10.7 7s1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6Z" />
    </svg>
  );
}

function Header() {
  return (
    <header className="site-nav">
      <a className="brand-lockup" href="https://zylith.fi" aria-label="Zylith home">
        <img src="/site/zylith-logo.png" alt="" aria-hidden="true" />
        <span>ZYLITH</span>
      </a>
      <nav className="nav-center-links" aria-label="Primary links">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="cut-button nav-cta" href="https://app.zylith.fi">
        Launch Zylith
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="cx-hero" data-screen-label="Hero">
      <div className="cx-canvas" aria-hidden="true" />
      <div className="cx-vig" aria-hidden="true" />
      <div className="cx-dim" aria-hidden="true" />
      <div className="cx-copy">
        <h1>Starknet’s Call Auction Darkpool.</h1>
        <p className="lede">Trade through call auctions where price, size, and side stay private.</p>
        <div className="cx-cta">
          <a className="cut-button" href="https://app.zylith.fi">
            Launch Zylith
          </a>
          <a className="outline-button" href="https://whitepaper.zylith.fi">
            Whitepaper
            <ButtonArrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function CorePillars() {
  return (
    <section className="content-section" data-screen-label="Core pillars">
      <article className="pillar-row has-diagram diag-right">
        <div>
          <h2>Private Call Auctions</h2>
          <p>
            Orders clear in fixed epochs where price, size, and side stay private. The private execution prover computes
            eligible fills and one uniform clearing price, tying settlement to the protocol clock rather than private order
            arrival.
          </p>
        </div>
        <div className="pillar-epoch">
          <div className="epoch-stage">
            <div className="ec-frame ec-r1" />
            <div className="ec-frame ec-r2" />
            <div className="ec-frame ec-r3" />
            <div className="ec-line" />
            <div className="ec-diamond" />
            <div className="ec-shard-a" />
            <div className="ec-shard-dot" />
          </div>
        </div>
      </article>

      <article className="pillar-row has-diagram diag-left">
        <div>
          <h2>Hidden LP Liquidity</h2>
          <p>
            Private liquidity positions materialize hidden slices across price levels. The auction can consume eligible
            depth without exposing reserves, policy shape, or unfilled depth.
          </p>
        </div>
        <div className="pillar-canvas">
          <canvas data-scene="liquidity-slice" />
        </div>
      </article>

      <article className="pillar-row has-diagram diag-right">
        <div>
          <h2>MEV-Resistant Execution</h2>
          <p>
            Trading intent stays hidden before the batch clears, reducing the surface for front-running, sandwiching, and
            pre-settlement order-flow extraction.
          </p>
        </div>
        <div className="pillar-diag">
          <div className="snd-stage">
            <div className="snd-batch">
              <LockIcon />
            </div>
            <div className="snd-pred snd-pred-l" />
            <div className="snd-pred snd-pred-r" />
            <div className="snd-spark snd-spark-l" />
            <div className="snd-spark snd-spark-r" />
            <div className="snd-tag snd-tag-l">Front-Run</div>
            <div className="snd-tag snd-tag-r">Back-Run</div>
          </div>
        </div>
      </article>

      <article className="pillar-row has-diagram diag-left lg">
        <div>
          <h2>ZK-STARK Settlement</h2>
          <p>
            The clearing result is bound to settlement, nullifier, and renewal statements verified on Starknet. The
            verifier checks fill validity, fees, root transitions, and the uniform clearing price without exposing private
            orders.
          </p>
        </div>
        <div className="pillar-canvas lg">
          <canvas data-scene="immutable" />
        </div>
      </article>

      <article className="pillar-row has-diagram diag-right lg">
        <div>
          <h2>Shielded Note Balances</h2>
          <p>
            Funds live as private notes. Wallets reconstruct balances locally while public state records commitments,
            nullifiers, roots, and withdrawal events instead of readable account balances.
          </p>
        </div>
        <div className="pillar-canvas lg">
          <canvas data-scene="neural" />
        </div>
      </article>
    </section>
  );
}

function ExecutionDiagrams() {
  return (
    <div className="exec-left">
      <div className="exec-dia on" data-i="0">
        <div className="opt-stage">
          <div className="oc-order">
            <span className="r a" />
            <span className="r b" />
            <span className="r c" />
          </div>
          <div className="oc-flow" />
          <div className="oc-pkt" />
          <div className="oc-seal">
            <LockIcon />
          </div>
          <div className="opt-status">Order → Commitment</div>
        </div>
      </div>
      <div className="exec-dia" data-i="1">
        <div className="opt-stage">
          <div className="vol-cap">
            <span>Clearing</span>
            <b>0.4831</b>
          </div>
          <div className="vol-base" />
          <div className="vol-line" />
          {VOLUME_BARS.map((bar) => (
            <div
              key={`${bar.side}-${bar.left}`}
              className={`vol-bar ${bar.side}`}
              style={{ left: bar.left, height: bar.height, animationDelay: bar.delay }}
            />
          ))}
          <div className="opt-status">Supply · Demand</div>
        </div>
      </div>
      <div className="exec-dia" data-i="2">
        <div className="kin-stage">
          <div className="kin-grid">
            <div className="kin-cell kin-h-a" />
            <div className="kin-cell kin-h-b" />
            <div className="kin-cell kin-h-c" />
            <div className="kin-cell kin-edge" />
            <div className="kin-cell kin-center" />
            <div className="kin-cell" />
            <div className="kin-cell kin-h-d" />
            <div className="kin-cell" />
            <div className="kin-cell kin-h-e" />
          </div>
          <div className="kin-align">Alignment: 74% · hover plates</div>
        </div>
      </div>
      <div className="exec-dia" data-i="3">
        <div className="opt-stage">
          {SETTLEMENT_ROWS.map((row) => (
            <div
              key={`${row.top}-${row.width}`}
              className="bs-row"
              style={{ top: row.top, width: row.width, animationDelay: row.delay }}
            />
          ))}
          <div className="bs-root" />
          <div className="bs-rootlabel">ROOT</div>
          <div className="opt-status">Fills → One Root</div>
        </div>
      </div>
    </div>
  );
}

function ExecutionSection() {
  return (
    <section className="content-section execution-section anim-rise" data-screen-label="Execution layers">
      <div className="exec-card">
        <ExecutionDiagrams />
        <div className="exec-progress" aria-hidden="true">
          <span className="is-on" data-i="0">
            <b>01</b>
            <em>Commitment</em>
          </span>
          <span data-i="1">
            <b>02</b>
            <em>Price</em>
          </span>
          <span data-i="2">
            <b>03</b>
            <em>Match</em>
          </span>
          <span data-i="3">
            <b>04</b>
            <em>Settle</em>
          </span>
        </div>
        <div className="exec-right" id="execStages">
          <article className="execution-layer exec-slide">
            <h2>Order Commitment</h2>
            <p>
              Each order is bound to a private commitment before entering its auction epoch. The public batch surface
              carries the commitment and routing metadata, while the encrypted payload is opened only inside prover ingress
              during witness assembly.
            </p>
          </article>
          <article className="execution-layer exec-slide">
            <h2>Clearing Price</h2>
            <p>
              Zylith clears each batch at one uniform price. Private limit orders define acceptable bounds; hidden LP
              slices add depth across price levels. The auction chooses the price that maximizes executable volume while
              minimizing imbalance, then settles only orders whose limits are compatible with the clearing price.
            </p>
          </article>
          <article className="execution-layer exec-slide">
            <h2>Private Matching</h2>
            <p>
              Encrypted orders are opened inside the private execution prover boundary. The clearing path checks funding
              notes, side, size, limits, min-fill rules, all-or-none constraints, and LP-slice capacity before producing
              the fill plan. No public book is exposed during matching.
            </p>
          </article>
          <article className="execution-layer exec-slide">
            <h2>Batch Settlement</h2>
            <p>
              The private witness contains consumed notes, nullifiers, output commitments, fees, fills, and the clearing
              price. Public calldata carries root commitments, and Starknet finalizes the batch only after the proof facts
              verify.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function AccessPrivacySection() {
  return (
    <section className="access-privacy-section" data-screen-label="Access privacy">
      <div className="access-timeline">
        <div className="thesis">
          <h2>The Access-Pattern Privacy Thesis</h2>
          <p>
            Private execution on public blockchains has three privacy boundaries, and a zero-knowledge proof only addresses
            one of them.
          </p>
        </div>
        <table className="mx">
          <thead>
            <tr>
              <th aria-label="Privacy boundary" />
              <th className="c">ZK proof alone</th>
              <th className="c">Zylith</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="bd">01 · Order contents</div>
                <div className="sm">
                  Side, size, limit price, funding identity, and LP position state must stay hidden from other traders, block
                  proposers, and the public record.
                </div>
              </td>
              <td className="c">
                <span className="yes">✓</span>
              </td>
              <td className="c">
                <span className="yes">✓</span>
              </td>
            </tr>
            <tr>
              <td>
                <div className="bd">02 · Settlement transcript</div>
                <div className="sm">
                  The settlement transaction must not reconstruct private order flow through calldata shape, output count,
                  fee rows, renewal records, or claim artifacts.
                </div>
              </td>
              <td className="c">
                <span className="no">✕</span>
              </td>
              <td className="c">
                <span className="yes">✓</span>
              </td>
            </tr>
            <tr>
              <td>
                <div className="bd">03 · Settlement sequence</div>
                <div className="sm">
                  The pattern of many settlements must not leak through timing, cadence, transcript shape, claim timing,
                  gas-payer behavior, or repeated observation.
                </div>
              </td>
              <td className="c">
                <span className="no">✕</span>
              </td>
              <td className="c">
                <span className="yes">✓</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="defenses">
          <p>
            Zylith address the broader surface with fixed epochs, root-only settlement, padded output bundles, pair
            heartbeats, delayed artifacts, submission smoothing, and fresh child commitments reducing information leakage
            beyond the contents of individual orders.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta" data-screen-label="Final CTA">
      <p>Execution Privacy Beyond Order Flow.</p>
      <div className="cta-links">
        <a className="cut-button" href="https://app.zylith.fi">
          Launch Zylith
        </a>
        <a className="outline-button" href="https://docs.zylith.fi">
          Docs
        </a>
        <a className="outline-button" href="https://github.com/zylithfi">
          GitHub
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a href="https://docs.zylith.fi" aria-label="Documentation">
          <DocumentationIcon />
          <span>Documentation</span>
        </a>
        <a href="https://github.com/zylithfi" className="footer-icon-link" aria-label="GitHub">
          <GitHubIcon />
        </a>
        <a href="https://x.com/zylith.fi" className="footer-icon-link" aria-label="Twitter">
          <TwitterIcon />
        </a>
        <a href="https://discord.gg/zylith" className="footer-icon-link" aria-label="Discord">
          <DiscordIcon />
        </a>
      </div>
      <p className="footer-copy">
        <span aria-hidden="true">©</span> ZYLITH 2026
      </p>
    </footer>
  );
}

export function MarketingPage() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <div className="scroll-content">
          <section className="content-section zylith-explainer" data-screen-label="Explainer">
            <p>
              <span className="zname">Zylith</span> is a DEX for private spot execution that clears encrypted orders
              against hidden LP liquidity through uniform price call auctions.
            </p>
          </section>
          <CorePillars />
          <ExecutionSection />
          <div className="section-hairline" aria-hidden="true" />
          <AccessPrivacySection />
          <FinalCta />
          <Footer />
        </div>
      </main>
    </div>
  );
}
