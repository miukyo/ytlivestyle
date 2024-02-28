import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

interface Data {
  data: string[];
  onChange: (e: string) => void;
  value: string;
  select?: number;
}

export default function Select({ data,onChange, value }: Data) {
  // const [selected, setSelected] = useState(data[select || 0]);
  const selected = value || data[0]
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-gray-3 py-3 pl-4 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="block truncate">{selected}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <IconChevronDown size={20} />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-gray-3 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {data.map((lists, id) => (
              <Listbox.Option
                key={id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-gray-5" : "text-white"
                  }`
                }
                value={lists}>
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                      {lists}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                        <IconCheck size={20} />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
