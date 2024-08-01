"use client";
import * as React from "react";
import {  format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { startOfMonth } from "date-fns";
import "react-day-picker/dist/style.css";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { toast } from "sonner";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface Props {
  date: DateRange;
  setDate: (date: { from: Date; to: Date }) => void;
}

export function DateRangePicker({ date, setDate }: Props) {
  const [open, setOpen] = React.useState(false);

  // console.log("DateRangePicker", date);

  return (
    <div className={cn("grid gap-2")}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="relative">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(value: any) => {
                console.log(value.from);
                if (
                  differenceInDays(value.to, value.from) > MAX_DATE_RANGE_DAYS
                ) {
                  return toast.error(
                    <div className="flex flex-col gap-1">
                      <span>Selected date range is too big</span>
                      <span>{`Max allow range
                    is ${MAX_DATE_RANGE_DAYS} days`}</span>
                    </div>
                  );
                }
                setDate(value);
                setOpen(false);
              }}
              numberOfMonths={2}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-[2px] right-[2px]"
              onClick={() => setOpen(false)}
            >
              <AiOutlineCloseCircle className="size-6" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
