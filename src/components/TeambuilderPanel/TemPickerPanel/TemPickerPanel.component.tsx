"use client";

import { Tab } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import {
  createCustomTem,
  CustomTem,
  UpdateTem,
} from "../../../store/temteam-store";
import { Fields, Temtem } from "../../../utils/augmented-types/temtems";
import { fetchTemtem } from "../../../utils/fetch-temtem";

export type TemPickerPanelProps = {
  customTem: CustomTem;
  updateCustomTem: (updatedTem: UpdateTem) => void;
};

const fields: Fields[] = [
  "name",
  "number",
  "types",
  "traits",
  "stats",
  "tvYields",
  "techniques",
  "evolution",
  "wikiRenderStaticUrl",
];

type TemItem = Pick<
  Temtem,
  | "name"
  | "number"
  | "types"
  | "traits"
  | "stats"
  | "tvYields"
  | "techniques"
  | "evolution"
  | "wikiRenderStaticUrl"
>;

const staleTime = 60 * 60 * 1000;

export const TemPickerPanel = ({
  customTem,
  updateCustomTem,
}: TemPickerPanelProps) => {
  const enableQuery = customTem.name !== "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchTemtem", fields.join()],
    queryFn: () => fetchTemtem({ fields }),
    enabled: enableQuery,
    staleTime,
  });

  const isTrueLoading = isLoading && enableQuery;

  if (isTrueLoading || isError)
    return (
      <Tab.Panel className="flex flex-col gap-4">
        <span className="font-bold">Loading</span>
      </Tab.Panel>
    );

  const temList: TemItem[] = data ?? [];

  const updateToFreshTem = (name: string) => {
    const freshTem = createCustomTem(name);
    updateCustomTem({ ...freshTem, id: customTem.id }); // we still want to keep the same id
  };

  return (
    <Tab.Panel className="flex flex-col gap-4">
      <span className="font-bold">TemPickerPanel</span>
      <ul className="flex flex-col">
        {temList.map((tem) => (
          <li
            className="h-8 cursor-pointer"
            key={tem.name}
            onClick={() => updateToFreshTem(tem.name)}
          >
            {tem.name}
          </li>
        ))}
      </ul>
    </Tab.Panel>
  );
};