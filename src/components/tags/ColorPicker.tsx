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
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleColorPickerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {presetColors.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-8 h-8 rounded-lg transition-all duration-200 ${
            value === color ? "ring-2 ring-offset-2 ring-black scale-110" : ""
          }`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
      <Popover 
        open={showColorPicker} 
        onOpenChange={setShowColorPicker}
        modal={true}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 border-dashed transition-colors ${
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
          className="w-auto p-3" 
          onClick={handleColorPickerClick}
          onPointerDownOutside={(e) => {
            if (e.target instanceof Element && 
                (e.target.closest('.react-colorful') || 
                 e.target.closest('input'))) {
              e.preventDefault();
            }
          }}
        >
          <div className="space-y-3">
            <HexColorPicker 
              color={value} 
              onChange={onChange}
            />
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-2"
              placeholder="#000000"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
