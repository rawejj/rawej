import dayjs from "dayjs";
import { toJalaali } from "jalaali-js";
import { JALALI_MONTHS } from "@/lib/constants";

export interface DateDisplayFormat {
  displayText: string;
  subText: string;
}

export interface TranslationFunction {
  (key: string): string;
}

/**
 * Format a Gregorian date to Jalali (Persian) calendar format
 * Returns: { displayText: "جمعه 23", subText: "آبان 1404" }
 */
export function formatDateJalali(
  dateValue: string,
  t: TranslationFunction,
): DateDisplayFormat {
  const d = dayjs(dateValue);
  const [year, month, dayNumGreg] = dateValue.split("-").map(Number);
  const jDate = toJalaali(year, month, dayNumGreg);

  const weekdays: Record<number, string> = {
    0: t("weekdays.sun"),
    1: t("weekdays.mon"),
    2: t("weekdays.tue"),
    3: t("weekdays.wed"),
    4: t("weekdays.thu"),
    5: t("weekdays.fri"),
    6: t("weekdays.sat"),
  };

  const weekday = weekdays[d.day()];
  const dayNum = jDate.jd.toString().padStart(2, "0");
  const monthNum = jDate.jm.toString().padStart(2, "0");
  const monthName =
    JALALI_MONTHS[monthNum as keyof typeof JALALI_MONTHS] || monthNum;
  const yearStr = jDate.jy.toString();

  return {
    displayText: `${weekday} ${dayNum}`,
    subText: `${monthName} ${yearStr}`,
  };
}

/**
 * Format a date label for non-Farsi languages
 * Splits label into main text and sub text if it has 3+ parts
 * Returns: { displayText: "Monday 23", subText: "November 2025" }
 */
export function formatDateGeneric(label: string): DateDisplayFormat {
  const trimmedLabel = label.trim();
  const parts = trimmedLabel.split(" ").filter(Boolean);

  if (parts.length >= 3) {
    return {
      displayText: `${parts[0]} ${parts[1]}`,
      subText: parts.slice(2).join(" "),
    };
  }

  return {
    displayText: trimmedLabel,
    subText: "",
  };
}

/**
 * Format a date based on language
 * For Farsi: converts to Jalali calendar
 * For others: parses the provided label
 */
export function formatDate(
  dateValue: string,
  label: string,
  language: string,
  t: TranslationFunction,
): DateDisplayFormat {
  if (language === "fa") {
    return formatDateJalali(dateValue, t);
  }

  return formatDateGeneric(label);
}
