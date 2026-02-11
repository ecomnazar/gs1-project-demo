"use client";

import { useState } from "react";
import {
  IconBarcode,
  IconSearch,
  IconFilter,
  IconCheck,
  IconClock,
  IconX,
  IconEye,
} from "@tabler/icons-react";

import { SiteHeader } from "@/widgets/site-header";
import { CreateProduct } from "@/features/products/create/create-product.ui";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductStatus } from "@/shared/types/product";

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  gtin: string;
  barcodeType: string;
  manufacturer: string;
  status: ProductStatus;
  verifiedByGS1: boolean;
  createdAt: string;
}

const MOCK_PRODUCTS: ProductRow[] = [
  {
    id: "1",
    name: "Молоко пастеризованное 3.2%",
    brand: "Süýt",
    gtin: "4839000010013",
    barcodeType: "EAN-13",
    manufacturer: 'ОАО "Türkmen süýt"',
    status: "verified",
    verifiedByGS1: true,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Кефир 2.5% 500мл",
    brand: "Süýt",
    gtin: "4839000010020",
    barcodeType: "EAN-13",
    manufacturer: 'ОАО "Türkmen süýt"',
    status: "verified",
    verifiedByGS1: true,
    createdAt: "2026-01-18",
  },
  {
    id: "3",
    name: "Хлеб белый нарезной",
    brand: "Bereket",
    gtin: "4839000014011",
    barcodeType: "EAN-13",
    manufacturer: 'ИП "Берекет"',
    status: "pending",
    verifiedByGS1: false,
    createdAt: "2026-02-10",
  },
  {
    id: "4",
    name: "Масло подсолнечное 1л",
    brand: "Altyn",
    gtin: "4839000014028",
    barcodeType: "EAN-13",
    manufacturer: 'ИП "Берекет"',
    status: "pending",
    verifiedByGS1: false,
    createdAt: "2026-02-11",
  },
  {
    id: "5",
    name: "Сок яблочный 1л",
    brand: "Röwşen",
    gtin: "4839000020157",
    barcodeType: "EAN-13",
    manufacturer: 'ХК "Röwşen"',
    status: "rejected",
    verifiedByGS1: false,
    createdAt: "2026-02-05",
  },
  {
    id: "6",
    name: "Мука пшеничная в/с 2кг",
    brand: "Bereket",
    gtin: "4839000014035",
    barcodeType: "EAN-13",
    manufacturer: 'ИП "Берекет"',
    status: "verified",
    verifiedByGS1: true,
    createdAt: "2026-01-20",
  },
];

const statusConfig: Record<ProductStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof IconCheck }> = {
  verified: { label: "Подтверждён", variant: "default", icon: IconCheck },
  pending: { label: "Ожидает проверки", variant: "secondary", icon: IconClock },
  rejected: { label: "Отклонён", variant: "destructive", icon: IconX },
};

export default function GeneratePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.gtin.includes(search) ||
      p.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: MOCK_PRODUCTS.length,
    verified: MOCK_PRODUCTS.filter((p) => p.status === "verified").length,
    pending: MOCK_PRODUCTS.filter((p) => p.status === "pending").length,
    rejected: MOCK_PRODUCTS.filter((p) => p.status === "rejected").length,
  };

  return (
    <div>
      <SiteHeader pageName="Генерация штрихкодов">
        <CreateProduct />
      </SiteHeader>

      <div className="space-y-6 p-4 lg:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <IconBarcode className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Всего товаров</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100">
                <IconCheck className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.verified}</p>
                <p className="text-xs text-muted-foreground">Подтверждено</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
                <IconClock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">На проверке</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-rose-100">
                <IconX className="size-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-600">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Отклонено</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card>
          <CardContent className="p-0">
            <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, GTIN или производителю..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <IconFilter className="size-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все статусы</SelectItem>
                    <SelectItem value="verified">Подтверждённые</SelectItem>
                    <SelectItem value="pending">На проверке</SelectItem>
                    <SelectItem value="rejected">Отклонённые</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Товар
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      GTIN
                    </th>
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground md:table-cell">
                      Производитель
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Статус
                    </th>
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground lg:table-cell">
                      GS1
                    </th>
                    <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground sm:table-cell">
                      Дата
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Действие
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((product) => {
                    const config = statusConfig[product.status];
                    const StatusIcon = config.icon;
                    return (
                      <tr
                        key={product.id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm">
                            {product.gtin}
                          </code>
                        </td>
                        <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                          {product.manufacturer}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={config.variant} className="gap-1">
                            <StatusIcon className="size-3" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="hidden px-4 py-3 lg:table-cell">
                          {product.verifiedByGS1 ? (
                            <Badge variant="outline" className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-700">
                              <IconCheck className="size-3" />
                              Verified
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="hidden px-4 py-3 text-sm text-muted-foreground sm:table-cell">
                          {new Date(product.createdAt).toLocaleDateString("ru-RU")}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">
                            <IconEye className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <IconBarcode className="mx-auto size-10 text-muted-foreground/30" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Товары не найдены
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm explanation */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Алгоритм генерации GTIN (Приложение А, п. 6.3)
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-4">
                <p className="mb-2 font-mono text-sm">
                  GTIN-13: [483][GCP (N цифр)][Порядковый номер (M цифр)][Контрольное число]
                </p>
                <p className="text-xs text-muted-foreground">
                  Префикс страны 483 (Туркменистан) уже включён в GCP.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-3 py-2 text-left font-medium">Тип GCP</th>
                      <th className="px-3 py-2 text-left font-medium">Цифр в GCP</th>
                      <th className="px-3 py-2 text-left font-medium">Цифр в номере</th>
                      <th className="px-3 py-2 text-left font-medium">Макс. товаров</th>
                      <th className="px-3 py-2 text-left font-medium">Формат</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { type: 8, gcp: 8, seq: 4, max: "10 000", format: "GTIN-13" },
                      { type: 9, gcp: 9, seq: 3, max: "1 000", format: "GTIN-13" },
                      { type: 10, gcp: 10, seq: 2, max: "100", format: "GTIN-13" },
                      { type: 11, gcp: 11, seq: 1, max: "10", format: "GTIN-13" },
                      { type: 12, gcp: 12, seq: 0, max: "1", format: "GTIN-13" },
                    ].map((row) => (
                      <tr key={row.type} className="hover:bg-muted/20">
                        <td className="px-3 py-2 font-mono">GCP-{row.type}</td>
                        <td className="px-3 py-2">{row.gcp}</td>
                        <td className="px-3 py-2">{row.seq}</td>
                        <td className="px-3 py-2 font-medium">{row.max}</td>
                        <td className="px-3 py-2">
                          <Badge variant="outline">{row.format}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-medium">Пример:</p>
                <p className="mt-1">
                  Производитель с GCP типа 9 (GCP = 483900001) добавляет первый товар.
                  Порядковый номер = 001. Контрольное число рассчитывается по модулю-10.
                  Результат: <code className="rounded bg-blue-100 px-1.5 font-mono font-bold">4839000010013</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
