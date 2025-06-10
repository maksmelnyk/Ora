import { Globe, X } from "lucide-react";
import { useLanguageAutocomplete } from "@/common/hooks";
import { cn, getLanguages } from "@/common/utils";
import Input from "../ui/Input";
import LanguageDropdown from "../ui/LanguageDropdown";
import { useId, useMemo } from "react";
import FormGroup from "./FormGroup";

export interface LanguageAutocompleteProps {
  value?: string;
  onChange: (languageCode: string | undefined) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  showLanguageCode?: boolean;
  maxSuggestions?: number;
  variant?: "default" | "search";
}

export const LanguageAutocomplete: React.FC<LanguageAutocompleteProps> = ({
  value,
  onChange,
  className,
  error,
  label,
  placeholder,
  required = false,
  disabled = false,
  showLanguageCode = true,
  maxSuggestions = 12,
  variant = "search",
}) => {
  const languages = useMemo(() => getLanguages(), []);
  const id = useId();

  const {
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
  } = useLanguageAutocomplete({
    value,
    onChange,
    languages,
    maxSuggestions,
    disabled,
  });

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <FormGroup
          label={label}
          htmlFor="language-selection"
          required
          className="mb-0"
        >
          <Input
            id={id}
            ref={inputRef}
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            error={error}
            variant={variant}
            leftIcon={<Globe className="w-4 h-4" />}
            rightIcon={
              selectedLanguage &&
              !disabled && (
                <button
                  onClick={handleClear}
                  type="button"
                  tabIndex={-1}
                  aria-label="Clear language selection"
                >
                  <X className="w-4 h-4" />
                </button>
              )
            }
            className="w-full"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            role="combobox"
            required={required}
          />
        </FormGroup>
      </div>

      <LanguageDropdown
        isOpen={isOpen && !disabled}
        languages={filteredLanguages}
        selectedLanguage={selectedLanguage}
        highlightedIndex={highlightedIndex}
        showLanguageCode={showLanguageCode}
        onLanguageSelect={handleLanguageSelect}
        onMouseEnter={setHighlightedIndex}
        listRef={listRef}
      />
    </div>
  );
};

export default LanguageAutocomplete;
