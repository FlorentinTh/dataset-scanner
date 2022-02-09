import os from 'os';

import QuestionsHelper from './helpers/QuestionHelper.js';
import { Scanner } from './Scanner.js';

class DatasetScanner {
  async run() {
    let inputPath;

    if (process.env.NODE_ENV === 'test') {
      inputPath = os.homedir();
    } else {
      const inputPathAnswer = await QuestionsHelper.askInputPath();
      inputPath = inputPathAnswer.fs.path;
    }

    const scanner = new Scanner(inputPath);
    await scanner.scan();
  }
}

export default DatasetScanner;
