"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CircleDot,
  FolderKanban,
  Globe2,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  communitySections,
  searchCategories,
  searchDirectory,
  type CommunitySectionSlug,
  type SearchCategory,
} from "../lib/community";

const groupIcons = [Globe2, Users, BookOpen, FolderKanban, Sparkles];

export default function CommunitySectionPage({
  section,
}: {
  section: CommunitySectionSlug;
}) {
  const content = communitySections[section];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return searchDirectory.filter((entry) => {
      const matchesCategory =
        category === "all" || entry.category === category;
      const searchableText =
        `${entry.title} ${entry.description} ${entry.category}`.toLowerCase();

      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [category, query]);

  return (
    <div className="ac-feature-page ac-animate-in">
      <section className="ac-hero ac-feature-hero">
        <div className="ac-hero-content">
          <span className="ac-eyebrow">{content.eyebrow}</span>
          <h1 className="ac-page-title">
            {content.title === "Clone Detector" ? (
              <>
                CLONE <span className="ac-gradient-text">DETECTOR</span>
              </>
            ) : (
              content.title.toUpperCase()
            )}
          </h1>
          <p className="ac-page-description">{content.description}</p>
          {section === "search" && (
            <div className="ac-feature-hero-note">
              <CircleDot size={14} />
              Search the available community directory by name or topic.
            </div>
          )}
        </div>
        <div className="ac-feature-hero-mark" aria-hidden="true">
          {section === "dashboard" && <Activity />}
          {section === "forums" && <MessageSquare />}
          {section === "articles" && <BookOpen />}
          {section === "projects" && <FolderKanban />}
          {section === "resources" && <Sparkles />}
          {section === "clone-detector" && <ShieldCheck />}
          {section === "search" && <Search />}
        </div>
      </section>

      {section === "clone-detector" && (
        <div className="ac-integration-notice" role="status">
          <span className="ac-integration-icon">
            <ShieldCheck size={18} />
          </span>
          <div>
            <strong>Detection service connection required</strong>
            <p>
              Connect a clone-detection service to run checks and view scan
              results. No scan is performed until that service is available.
            </p>
          </div>
          <Link href="/resources" className="ac-notice-link">
            View API resources <ArrowUpRight size={14} />
          </Link>
        </div>
      )}

      {section === "search" && (
        <section className="ac-card ac-search-workspace" aria-label="Community search">
          <label className="ac-search ac-search-large">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by company, topic, project, or resource..."
              aria-label="Search community directory"
            />
            {query && (
              <button
                className="ac-search-clear"
                type="button"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            )}
          </label>

          <div className="ac-search-categories" aria-label="Search categories">
            {searchCategories.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`ac-category-chip${category === option.id ? " is-active" : ""}`}
                aria-pressed={category === option.id}
                onClick={() => setCategory(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="ac-search-results-heading">
            <div>
              <span className="ac-eyebrow">Directory results</span>
              <h2>
                {query.trim() ? `Results for “${query.trim()}”` : "Explore the network"}
              </h2>
            </div>
            <span className="ac-results-count">
              {searchResults.length} {searchResults.length === 1 ? "result" : "results"}
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="ac-search-results">
              {searchResults.map((result) => (
                <Link
                  className="ac-search-result"
                  href={result.href}
                  key={result.title}
                >
                  <span className="ac-result-icon">
                    <Search size={16} />
                  </span>
                  <span className="ac-result-copy">
                    <strong>{result.title}</strong>
                    <small>{result.description}</small>
                  </span>
                  <span className="ac-result-category">
                    {result.category}
                  </span>
                  <ArrowUpRight className="ac-result-arrow" size={16} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="ac-empty ac-search-empty">
              <Search size={22} />
              <strong>No matching directory entries</strong>
              <span>Try a different phrase or choose another category.</span>
            </div>
          )}

          <div className="ac-semantic-search">
            <span className="ac-semantic-icon">
              <Sparkles size={17} />
            </span>
            <span>
              <strong>AI Semantic Search</strong>
              <small>
                Meaning-based results become available when an AI search
                service is connected.
              </small>
            </span>
            <span className="ac-badge ac-badge-purple">SERVICE REQUIRED</span>
          </div>
        </section>
      )}

      <div className="ac-feature-groups">
        {content.groups.map((group, groupIndex) => {
          const Icon = groupIcons[groupIndex % groupIcons.length];

          return (
            <section
              className="ac-feature-group"
              key={group.title}
              aria-labelledby={`group-${groupIndex}`}
            >
              <div className="ac-feature-group-heading">
                <span className="ac-feature-group-icon">
                  {section === "clone-detector" ? (
                    <ShieldCheck size={18} />
                  ) : (
                    <Icon size={18} />
                  )}
                </span>
                <div>
                  <span className="ac-eyebrow">
                    {section === "clone-detector" ? "Brand protection" : `View ${String(groupIndex + 1).padStart(2, "0")}`}
                  </span>
                  <h2 id={`group-${groupIndex}`}>{group.title}</h2>
                  <p>{group.description}</p>
                </div>
                <span className="ac-group-total">
                  {String(group.items.length).padStart(2, "0")} AREAS
                </span>
              </div>

              <div className="ac-feature-grid">
                {group.items.map((item, itemIndex) => (
                  <article className="ac-feature-card" key={item.title}>
                    <div className="ac-feature-card-top">
                      <span className="ac-feature-card-icon">
                        {section === "clone-detector" ? (
                          <ShieldCheck size={17} />
                        ) : section === "forums" ? (
                          <MessageSquare size={17} />
                        ) : section === "articles" ? (
                          <BookOpen size={17} />
                        ) : section === "projects" ? (
                          <FolderKanban size={17} />
                        ) : section === "search" ? (
                          <Search size={17} />
                        ) : (
                          <Sparkles size={17} />
                        )}
                      </span>
                      <span className="ac-feature-number">
                        {String(itemIndex + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="ac-feature-card-foot">
                      {section === "clone-detector" ? (
                        <>
                          <span className="ac-service-dot" />
                          Service required
                        </>
                      ) : (
                        <>
                          Explore feature <ArrowRight size={13} />
                        </>
                      )}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
