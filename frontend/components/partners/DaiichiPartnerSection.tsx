import React from "react";
import "./DaiichiPartnerSection.css";

const DAIICHI = {
  name: "Daiichi Life Myanmar",
  subtitle: "DAIICHI LIFE INSURANCE MYANMAR LTD.",
  headline: "Your Life. Your Future. Our Commitment.",
  description:
    "Explore life insurance information and discover ways to plan for a more secure future with Daiichi Life Myanmar.",
  officialWebsite: "https://www.daiichilife.com.mm/",
  dailyLabel: "DAILY FEATURE",
  weeklyLabel: "WEEKLY CAMPAIGN",
};

export default function DaiichiPartnerSection() {
  return (
    <section className="daiichi-partner" aria-label="Daiichi Life Myanmar advertising">
      <div className="daiichi-partner__top">
        <div className="daiichi-partner__eyebrow">
          <span className="daiichi-partner__dot" />
          APEXIVE AI ADVERTISING PARTNER
        </div>

        <span className="daiichi-partner__tag">
          FEATURED PARTNER
        </span>
      </div>

      <div className="daiichi-partner__content">
        <div className="daiichi-partner__identity">
          <div className="daiichi-partner__logo">
            <img
              src="/images/partners/daiichi-life-myanmar-logo.svg"
              alt="Daiichi Life Myanmar"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
            <span className="daiichi-partner__logo-fallback">
              Daiichi Life
            </span>
          </div>

          <div className="daiichi-partner__company">
            <span>{DAIICHI.subtitle}</span>
            <h2>{DAIICHI.name}</h2>
          </div>
        </div>

        <div className="daiichi-partner__main">
          <div className="daiichi-partner__copy">
            <span className="daiichi-partner__campaign">
              {DAIICHI.dailyLabel}
            </span>

            <h3>{DAIICHI.headline}</h3>

            <p>{DAIICHI.description}</p>

            <div className="daiichi-partner__actions">
              <a
                href={DAIICHI.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="daiichi-partner__button"
              >
                Explore Daiichi Life
                <span aria-hidden="true">↗</span>
              </a>

              <a
                href="/partners/daiichi"
                className="daiichi-partner__secondary"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="daiichi-partner__visual">
            <div className="daiichi-partner__orb daiichi-orb-one" />
            <div className="daiichi-partner__orb daiichi-orb-two" />

            <div className="daiichi-partner__visual-card">
              <span className="daiichi-partner__visual-label">
                LIFE REIMAGINED
              </span>
              <div className="daiichi-partner__visual-mark">
                D
              </div>
              <span className="daiichi-partner__visual-caption">
                BY YOUR SIDE, FOR LIFE
              </span>
            </div>

            <span className="daiichi-partner__visual-footer">
              APEXIVE AI × DAIICHI LIFE MYANMAR
            </span>
          </div>
        </div>

        <div className="daiichi-partner__footer">
          <div>
            <span className="daiichi-partner__footer-dot" />
            {DAIICHI.weeklyLabel}
          </div>

          <a href="/partners/daiichi">
            Discover Campaigns <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
