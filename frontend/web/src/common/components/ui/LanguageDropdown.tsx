import { Language } from "@/common/types/language";
import { cn } from "@/common/utils";

interface LanguageDropdownProps {
  isOpen: boolean;
  languages: Language[];
  selectedLanguage: Language | null;
  highlightedIndex: number;
  showLanguageCode: boolean;
  onLanguageSelect: (language: Language) => void;
  onMouseEnter: (index: number) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  isOpen,
  languages,
  selectedLanguage,
  highlightedIndex,
  showLanguageCode,
  onLanguageSelect,
  onMouseEnter,
  listRef,
}) => {
  if (!isOpen) return null;

  return (
    <div
      ref={listRef}
      className="absolute z-50 w-full mt-1 bg-white border border-ora-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto"
      role="listbox"
      aria-label="Language options"
    >
      {languages.length > 0 ? (
        languages.map((language, index) => (
          <button
            key={language.code}
            onClick={() => onLanguageSelect(language)}
            className={cn(
              "w-full px-3 py-2 text-left text-sm ora-transition focus:outline-none",
              index === highlightedIndex
                ? "bg-ora-highlight/10 text-ora-highlight"
                : "hover:bg-ora-gray-50",
              selectedLanguage?.code === language.code &&
                "bg-ora-highlight/5 text-ora-highlight"
            )}
            role="option"
            aria-selected={selectedLanguage?.code === language.code}
            onMouseEnter={() => onMouseEnter(index)}
          >
            <div className="flex justify-between items-center">
              <span className="truncate">{language.name}</span>
              {showLanguageCode && (
                <span className="text-ora-gray text-xs font-mono ml-2 flex-shrink-0">
                  {language.code}
                </span>
              )}
            </div>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-ora-gray">
          No languages found
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
