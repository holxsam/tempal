"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import useVirtualScroll from "../../hooks/useVirtualScroll";
import { MinTemtem } from "../../app/(explore)/layout";
import { formatTemName, zeroPad } from "../../utils/utils";
import { ElementTypeLabel } from "../ElementTypeLabel/ElementTypeLabel";
import { SearchInput } from "../SearchInput/SearchInput.component";
import { useList } from "./useList";
import { useUrlQuery } from "./useUrlQuery";
import { IconChevronRight, IconFilter } from "@tabler/icons-react";
import { SortType } from "./SpecieList.types";
import { SORT_LABELS } from "../SortMenu/SortMenu.component";
import { SORT_TYPE_MAP } from "./SpecieList.utils";
import { useSidebarState } from "../../store/sidebar-store";
import {
  Dispatch,
  forwardRef,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  species: MinTemtem[];
};

export const getSpecieLinkId = (name: string) => `specie-link-${name}`;

export const SpecieList = forwardRef<HTMLDivElement, Props>(function SpecieList(
  { species },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null!);
  const ignoreBlur = useRef(false); // helps the input element determine if it should defocus items
  const [activeItemId, setActiveItemId] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null!); // scrollRef to handle virtualizing the list

  const { processedList } = useList(species);
  const { query, minimalQueryUrl } = useUrlQuery();

  const { blankHeight, listHeight, renderList } = useVirtualScroll<MinTemtem>({
    scrollContainerRef: scrollRef,
    list: processedList,
    itemHeight: 96,
    overscan: 2,
  });

  const getUrl = (tem: MinTemtem) =>
    "/temsearch/" + tem.name + (minimalQueryUrl === "?" ? "" : minimalQueryUrl);

  const hasItems = processedList.length > 0;

  return (
    <div className="relative flex flex-col gap-2 h-full overflow-hidden">
      <SearchInput
        ref={inputRef}
        ignoreBlur={ignoreBlur}
        renderList={renderList}
        setActive={setActiveItemId}
        active={activeItemId}
      />
      <div
        ref={ref}
        className="relative flex flex-col h-full w-full overflow-hidden"
      >
        {!hasItems && (
          <div className="mt-10 text-neutral-500 text-sm rounded-lg p-4 border border-neutral-500/20">
            {"No temtems found. Try making sure you have your "}
            <span className="text-yellow-500 bg-yellow-800/50 px-1 rounded">
              <IconFilter className="inline" size={16} />
              filter
            </span>
            {" set right."}
          </div>
        )}

        <div
          ref={scrollRef}
          className={clsx(
            "flex flex-col gap-4 h-full custom-scrollbar-tiny overflow-y-auto overflow-x-hidden",
            "outline-none appearance-none"
          )}
        >
          <ul
            className="relative flex flex-col h-full"
            style={{
              minHeight: hasItems ? `${listHeight}px` : "100%",
            }}
            onMouseLeave={() => setActiveItemId("")}
          >
            <li style={{ height: hasItems ? `${blankHeight}px` : "100%" }} />
            {renderList.map((tem) => (
              <SpecieItemLink
                active={getSpecieLinkId(tem.name) === activeItemId}
                setActiveItemId={setActiveItemId}
                ignoreBlur={ignoreBlur}
                inputRef={inputRef}
                key={tem.name}
                href={getUrl(tem)}
                specie={tem}
                show={query.sortType}
              />
            ))}
          </ul>
        </div>
        {/* THIS IS THE SHADOW ON THE TOP AND BOTTOM OF THE SCROLL CONTAINER */}
        {/* {hasItems && <ScrollShadow />} */}
      </div>
    </div>
  );
});

type ItemProps = {
  href: string;
  specie: MinTemtem;
  show: SortType;

  // these props help implement arrow key navigation for keyboard accessibility
  ignoreBlur: MutableRefObject<boolean>;
  inputRef: MutableRefObject<HTMLInputElement>;
  active: boolean;
  setActiveItemId: Dispatch<SetStateAction<string>>;
};

const SpecieItemLink = ({
  specie,
  show,
  href,
  ignoreBlur,
  inputRef,
  active,
  setActiveItemId,
}: ItemProps) => {
  const closeSidebar = useSidebarState((state) => state.closeSidebar);
  const showSortData =
    show !== "relevance" && show !== "name" && show !== "number";

  const getStat = SORT_TYPE_MAP[show].accessor;
  const id = getSpecieLinkId(specie.name);

  const activateSelf = () => setActiveItemId(id);

  // This useEffect is to keep the focus on the input element.
  // The input element will focus one of these links so that
  // scrolling occurs if an link is near the top or bottom of the list.
  // Then this link must send the focus back to the input element.
  useEffect(() => {
    if (active) {
      inputRef?.current?.focus();
      ignoreBlur.current = false;
    }
  }, [active]);

  return (
    <Link
      id={id}
      tabIndex={-1}
      href={href}
      className={clsx(
        "group/tem-link flex items-center gap-4 pl-2 pr-4 min-h-[6rem] rounded-lg cursor-pointer whitespace-nowrap text-sm",
        "outline-none appearance-none hover:bg-neutral-800/70 hover:ring-1 ring-inset ring-white/10",
        active ? "bg-neutral-800/70 ring-1" : ""
      )}
      onClick={closeSidebar}
      // onMouseEnter={activateSelf}
    >
      <div className="flex w-16 h-16">
        <Image
          alt={specie.name + " image"}
          src={specie.wikiRenderStaticUrl}
          height={64}
          width={64}
          quality={100}
          className="flex object-contain w-full h-full"
        />
      </div>
      <span className="flex flex-col gap-1 flex-1">
        <span className="flex text-base font-bold">
          <span className="relative top-[-1px] text-[18px] [line-height:1.5rem] text-neutral-600 font-extrabold font-mono pr-1">
            {zeroPad(specie.number, 3)}
          </span>
          <span className="text">{formatTemName(specie.name)}</span>
        </span>

        <span className="flex gap-2">
          {specie.types[0] && <ElementTypeLabel type={specie.types[0]} />}
          {specie.types[1] && <ElementTypeLabel type={specie.types[1]} />}
        </span>
      </span>
      {showSortData && (
        <div className="flex flex-col gap-1">
          <span className="font-extrabold text-xs text-center text-neutral-600">
            {SORT_LABELS[show]}
          </span>
          <span className="font-bold font-mono rounded-xl py-2 px-4 bg-[#1E1E1E] text-center">
            {getStat(specie)}
          </span>
        </div>
      )}
      {!showSortData && (
        <div
          className={clsx(
            "flex rounded-xl text-neutral-600",
            "group-hover/tem-link:animate-bounce-origin-right group-focus-visible/tem-link:animate-bounce-origin-right",
            active && "animate-bounce-origin-right"
          )}
        >
          <IconChevronRight />
        </div>
      )}
    </Link>
  );
};
