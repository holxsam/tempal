"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getMinimalQuery,
  getQuery,
  // getQueryFromUrlParams,
} from "../SpecieList/SpecieList.utils";
// import { getMinimalQuery, getQueryFromUrlParams } from "../SpecieList/useList";

type NavLinkProps = {
  href: string;
  label: string;
};

export const NavLink = ({ href, label }: NavLinkProps) => {
  const pathname = usePathname();
  const params = useSearchParams();

  const active = pathname === href;
  const searchQuery = getQuery(params);
  const minimalQuery = getMinimalQuery(searchQuery);

  return (
    <Link
      href={{
        pathname: href,
        query: href.includes("/species") ? minimalQuery : "",
      }}
      className={clsx(
        "relative capitalize font-medium text-neutral-400",
        // styles for mobile:
        "pl-4 pr-8 h-12 flex items-center justify-center hover:bg-primary-100 hover:text-primary-500 dark:hover:bg-primary-800 dark:hover:text-primary-100",
        // styles for desktop:
        "sm:pl-0 sm:pr-0 sm:h-auto sm:hover:bg-transparent sm:hover:text-primary-500 sm:dark:hover:bg-transparent sm:dark:hover:text-primary-500"
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-link"
          className="absolute -bottom-1 w-full h-[2px] bg-neutral-400 hidden sm:block"
        />
      )}
    </Link>
  );
};