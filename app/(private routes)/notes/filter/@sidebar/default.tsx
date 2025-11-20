"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./default.module.css";

const TAGS = ["all", "Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
type Tag = typeof TAGS[number];

const hrefFor = (tag: Tag) =>
  tag === "all" ? "/notes/filter/all" : `/notes/filter/${tag}`;

const labelFor: Record<Tag, string> = {
  all: "All notes",
  Todo: "Todo",
  Work: "Work",
  Personal: "Personal",
  Meeting: "Meeting",
  Shopping: "Shopping",
};

export default function DefaultSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Filter notes by tag" className={css.nav}>
      <ul className={css.menu}>
        {TAGS.map((tag) => {
          const href = hrefFor(tag);
          const isActive = pathname?.startsWith(href);
          return (
            <li key={tag} className={isActive ? css.itemActive : css.item}>
              <Link href={href}>{labelFor[tag]}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
