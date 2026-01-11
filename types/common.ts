import type { ComponentProps, FC, PropsWithChildren } from "react";

// oxlint-disable-next-line no-explicit-any
export type Function = (...args: any) => any;

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

export type IsAny<T> = IfAny<T, true, never>;

export type IsUnknown<T, Y, N = T> = IsAny<T> extends never ? (unknown extends T ? Y : N) : N;

export type OmitDiscriminatedUnion<T, K> = {
  // oxlint-disable-next-line no-explicit-any
  [P in keyof T as Exclude<P, K & keyof any>]: T[P];
};

export type HasRequiredProperty<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K;
}[keyof T];

// oxlint-disable-next-line no-explicit-any
export type IsRequiredChildrenProperty<T extends FC<PropsWithChildren<any>>, Y, N> =
  HasRequiredProperty<Omit<ComponentProps<T>, "children">> extends never ? Y : N;
