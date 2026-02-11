"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import {
  IconBarcode,
  IconPlus,
  IconInfoCircle,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CreateProductSchema, type ICreateProduct } from "./create-product.model";
import { BarcodeDisplay } from "./barcode-display";
import { generateGTIN, getMaxProducts, getSequenceDigits } from "@/shared/lib/gtin";
import type { Manufacturer, GTINGenerationResult } from "@/shared/types/product";

const MOCK_MANUFACTURERS: Manufacturer[] = [
  {
    id: "1",
    name: 'ИП "Берекет"',
    gcp: "483900001",
    gcpType: 9,
    availableBarcodes: 997,
    usedBarcodes: 3,
    nextSequenceNumber: 4,
  },
  {
    id: "2",
    name: 'ХК "Röwşen"',
    gcp: "4839000020",
    gcpType: 10,
    availableBarcodes: 85,
    usedBarcodes: 15,
    nextSequenceNumber: 16,
  },
  {
    id: "3",
    name: 'ОАО "Türkmen süýt"',
    gcp: "48390000",
    gcpType: 8,
    availableBarcodes: 9950,
    usedBarcodes: 50,
    nextSequenceNumber: 51,
  },
  {
    id: "4",
    name: 'ИП "Altyn Asyr Food"',
    gcp: "48390000300",
    gcpType: 11,
    availableBarcodes: 5,
    usedBarcodes: 5,
    nextSequenceNumber: 6,
  },
];

