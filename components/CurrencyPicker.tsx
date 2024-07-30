"use client";
import { Currency } from "@/types";
import React, {  useState } from "react";
import CurrencyList from "currency-list";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import _ from "lodash";

interface Props {
  currencyCode?: string;
  onCurrencyChange: (currency: Currency | undefined) => void;
}

const CurrencyPicker = ({ onCurrencyChange, currencyCode }: Props) => {
  const response = CurrencyList.getAll("en_US");
  const values = Object.values(response);
  const currencies = values.map((item) => ({
    code: item.code,
    name: item.name,
  })) as Currency[];
  const currentCurrency = currencies.find((item) => item.code === currencyCode);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Currency>(
    currentCurrency || ({} as Currency)
  );

  if (_.isEmpty(currencies)) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value.code
            ? currencies.find((item) => item.code === value.code)?.name
            : "Select currency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandEmpty>No currency found</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {currencies.map((item) => (
                <CommandItem
                  key={item.code}
                  value={item.name}
                  onSelect={(currentValue) => {
                    const selectedCurrency = currencies.find(
                      (item) => item.name === currentValue
                    );

                    setValue(
                      selectedCurrency
                        ? selectedCurrency
                        : { code: "", name: "" }
                    );
                    onCurrencyChange(selectedCurrency);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.code === item.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencyPicker;
