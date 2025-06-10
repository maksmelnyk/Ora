import { useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  FileUpload,
  FormGroup,
  Input,
  Select,
  Textarea,
} from "@/common/components";
import {
  generateDurationOptions,
  getInitialLessonData,
  getInitialModuleData,
  ProductField,
} from "../../utils";
import { LessonFormData, ModuleFormData, ProductFormData } from "../../schemas";

interface CurriculumSectionProps {
  // add something later
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const modules = watch(ProductField.Modules) || [];

  const addModule = useCallback(() => {
    const newModules = [...modules, getInitialModuleData()];
    return newModules;
  }, [modules]);

  const deleteModule = useCallback(
    (moduleId: string) => {
      return modules.filter((module) => module.id !== moduleId);
    },
    [modules]
  );

  const updateModule = useCallback(
    (moduleId: string, field: keyof ModuleFormData, value: any) => {
      return modules.map((module) =>
        module.id === moduleId ? { ...module, [field]: value } : module
      );
    },
    [modules]
  );

  const addLesson = useCallback(
    (moduleId: string) => {
      return modules.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: [...module.lessons, getInitialLessonData()],
          };
        }
        return module;
      });
    },
    [modules]
  );

  const deleteLesson = useCallback(
    (moduleId: string, lessonId: string) => {
      return modules.map((module) => {
        if (module.id === moduleId && module.lessons.length > 1) {
          return {
            ...module,
            lessons: module.lessons.filter((lesson) => lesson.id !== lessonId),
          };
        }
        return module;
      });
    },
    [modules]
  );

  const updateLesson = useCallback(
    (
      moduleId: string,
      lessonId: string,
      field: keyof LessonFormData,
      value: any
    ) => {
      return modules.map((module) => {
        if (module.id === moduleId) {
          return {
            ...module,
            lessons: module.lessons.map((lesson) =>
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            ),
          };
        }
        return module;
      });
    },
    [modules]
  );

  const getModuleIndex = (index: number, field: string) =>
    `modules.${index}.${field}`;
  const getLessonIndex = (
    moduleIndex: number,
    lessonIndex: number,
    field: string
  ) => `modules.${moduleIndex}.lessons.${lessonIndex}.${field}`;

  return (
    <Controller
      name="modules"
      control={control}
      render={({ field }) => (
        <div className="space-y-6">
          {field.value?.map((module, moduleIndex) => (
            <Card key={module.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="ora-subheading text-lg text-ora-navy">
                      Module {moduleIndex + 1}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => {
                        const newModules = deleteModule(module.id);
                        field.onChange(newModules);
                      }}
                      className="text-ora-gray hover:text-ora-error hover:bg-ora-error/10"
                      disabled={field.value?.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <FormGroup
                    label="Module Title"
                    htmlFor={getModuleIndex(moduleIndex, "title")}
                    error={errors.modules?.[moduleIndex]?.title?.message}
                    required
                    helperText="This field can hold a maximum of 100 symbols."
                  >
                    <Input
                      value={module.title}
                      onChange={(e) => {
                        const newModules = updateModule(
                          module.id,
                          "title",
                          e.target.value
                        );
                        field.onChange(newModules);
                      }}
                      error={errors.modules?.[moduleIndex]?.title?.message}
                      required
                    />
                  </FormGroup>

                  <FormGroup
                    label="Module description"
                    htmlFor={getModuleIndex(moduleIndex, "description")}
                    error={errors.modules?.[moduleIndex]?.description?.message}
                    required
                    helperText="Provide a relevant description for this module, outlining its key topics, learning objectives, and the skills students will develop."
                  >
                    <Textarea
                      value={module.description}
                      onChange={(e) => {
                        const newModules = updateModule(
                          module.id,
                          "description",
                          e.target.value
                        );
                        field.onChange(newModules);
                      }}
                      rows={3}
                      error={
                        errors.modules?.[moduleIndex]?.description?.message
                      }
                      required
                    />
                  </FormGroup>

                  <div className="space-y-4">
                    <h4 className="ora-subheading text-base text-ora-navy">
                      Lessons
                    </h4>

                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id}>
                        <div className="flex items-start justify-between mb-4">
                          <h5 className="ora-subheading text-sm text-ora-navy">
                            Lesson {lessonIndex + 1}
                          </h5>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => {
                              const newModules = deleteLesson(
                                module.id,
                                lesson.id
                              );
                              field.onChange(newModules);
                            }}
                            className="text-ora-gray hover:text-ora-error hover:bg-ora-error/10"
                            disabled={module.lessons.length === 1}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="lg:col-span-2">
                            <FormGroup
                              label="Lesson Title"
                              htmlFor={getLessonIndex(
                                moduleIndex,
                                lessonIndex,
                                "title"
                              )}
                              error={
                                errors.modules?.[moduleIndex]?.lessons?.[
                                  lessonIndex
                                ]?.title?.message
                              }
                              required
                              helperText="This field can hold a maximum of 100 symbols."
                            >
                              <Input
                                value={lesson.title}
                                onChange={(e) => {
                                  const newModules = updateLesson(
                                    module.id,
                                    lesson.id,
                                    "title",
                                    e.target.value
                                  );
                                  field.onChange(newModules);
                                }}
                                error={
                                  errors.modules?.[moduleIndex]?.lessons?.[
                                    lessonIndex
                                  ]?.title?.message
                                }
                                required
                              />
                            </FormGroup>
                          </div>
                          <FormGroup
                            label="Duration (minutes)"
                            htmlFor={getLessonIndex(
                              moduleIndex,
                              lessonIndex,
                              "durationMin"
                            )}
                            error={
                              errors.modules?.[moduleIndex]?.lessons?.[
                                lessonIndex
                              ]?.durationMin?.message
                            }
                            required
                            helperText="Lesson duration in minutes."
                          >
                            <Select
                              value={lesson.durationMin}
                              onChange={(e) => {
                                const newModules = updateLesson(
                                  module.id,
                                  lesson.id,
                                  "durationMin",
                                  parseInt(e.target.value) || 0
                                );
                                field.onChange(newModules);
                              }}
                              options={generateDurationOptions()}
                              error={
                                errors.modules?.[moduleIndex]?.lessons?.[
                                  lessonIndex
                                ]?.durationMin?.message
                              }
                              required
                            />
                          </FormGroup>
                        </div>

                        <div className="mt-4">
                          <Controller
                            name={
                              `modules.${moduleIndex}.lessons.${lessonIndex}.file` as const
                            }
                            control={control}
                            render={() => (
                              <FileUpload
                                label="Lesson File"
                                accept="video/mp4,application/pdf,.docx,.pptx"
                                maxSize={50}
                                onChange={(files) => {
                                  const newModules = updateLesson(
                                    module.id,
                                    lesson.id,
                                    "file",
                                    files?.[0] || null
                                  );
                                  field.onChange(newModules);
                                }}
                                hint="Upload lesson video or document"
                              />
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex w-1/3 gap-4">
                    <Button
                      variant="purple"
                      size="sm"
                      type="button"
                      onClick={() => {
                        const newModules = addLesson(module.id);
                        field.onChange(newModules);
                      }}
                      rightIcon={<Plus className="w-4 h-4" />}
                      className="flex-1/2"
                    >
                      Add Lesson
                    </Button>
                    <Button
                      variant="orange"
                      size="sm"
                      type="button"
                      onClick={() => {
                        const newModules = addModule();
                        field.onChange(newModules);
                      }}
                      rightIcon={<Plus className="w-4 h-4" />}
                      className="flex-1/2"
                    >
                      Add Module
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || []}
        </div>
      )}
    />
  );
};

export default CurriculumSection;
