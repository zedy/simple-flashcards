import z from 'zod';

  export const SetCreationSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(16, "Name must be at most 16 characters"),
    icon: z.string()
  });
  export type SetCreationSchemaDTO = z.infer<typeof SetCreationSchema>;