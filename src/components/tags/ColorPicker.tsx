import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors: string[];
}

export const ColorPicker = ({ value, onChange, presetColors }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (newColor.startsWith('#') && /^#[0-9A-Fa-f]{0,6}$/.test(newColor)) {
      onChange(newColor);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {presetColors.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-10 h-10 rounded-lg transition-all duration-200 ${
            value === color ? "ring-2 ring-offset-2 ring-black scale-110" : ""
          }`}
          style={{ backgroundColor: color }}
          onClick={() => handleColorChange(color)}
        />
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 border-dashed transition-colors ${
              !presetColors.includes(value)
                ? "border-primary bg-opacity-25"
                : "border-gray-300 hover:border-gray-400"
            }`}
            style={{
              backgroundColor: !presetColors.includes(value) ? value : "transparent",
            }}
          >
            <Palette
              size={16}
              className={
                !presetColors.includes(value)
                  ? "text-white"
                  : "text-gray-500"
              }
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4"
          side="right"
          align="start"
          sideOffset={5}
        >
          <div className="space-y-4">
            <HexColorPicker color={value} onChange={handleColorChange} />
            <Input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="#000000"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};