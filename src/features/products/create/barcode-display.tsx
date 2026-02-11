"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import type { GTINGenerationResult } from "@/shared/types/product";

interface BarcodeDisplayProps {
  result: GTINGenerationResult;
}

export function BarcodeDisplay({ result }: BarcodeDisplayProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && result.gtin) {
      try {
        JsBarcode(svgRef.current, result.gtin, {
          format: "EAN13",
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 16,
          font: "monospace",
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000",
        });
      } catch {
        // Invalid barcode format
      }
    }
  }, [result.gtin]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <svg ref={svgRef} />
      </div>

      <div className="w-full space-y-3">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Структура кода
          </p>
          <div className="flex items-center gap-1 font-mono text-lg">
            <span className="rounded bg-blue-100 px-2 py-1 text-blue-700" title="Префикс страны (Туркменистан)">
              {result.breakdown.prefix}
            </span>
            <span className="rounded bg-emerald-100 px-2 py-1 text-emerald-700" title="GCP (без префикса)">
              {result.breakdown.gcpPart}
            </span>
            {result.breakdown.sequencePart && (
              <span className="rounded bg-amber-100 px-2 py-1 text-amber-700" title="Порядковый номер товара">
                {result.breakdown.sequencePart}
              </span>
            )}
            <span className="rounded bg-rose-100 px-2 py-1 text-rose-700" title="Контрольное число">
              {result.breakdown.checkDigitPart}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-200" />
              Префикс (483)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-200" />
              GCP
            </span>
            {result.breakdown.sequencePart && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-200" />
                Номер товара
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-200" />
              Контрольное число
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Тип штрихкода</p>
            <p className="font-medium">{result.barcodeType}</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">GTIN</p>
            <p className="font-mono font-medium">{result.gtin}</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">GCP</p>
            <p className="font-mono font-medium">{result.gcp}</p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <p className="text-xs text-muted-foreground">Контрольное число</p>
            <p className="font-mono font-medium">{result.checkDigit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
