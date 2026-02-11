import type { GCPType, BarcodeType, GTINGenerationResult } from "@/shared/types/product";

/**
 * Calculates the check digit for a GTIN using the Modulo 10 algorithm.
 * The check digit is the last digit of a GTIN.
 *
 * Algorithm:
 * 1. Starting from the rightmost digit (before check digit), alternate multipliers 3, 1, 3, 1...
 * 2. Sum all products
 * 3. Check digit = (10 - (sum % 10)) % 10
 */
export function calculateCheckDigit(digits: string): number {
  const nums = digits.split("").map(Number);
  let sum = 0;
  for (let i = nums.length - 1; i >= 0; i--) {
    const position = nums.length - i;
    const multiplier = position % 2 === 1 ? 3 : 1;
    sum += nums[i] * multiplier;
  }
  return (10 - (sum % 10)) % 10;
}

/**
 * Get the number of digits for the sequence number based on GCP type.
 *
 * GTIN-13 structure: [GCP (N digits)][Sequence (M digits)][Check digit]
 * Total = N + M + 1 = 13, so M = 12 - N
 *
 * GCP Type 8:  GCP=8 digits,  Seq=4 digits → GTIN-13
 * GCP Type 9:  GCP=9 digits,  Seq=3 digits → GTIN-13
 * GCP Type 10: GCP=10 digits, Seq=2 digits → GTIN-13
 * GCP Type 11: GCP=11 digits, Seq=1 digit  → GTIN-13
 * GCP Type 12: GCP=12 digits, Seq=0 digits → GTIN-13 (rare, only 1 product)
 */
export function getSequenceDigits(gcpType: GCPType): number {
  return 12 - gcpType;
}

/**
 * Get the maximum number of products a GCP type can support.
 */
export function getMaxProducts(gcpType: GCPType): number {
  const seqDigits = getSequenceDigits(gcpType);
  return seqDigits === 0 ? 1 : Math.pow(10, seqDigits);
}

/**
 * Format a sequence number with leading zeros to match the required length.
 */
export function formatSequenceNumber(sequenceNumber: number, gcpType: GCPType): string {
  const seqDigits = getSequenceDigits(gcpType);
  if (seqDigits === 0) return "";
  return sequenceNumber.toString().padStart(seqDigits, "0");
}

/**
 * Generates a GTIN (EAN-13) barcode for a product.
 *
 * @param gcp - The Global Company Prefix (includes country prefix 483)
 * @param gcpType - The type/length of the GCP (8, 9, 10, 11, or 12)
 * @param sequenceNumber - The product sequence number (starting from 1)
 * @returns GTINGenerationResult with the full GTIN and breakdown
 */
export function generateGTIN(
  gcp: string,
  gcpType: GCPType,
  sequenceNumber: number
): GTINGenerationResult {
  const maxProducts = getMaxProducts(gcpType);

  if (sequenceNumber < 1 || sequenceNumber > maxProducts) {
    throw new Error(
      `Порядковый номер должен быть от 1 до ${maxProducts} для GCP типа ${gcpType}`
    );
  }

  if (gcp.length !== gcpType) {
    throw new Error(
      `GCP должен содержать ${gcpType} цифр, получено ${gcp.length}`
    );
  }

  if (!gcp.startsWith("483")) {
    throw new Error("GCP должен начинаться с префикса страны 483 (Туркменистан)");
  }

  const formattedSeq = formatSequenceNumber(sequenceNumber, gcpType);
  const withoutCheck = gcp + formattedSeq;
  const checkDigit = calculateCheckDigit(withoutCheck);
  const gtin = withoutCheck + checkDigit.toString();

  const barcodeType: BarcodeType = "EAN-13";

  return {
    gtin,
    barcodeType,
    gcp,
    sequenceNumber: formattedSeq,
    checkDigit,
    breakdown: {
      prefix: "483",
      gcpPart: gcp.substring(3),
      sequencePart: formattedSeq,
      checkDigitPart: checkDigit.toString(),
    },
  };
}

/**
 * Validates a GTIN-13 check digit.
 */
export function validateGTIN(gtin: string): boolean {
  if (gtin.length !== 13 || !/^\d{13}$/.test(gtin)) {
    return false;
  }
  const withoutCheck = gtin.substring(0, 12);
  const expectedCheck = calculateCheckDigit(withoutCheck);
  return expectedCheck === parseInt(gtin[12], 10);
}
