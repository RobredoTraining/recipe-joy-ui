import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export interface SearchBarProps {
  onSearch: (q: string) => void;
  value?: string;   
  delay?: number;   
}

export const SearchBar = ({ onSearch, value = "", delay = 500 }: SearchBarProps) => {
  const [text, setText] = useState(value);

  // sincroniza si cambia value desde fuera
  useEffect(() => setText(value), [value]);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => onSearch(text), delay);
    return () => clearTimeout(t);
  }, [text, delay, onSearch]);

  return (
    <Input
      placeholder="Busca por título, descripción o ingrediente…"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
};
