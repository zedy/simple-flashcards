import type {
  InfiniteData,
  QueryKey,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import type { Function, IsUnknown } from "@/types/common";
import type { ApplicationException, GeneralErrorCodes } from "@/utils/vendor/error-handling";

export type AppQueryOptions<
  TFunction extends Function,
  TData = Awaited<ReturnType<TFunction>>,
  TErrorCodes = GeneralErrorCodes,
> = Omit<
  UseQueryOptions<
    Awaited<ReturnType<TFunction>>,
    ApplicationException<TErrorCodes>,
    IsUnknown<TData, Awaited<ReturnType<TFunction>>>
  >,
  "queryKey" | "queryFn"
>;

export type AppMutationOptions<
  TFunction extends Function,
  TVariables = void,
  TData = Awaited<ReturnType<TFunction>>,
  TErrorCodes = GeneralErrorCodes,
> = Omit<UseMutationOptions<TData, ApplicationException<TErrorCodes>, TVariables>, "mutationKey" | "mutationFn">;

export type AppInfiniteQueryOptions<
  TFunction extends Function,
  TData = InfiniteData<Awaited<ReturnType<TFunction>>>,
  TErrorCodes = GeneralErrorCodes,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number,
> = Omit<
  UseInfiniteQueryOptions<
    Awaited<ReturnType<TFunction>>,
    ApplicationException<TErrorCodes>,
    IsUnknown<TData, InfiniteData<Awaited<ReturnType<TFunction>>>>,
    TQueryKey,
    TPageParam
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;