export function CreateProduct() {
  const [open, setOpen] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GTINGenerationResult | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ICreateProduct>({
    resolver: standardSchemaResolver(CreateProductSchema),
    defaultValues: {
      barcodeType: "EAN-13",
      unit: "шт",
      isFoodProduct: false,
    },
  });

  const isFoodProduct = watch("isFoodProduct");
  const manufacturerId = watch("manufacturerId");

  useEffect(() => {
    const manufacturer = MOCK_MANUFACTURERS.find((m) => m.id === manufacturerId);
    setSelectedManufacturer(manufacturer || null);
    setGeneratedResult(null);
  }, [manufacturerId]);

  const handleGenerate = () => {
    if (!selectedManufacturer) {
      toast.error("Выберите производителя");
      return;
    }

    if (selectedManufacturer.availableBarcodes <= 0) {
      toast.error("У производителя закончились доступные штрихкоды");
      return;
    }

    try {
      const result = generateGTIN(
        selectedManufacturer.gcp,
        selectedManufacturer.gcpType,
        selectedManufacturer.nextSequenceNumber
      );
      setGeneratedResult(result);
      toast.success("GTIN успешно сгенерирован");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка генерации");
    }
  };

  const onSubmit = handleSubmit((data: ICreateProduct) => {
    if (!generatedResult) {
      toast.error("Сначала сгенерируйте штрихкод");
      return;
    }

    toast.promise(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Product saved:", { ...data, gtin: generatedResult.gtin });
      },
      {
        loading: "Сохранение товара...",
        success: "Товар сохранён со статусом «Ожидает проверки»",
        error: "Ошибка сохранения",
      }
    );

    setOpen(false);
    setGeneratedResult(null);
    setSelectedManufacturer(null);
    reset();
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setGeneratedResult(null);
          setSelectedManufacturer(null);
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="size-4" />
          Добавить товар EAN-13
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <IconBarcode className="size-5 text-primary" />
            Добавление товара и генерация GTIN
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
            {/* Left column: Form */}
            <div className="space-y-5">
              {/* Manufacturer selection */}
              <div className="space-y-2">
                <Label>Производитель *</Label>
                <Controller
                  control={control}
                  name="manufacturerId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите производителя" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_MANUFACTURERS.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <div className="flex items-center justify-between gap-3">
                              <span>{m.name}</span>
                              <Badge variant="outline" className="text-xs font-mono">
                                GCP-{m.gcpType}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.manufacturerId && (
                  <p className="text-xs text-destructive">{errors.manufacturerId.message}</p>
                )}

                {selectedManufacturer && (
                  <div className="flex flex-wrap gap-2 rounded-lg border border-dashed bg-muted/30 p-3 text-xs">
                    <span>
                      GCP: <strong className="font-mono">{selectedManufacturer.gcp}</strong>
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span>
                      Тип: <strong>GCP-{selectedManufacturer.gcpType}</strong>
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span>
                      Доступно:{" "}
                      <strong className={selectedManufacturer.availableBarcodes <= 0 ? "text-destructive" : "text-emerald-600"}>
                        {selectedManufacturer.availableBarcodes}
                      </strong>
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span>
                      Макс. товаров:{" "}
                      <strong>{getMaxProducts(selectedManufacturer.gcpType).toLocaleString()}</strong>
                    </span>
                    <span className="text-muted-foreground">|</span>
                    <span>
                      Цифр в номере: <strong>{getSequenceDigits(selectedManufacturer.gcpType)}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Barcode type */}
              <div className="space-y-2">
                <Label>Тип штрихкода</Label>
                <Controller
                  control={control}
                  name="barcodeType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EAN-13">EAN-13 (стандартный)</SelectItem>
                        <SelectItem value="EAN-8">EAN-8 (сокращённый)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Product details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Наименование товара *</Label>
                  <Input
                    placeholder="Молоко пастеризованное 3.2%"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Бренд *</Label>
                  <Input placeholder="Название бренда" {...register("brand")} />
                  {errors.brand && (
                    <p className="text-xs text-destructive">{errors.brand.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Тип упаковки *</Label>
                  <Input placeholder="Тетра Пак, ПЭТ, стекло..." {...register("packaging")} />
                  {errors.packaging && (
                    <p className="text-xs text-destructive">{errors.packaging.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Масса / Объём *</Label>
                  <Input
                    placeholder="500"
                    {...register("weight")}
                  />
                  {errors.weight && (
                    <p className="text-xs text-destructive">{errors.weight.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Единица измерения</Label>
                  <Controller
                    control={control}
                    name="unit"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="кг">кг</SelectItem>
                          <SelectItem value="г">г</SelectItem>
                          <SelectItem value="л">л</SelectItem>
                          <SelectItem value="мл">мл</SelectItem>
                          <SelectItem value="шт">шт</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Food product toggle */}
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <input
                  type="checkbox"
                  id="isFoodProduct"
                  className="size-4 rounded border-input accent-primary"
                  {...register("isFoodProduct")}
                />
                <Label htmlFor="isFoodProduct" className="cursor-pointer text-sm font-normal">
                  Пищевой продукт (требуется срок хранения)
                </Label>
              </div>

              {isFoodProduct && (
                <div className="space-y-2">
                  <Label>Срок хранения</Label>
                  <Textarea
                    placeholder="12 месяцев при температуре от 0 до +6°C"
                    {...register("shelfLife")}
                  />
                </div>
              )}

              {/* Generate button */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleGenerate}
                  disabled={!selectedManufacturer || selectedManufacturer.availableBarcodes <= 0}
                >
                  <IconBarcode className="size-4" />
                  Сгенерировать GTIN
                </Button>

                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!generatedResult}
                >
                  <IconPlus className="size-4" />
                  Сохранить товар
                </Button>
              </div>

              {/* Info note */}
              <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700">
                <IconInfoCircle className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-medium">Алгоритм генерации GTIN-13:</p>
                  <p className="mt-1">
                    [483][GCP (N цифр)][Порядковый номер (M цифр)][Контрольное число].
                    Количество цифр N и M зависит от типа GCP. При сохранении товар
                    получит статус «Ожидает проверки» и квота уменьшится на 1.
                  </p>
                </div>
              </div>
            </div>

            {/* Right column: Barcode preview */}
            <div className="space-y-4">
              <div className="rounded-xl border bg-muted/20 p-5">
                <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                  Предпросмотр штрихкода
                </h3>
                {generatedResult ? (
                  <BarcodeDisplay result={generatedResult} />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-card py-16">
                    <IconBarcode className="size-12 text-muted-foreground/30" />
                    <p className="text-center text-sm text-muted-foreground">
                      Выберите производителя и нажмите
                      <br />
                      «Сгенерировать GTIN»
                    </p>
                  </div>
                )}
              </div>

              {generatedResult && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-amber-300 bg-amber-100 text-amber-700">
                      Ожидает проверки
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-amber-700">
                    После сохранения товар получит статус «Ожидает проверки».
                    Администратор GS1 проверит данные и подтвердит регистрацию.
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
