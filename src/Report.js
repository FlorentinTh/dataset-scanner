import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';

import TypeHelper from './helpers/TypeHelper.js';
import { Tags, ConsoleHelper } from './helpers/ConsoleHelper.js';
import ProgramHelper from './helpers/ProgramHelper.js';
import { ScannerType } from './Scanner.js';

class Report {
  #stream;
  #path;
  #total;

  get path() {
    return this.#path;
  }

  get total() {
    return this.#total;
  }

  constructor(filename = 'report.log') {
    if (!TypeHelper.isString(filename)) {
      ConsoleHelper.printMessage(Tags.ERROR, `filename must be a string`);
      process.exit(1);
    }

    this.#path = path.join(ProgramHelper.getRootPath(), filename);
    this.#stream = fs.createWriteStream(this.#path, { flags: 'a' });
    this.#total = 0;
  }

  write(scannerType, result) {
    if (!Object.values(ScannerType).includes(scannerType)) {
      ConsoleHelper.printMessage(Tags.ERROR, `scanner parameter is not a Scanner object`);
      process.exit(1);
    }

    if (!TypeHelper.isArray(result)) {
      ConsoleHelper.printMessage(Tags.ERROR, `result must be an array`);
      process.exit(1);
    }

    const length = result.length;
    this.#total += length;

    if (length > 0) {
      let msg = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] ${length} error`;

      if (length > 1) {
        msg += `s`;
      }

      msg += ` found in ${scannerType}:\n`;

      this.#stream.write(msg);

      for (const path of result) {
        this.#stream.write(`\t => ${path}\n`);
      }

      this.#stream.write(`\n`);
    }
  }

  noError() {
    const msg = `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] No errors found`;
    this.#stream.write(`${msg}\n\n`);
  }
}

export default Report;
