import { Controller, useFormContext, UseFormSetValue } from "react-hook-form";
import {
  FileUpload,
  FormGroup,
  Input,
  LanguageAutocomplete,
  Select,
  SelectOption,
} from "@/common/components";
import { CategoryResponse } from "../../types";
import {
  generateDurationOptions,
  getProductLevelOptions,
  getProductTypeOptions,
  ProductField,
} from "../../utils";
import { ProductFormData } from "../../schemas";

interface DetailsSectionProps {
  categories: CategoryResponse[];
  requiresParticipants: boolean;
  requiresSessionDuration: boolean;
}

export const DetailsSection: React.FC<DetailsSectionProps> = ({
  categories,
  requiresParticipants,
  requiresSessionDuration,
}) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<ProductFormData>();

  const categoryId = watch(ProductField.CategoryId);

  const categoriesWithSubcategories = categories
    .filter((cat) => cat.subCategories?.length > 0)
    .map((cat) => ({
      id: String(cat.id),
      name: cat.name,
      subCategories: cat.subCategories.map((sub) => ({
        id: String(sub.id),
        name: sub.name,
      })),
    }));

  const currentCategory =
    categoriesWithSubcategories.find((cat) => cat.id === categoryId) ||
    categoriesWithSubcategories[0];

  const categoryOptions: SelectOption[] = categoriesWithSubcategories.map(
    (cat) => ({
      value: cat.id,
      label: cat.name,
    })
  );

  const productTypes: SelectOption[] = getProductTypeOptions().map((type) => ({
    value: type.value,
    label: type.label,
  }));

  const subCategoryOptions: SelectOption[] =
    currentCategory?.subCategories?.map((sub) => ({
      value: sub.id,
      label: sub.name,
    })) || [];

  function handleCategoryUpdate(
    value: string,
    categoriesWithSubcategories: {
      id: string;
      name: string;
      subCategories: { id: string; name: string }[];
    }[],
    setValue: UseFormSetValue<ProductFormData>
  ) {
    const newCategoryId = value;
    const category = categoriesWithSubcategories.find(
      (cat) => String(cat.id) === newCategoryId
    );
    const firstSub = category?.subCategories?.[0];

    if (firstSub) {
      setValue("subCategoryId", firstSub.id);
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormGroup
          label="Product type"
          htmlFor="type"
          error={errors.type?.message}
          required
        >
          <Select
            {...register(ProductField.Type, { valueAsNumber: true })}
            options={productTypes}
            error={errors.type?.message}
            required
          />
        </FormGroup>
        <FormGroup
          label="Difficulty level"
          htmlFor="level"
          error={errors.level?.message}
          required
        >
          <Select
            {...register(ProductField.Level, { valueAsNumber: true })}
            options={getProductLevelOptions()}
            error={errors.level?.message}
            required
          />
        </FormGroup>
        <FormGroup
          label="Category"
          htmlFor="categoryId"
          error={errors.categoryId?.message}
          required
        >
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={categoryOptions}
                placeholder="Select category"
                error={errors.categoryId?.message}
                required
                onChange={(e) => {
                  field.onChange(e);
                  handleCategoryUpdate(
                    e.target.value,
                    categoriesWithSubcategories,
                    setValue
                  );
                }}
              />
            )}
          />
        </FormGroup>
        <FormGroup
          label="Subcategory"
          htmlFor="subCategoryId"
          error={errors.subCategoryId?.message}
          required
        >
          <Select
            {...register(ProductField.SubCategoryId)}
            options={subCategoryOptions}
            placeholder="Select subcategory"
            disabled={!categoryId}
            error={errors.subCategoryId?.message}
            required
          />
        </FormGroup>
        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <LanguageAutocomplete
              value={field.value}
              onChange={field.onChange}
              label="Select language"
              error={errors.language?.message}
              variant="default"
              required
            />
          )}
        />
        <FormGroup
          label="Price"
          htmlFor="price"
          error={errors.price?.message}
          required
        >
          <Input
            type="text"
            inputMode="decimal"
            pattern="^\d*\.?\d{0,2}$"
            {...register(ProductField.Price)}
            error={errors.price?.message}
            onInput={(e) => {
              const value = e.currentTarget.value;
              if (!/^\d*\.?\d{0,2}$/.test(value)) {
                e.currentTarget.value = value.slice(0, -1);
              }
            }}
            required
          />
        </FormGroup>
        {requiresSessionDuration && (
          <FormGroup
            label="Session duration"
            htmlFor="durationMin"
            error={errors.durationMin?.message}
            required
          >
            <Select
              {...register(ProductField.DurationMin, { valueAsNumber: true })}
              options={generateDurationOptions()}
              error={errors.durationMin?.message}
              required
              disabled={!requiresSessionDuration}
            />
          </FormGroup>
        )}
        {requiresParticipants && (
          <FormGroup
            label="Number of participants"
            htmlFor="maxParticipants"
            error={errors.maxParticipants?.message}
            required
          >
            <Input
              type="text"
              inputMode="numeric"
              pattern="\\d*"
              {...register(ProductField.MaxParticipants, {
                valueAsNumber: true,
              })}
              onInput={(e) => {
                const value = e.currentTarget.value;
                if (!/^\d*$/.test(value)) {
                  e.currentTarget.value = value.slice(0, -1);
                }
              }}
              error={errors.maxParticipants?.message}
              disabled={!requiresParticipants}
              required
            />
          </FormGroup>
        )}
      </div>
      <FormGroup
        label="Product Title"
        htmlFor="title"
        error={errors.title?.message}
        required
        helperText="This field can hold a maximum of 100 symbols."
      >
        <Input
          {...register(ProductField.Title)}
          error={errors.title?.message}
          required
        />
      </FormGroup>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Controller
            name="imageFile"
            control={control}
            render={({ field }) => (
              <FileUpload
                accept="image/jpeg,image/png"
                maxSize={5}
                onChange={(files) => field.onChange(files?.[0] || null)}
              />
            )}
          />
        </div>

        <div className="lg:col-span-2">
          <h3 className="ora-body text-lg mb-2">Template Image*</h3>
          <div className="space-y-1 ora-body text-ora-gray text-sm">
            <p>
              Purpose: This image serves as the main visual representation of
              your course It will be displayed on the product listing page and
              in promotional materials.
            </p>
            <p>
              <strong>Recommended Size:</strong> 1200x600px
            </p>
            <p>
              <strong>File Format:</strong> JPEG or PNG
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Controller
            name="videoFile"
            control={control}
            render={({ field }) => (
              <FileUpload
                accept="video/mp4"
                maxSize={100}
                onChange={(files) => field.onChange(files?.[0] || null)}
              />
            )}
          />
        </div>

        <div className="lg:col-span-2">
          <h3 className="ora-body text-lg mb-2">Intro Video*</h3>
          <div className="space-y-3 ora-body text-ora-gray text-sm">
            <p>
              Purpose: This video provides an overview of your course,
              introducing students to your teaching style, course structure, and
              learning objectives
            </p>
            <p>
              <strong>File Format:</strong> MP4
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
