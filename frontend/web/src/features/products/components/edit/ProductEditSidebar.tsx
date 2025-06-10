import {
  Card,
  CardContent,
  Sidebar,
  SidebarSection,
} from "@/common/components";
import { cn } from "@/common/utils";
import {
  EDIT_PRODUCT_SECTION_LABELS,
  EditProductFormSection,
} from "../../constants";

interface ProductEditSidebarProps {
  currentSection: EditProductFormSection;
  progress: number;
  availableSections: EditProductFormSection[];
  onSectionChange: (section: EditProductFormSection) => void;
}

export const ProductEditSidebar: React.FC<ProductEditSidebarProps> = ({
  currentSection,
  progress,
  availableSections,
  onSectionChange,
}) => {
  return (
    <div className="space-y-2">
      <Sidebar>
        {availableSections.map((section) => {
          const isActive = currentSection === section;

          return (
            <SidebarSection
              key={section}
              title=""
              defaultOpen={true}
              collapsible={false}
            >
              <button
                onClick={() => onSectionChange(section)}
                className={cn("text-ora-gray focus:outline-none")}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="ora-subheading">
                  {EDIT_PRODUCT_SECTION_LABELS[section]}
                </span>
              </button>
            </SidebarSection>
          );
        })}
      </Sidebar>
      <Card className="mb-6 bg-ora-teal/20">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="ora-subheading text-sm text-ora-navy">
                Progress Bar
              </span>
              <span className="ora-heading text-lg text-ora-teal">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-ora-bg rounded-full h-3">
              <div
                className="bg-ora-teal h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductEditSidebar;
