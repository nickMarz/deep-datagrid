import { parse } from 'csv-parse/sync';
import fs from 'fs';

interface CsvToJsonOptions {
  /**
   * Whether to use the first row as headers
   * @default true
   */
  useHeaders?: boolean;
  /**
   * Custom headers to use instead of the first row
   */
  headers?: string[];
  /**
   * Whether to trim whitespace from values
   * @default true
   */
  trim?: boolean;
  /**
   * Whether to convert empty strings to null
   * @default true
   */
  emptyToNull?: boolean;
  /**
   * Whether to skip empty rows
   * @default true
   */
  skipEmpty?: boolean;
}

/**
 * Converts a CSV file to an array of JSON objects
 * @param filePath Path to the CSV file
 * @param options Configuration options
 * @returns Array of objects where keys are column headers and values are row values
 */
export function csvToJson<T extends Record<string, any>>(
  filePath: string,
  options: CsvToJsonOptions = {}
): T[] {
  const {
    useHeaders = true,
    headers,
    trim = true,
    emptyToNull = true,
    skipEmpty = true,
  } = options;

  try {
    // Read the CSV file
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Parse CSV with options
    const records = parse(fileContent, {
      columns: useHeaders ? (headers || true) : false,
      skip_empty_lines: skipEmpty,
      trim: trim,
    });

    // Process the records
    return records.map((record: any) => {
      if (emptyToNull) {
        // Convert empty strings to null
        Object.keys(record).forEach((key) => {
          if (record[key] === '') {
            record[key] = null;
          }
        });
      }
      return record as T;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to convert CSV to JSON: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Converts a CSV string to an array of JSON objects
 * @param csvContent CSV content as string
 * @param options Configuration options
 * @returns Array of objects where keys are column headers and values are row values
 */
export function csvStringToJson<T extends Record<string, any>>(
  csvContent: string,
  options: CsvToJsonOptions = {}
): T[] {
  const {
    useHeaders = true,
    headers,
    trim = true,
    emptyToNull = true,
    skipEmpty = true,
  } = options;

  try {
    // Parse CSV with options
    const records = parse(csvContent, {
      columns: useHeaders ? (headers || true) : false,
      skip_empty_lines: skipEmpty,
      trim: trim,
    });

    // Process the records
    return records.map((record: any) => {
      if (emptyToNull) {
        // Convert empty strings to null
        Object.keys(record).forEach((key) => {
          if (record[key] === '') {
            record[key] = null;
          }
        });
      }
      return record as T;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to convert CSV string to JSON: ${error.message}`);
    }
    throw error;
  }
}
