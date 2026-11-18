import Papa from 'papaparse';
import { toCsv, downloadFile } from './csv';

export const parseCsvFile = (file) =>
  new Promise((resolve, reject) =>
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: resolve,
      error: reject,
    })
  );

export const downloadTemplate = (name, columns, sample) =>
  downloadFile(`${name}_template.csv`, toCsv([columns.map((c) => c.key), ...sample]), 'text/csv;charset=utf-8');
