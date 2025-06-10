import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Language } from "../types/language";
import { POPULAR_LANGUAGE_CODES } from "../constants/language";

interface UseLanguageAutocompleteProps {
  value?: string;
  onChange: (languageCode: string | undefined) => void;
  languages: Language[];
  maxSuggestions: number;
  disabled: boolean;
}

export const useLanguageAutocomplete = ({
  value,
  onChange,
  languages,
  maxSuggestions,
  disabled,
}: UseLanguageAutocompleteProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && languages.length > 0) {
      const language = languages.find((lang) => lang.code === value);
      if (language) {
        setSelectedLanguage(language);
        setInputValue(language.name);
      }
    } else if (!value) {
      setSelectedLanguage(null);
      setInputValue("");
    }
  }, [value, languages]);

  const filteredLanguages = useMemo(() => {
    if (!inputValue.trim()) {
      return languages
        .filter((lang) => POPULAR_LANGUAGE_CODES.includes(lang.code))
        .slice(0, Math.min(8, maxSuggestions));
    }

    const searchTerm = inputValue.toLowerCase().trim();
    const matches = languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchTerm) ||
        lang.code.toLowerCase().includes(searchTerm)
    );

    return matches
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (aName === searchTerm && bName !== searchTerm) return -1;
        if (bName === searchTerm && aName !== searchTerm) return 1;

        if (aName.startsWith(searchTerm) && !bName.startsWith(searchTerm))
          return -1;
        if (bName.startsWith(searchTerm) && !aName.startsWith(searchTerm))
          return 1;

        return aName.localeCompare(bName);
      })
      .slice(0, maxSuggestions);
  }, [inputValue, languages, maxSuggestions]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);
      setHighlightedIndex(-1);

      if (!newValue.trim()) {
        setSelectedLanguage(null);
        onChange(undefined);
      }
    },
    [onChange]
  );

  const handleLanguageSelect = useCallback(
    (language: Language) => {
      setSelectedLanguage(language);
      setInputValue(language.name);
      setIsOpen(false);
      setHighlightedIndex(-1);
      onChange(language.code);
    },
    [onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedLanguage(null);
      setInputValue("");
      onChange(undefined);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    },
    [onChange]
  );

  const handleInputFocus = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 150);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || filteredLanguages.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredLanguages.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredLanguages.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredLanguages.length
          ) {
            handleLanguageSelect(filteredLanguages[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
        case "Tab":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    },
    [isOpen, filteredLanguages, highlightedIndex, handleLanguageSelect]
  );

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  return {
    inputValue,
    isOpen,
    selectedLanguage,
    highlightedIndex,
    filteredLanguages,
    inputRef,
    listRef,
    handleInputChange,
    handleLanguageSelect,
    handleClear,
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
    setHighlightedIndex,
  };
};
