import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const years = ["2025"];

export function YearSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[120px] cursor-pointer">
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        {years?.map((year) => (
          <SelectItem key={year} value={year} className="cursor-pointer">
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
