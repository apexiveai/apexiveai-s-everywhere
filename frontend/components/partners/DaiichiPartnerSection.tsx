import Image from "next/image";
import Link from "next/link";
import React from "react";
import "./DaiichiPartnerSection.css";

const DAIICHI = {
  name: "Daiichi Life Myanmar",
  subtitle: "INSURANCE INFORMATION · APEXIVE AI",
  headline: "A Future Worth Protecting.",
  description:
    "Explore life insurance information and discover ways to plan for a more secure future with Daiichi Life Myanmar.",
  dailyLabel: "FEATURED INFORMATION",
  weeklyLabel: "INDEPENDENT INFORMATION PAGE",
};

export default function DaiichiPartnerSection() {
  return (
    <section
      className="daiichi-partner"
      aria-label="Independent Daiichi Life insurance information by ApexiveAI"
    >
      <div className="daiichi-partner__top">
        <div className="daiichi-partner__eyebrow">
          <span className="daiichi-partner__dot" />
          APEXIVE AI · INDEPENDENT INFORMATION
        </div>

        <span className="daiichi-partner__tag">
          INFORMATION PAGE
        </span>
      </div>

      <div className="daiichi-partner__content">
        <div className="daiichi-partner__identity">
          <div className="daiichi-partner__logo">
            <Image
              src="/images/partners/apexiveai-mark.png"
              alt="ApexiveAI logo"
              width={280}
              height={280}
            />
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
              <Link
                href="/partners/daiichi"
                className="daiichi-partner__button"
              >
                Explore Information
                <span aria-hidden="true">↗</span>
              </Link>

              <Link
                href="/partners/daiichi"
                className="daiichi-partner__secondary"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="daiichi-partner__visual">
            <div className="daiichi-partner__orb daiichi-orb-one" />
            <div className="daiichi-partner__orb daiichi-orb-two" />

            <div className="daiichi-partner__visual-card">
              <span className="daiichi-partner__visual-label">
                INSURANCE INFORMATION
              </span>
              <div className="daiichi-partner__visual-mark">
                <Image
                  src="/images/partners/apexiveai-mark.png"
                  alt=""
                  width={280}
                  height={280}
                />
              </div>
              <span className="daiichi-partner__visual-caption">
                BY APEXIVE AI
              </span>
            </div>

            <span className="daiichi-partner__visual-footer">
              INDEPENDENT INFORMATION · APEXIVE AI
            </span>
          </div>
        </div>

        <div className="daiichi-partner__footer">
          <div>
            <span className="daiichi-partner__footer-dot" />
            {DAIICHI.weeklyLabel}
          </div>

          <Link href="/partners/daiichi#solutions">
            Explore Insurance Information <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
