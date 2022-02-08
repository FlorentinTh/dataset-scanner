import path from 'path';
import readdir from '@folder/readdir';
import clui from 'clui';
import chalk from 'chalk';

import Report from './Report.js';
import TypeHelper from './helpers/TypeHelper.js';
import { Tags, ConsoleHelper } from './helpers/ConsoleHelper.js';

export const ScannerType = {
  ALL: '*',
  USER_ID: 'UserId',
  SENSOR: 'Sensor',
  ACTIVITY: 'ActivityName',
  LABEL: 'Label'
};

export class Scanner {
  #input;
  #result;
  #report;

  constructor(input) {
    if (!TypeHelper.isString(input)) {
      ConsoleHelper.printMessage(Tags.ERROR, `input must be a string`);
      process.exit(1);
    }

    this.#input = path.normalize(input);
    this.#result = [];
    this.#report = new Report();
  }

  #reset() {
    if (this.#result.length > 0) {
      this.#result = [];
    }
  }

  async #checkUserId() {
    this.#reset();
    const onFile = file => {
      if (!file.isDirectory() && file.isFile()) {
        const splitPath = file.dirname.split('\\');
        const userId = splitPath[splitPath.length - 2];
        if (
          !(file.name.split('_')[0] === '00000000') &&
          !(file.name.split('_')[0] === userId)
        ) {
          this.#result.push(file.relative);
        }
      }
    };

    await this.#run(onFile);
    this.#report.write(ScannerType.USER_ID, this.#result);
  }

  async #checkSensor() {
    this.#reset();
    const onFile = file => {
      if (!file.isDirectory() && file.isFile()) {
        const sensors = ['AmbientSensors', 'Depth', 'IMU', 'RGBD', 'RGB', 'UWB'];

        if (!sensors.includes(file.name.split('_')[1])) {
          this.#result.push(file.relative);
        }
      }
    };

    await this.#run(onFile);
    this.#report.write(ScannerType.SENSOR, this.#result);
  }

  async #checkActivityName() {
    this.#reset();
    const onFile = file => {
      if (!file.isDirectory() && file.isFile()) {
        if (
          !(file.name.split('_')[0] === '00000000') &&
          !(file.folder === file.name.split('_')[2])
        ) {
          this.#result.push(file.relative);
        }
      }
    };

    await this.#run(onFile);
    this.#report.write(ScannerType.ACTIVITY, this.#result);
  }

  async #checkLabel() {
    this.#reset();
    const onFile = file => {
      if (!file.isDirectory() && file.isFile()) {
        const labels = [
          'Kitchen',
          'Livingroom',
          'Bedroom',
          'Diningroom',
          'Bathroom',
          'Entry',
          'Dinningroom'
        ];
        const splitFilename = file.name.split('_');

        if (
          !(splitFilename[0] === '00000000') &&
          !labels.includes(splitFilename[splitFilename.length - 1].split('.')[0])
        ) {
          this.#result.push(file.relative);
        }
      }
    };

    await this.#run(onFile);
    this.#report.write(ScannerType.LABEL, this.#result);
  }

  async #checkAll() {
    await this.#checkUserId();
    await this.#checkSensor();
    await this.#checkActivityName();
    await this.#checkLabel();
  }

  async #run(onFile) {
    if (!TypeHelper.isFunction(onFile)) {
      ConsoleHelper.printMessage(Tags.ERROR, `onFile must be a function`);
      process.exit(1);
    }

    try {
      await readdir(this.#input, { recursive: true, onFile });
    } catch (error) {
      ConsoleHelper.printMessage(
        Tags.ERROR,
        `error occurs while trying to access: ${this.#input}`,
        { error, eol: false }
      );
      process.exit(1);
    }
  }

  async scan(scannerType = null) {
    const spinner = new clui.Spinner(`Scanning dataset folder...`);
    spinner.start();

    switch (scannerType) {
      case ScannerType.USER_ID:
        await this.#checkUserId();
        break;
      case ScannerType.SENSOR:
        await this.#checkSensor();
        break;
      case ScannerType.ACTIVITY:
        await this.#checkActivityName();
        break;
      case ScannerType.LABEL:
        this.#checkLabel();
        break;
      case ScannerType.ALL:
      default:
        await this.#checkAll();
        break;
    }

    spinner.stop();

    const total = this.#report.total;

    let msg = `\n${total} error`;

    if (total > 0) {
      if (total > 1) {
        msg += `s were`;
      } else {
        msg += `was`;
      }

      msg += ` found\n`;

      console.log(chalk.red.bold(msg));
      console.log(`The complete report is available at: ${this.#report.path}\n`);
    } else {
      this.#report.noError();
      msg = `No errors found\n`;
      console.log(chalk.green.bold(msg));
    }
  }
}
