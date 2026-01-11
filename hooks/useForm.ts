import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import {
  type BrowserNativeObject,
  type DefaultValues,
  type ExtractObjects,
  type FieldValues,
  type NestedValue,
  type UseFormProps as UseReactHookFormProps,
  useForm as useReactHookForm,
} from "react-hook-form";
import type { z } from "zod";

type DeepNullablePartial<T> = T extends BrowserNativeObject | NestedValue
  ? T
  : { [K in keyof T]?: ExtractObjects<T[K]> extends never ? T[K] | null : DeepNullablePartial<T[K]> };

type AsyncDefaultValues<TFieldValues> = (payload?: unknown) => Promise<TFieldValues>;

type NullableDefaultValues<TFieldValues> =
  TFieldValues extends AsyncDefaultValues<TFieldValues>
    ? DeepNullablePartial<Awaited<TFieldValues>>
    : DeepNullablePartial<TFieldValues>;

export type UseFormResolverProps<TFieldValues extends FieldValues, TTransformedValues = TFieldValues> =
  | { zodSchema: z.ZodType<TTransformedValues, TFieldValues>; resolver?: never }
  | { zodSchema?: never };

export type UseFormProps<TFieldValues extends FieldValues, TContext, TTransformedValues = TFieldValues> = Omit<
  UseReactHookFormProps<TFieldValues, TContext, TTransformedValues>,
  "defaultValues"
> & { defaultValues?: NullableDefaultValues<TFieldValues> | AsyncDefaultValues<TFieldValues> };

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  // oxlint-disable-next-line no-explicit-any
  TContext = any,
  TTransformedValues = TFieldValues,
>({
  resolver,
  zodSchema,
  defaultValues,
  ...props
}: UseFormProps<TFieldValues, TContext, TTransformedValues> & UseFormResolverProps<TFieldValues, TTransformedValues>) {
  const formResolver = useMemo(
    () => resolver ?? (zodSchema ? zodResolver(zodSchema) : undefined),
    [resolver, zodSchema]
  );

  return useReactHookForm<TFieldValues, TContext, TTransformedValues>({
    ...props,
    resolver: formResolver,
    defaultValues: defaultValues as DefaultValues<TFieldValues> | AsyncDefaultValues<TFieldValues>,
  });
}
