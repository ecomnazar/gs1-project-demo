import { z } from "zod";

export const CreateProductSchema = z.object({
  barcodeType: z.enum(["EAN-13", "EAN-8"]),
  manufacturerId: z.string().min(1, "Выберите производителя"),
  name: z.string().min(1, "Введите наименование товара"),
  brand: z.string().min(1, "Введите бренд"),
  weight: z.string().min(1, "Введите массу/объём"),
  unit: z.enum(["кг", "г", "л", "мл", "шт"]),
  packaging: z.string().min(1, "Введите тип упаковки"),
  shelfLife: z.string().optional(),
  isFoodProduct: z.boolean().optional(),
});

export type ICreateProduct = z.infer<typeof CreateProductSchema>;
