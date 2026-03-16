import { z } from 'zod';
import texts from '../config/texts.json';

export const phoneSchema = z.object({
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, texts.validacao.telefoneInvalido),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;
