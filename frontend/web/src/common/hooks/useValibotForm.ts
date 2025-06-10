import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";

export function useValibotForm<TSchema extends v.BaseSchema<any, any, any>>(
  schema: TSchema,
  defaultValues?: v.InferInput<TSchema>
) {
  return useForm<v.InferInput<TSchema>>({
    resolver: valibotResolver(schema),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });
}
