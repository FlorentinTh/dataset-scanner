import path from 'path';
import ProgramHelper from './helpers/ProgramHelper.js';

import QuestionsHelper from './helpers/QuestionHelper.js';
import { Scanner } from './Scanner.js';

class DatasetScanner {
  async run() {
    let inputPath;

    if (process.env.NODE_ENV === 'test') {
      inputPath = path.join(ProgramHelper.getRootPath(), 'dataset');
      console.log(inputPath);
    } else {
      const inputPathAnswer = await QuestionsHelper.askInputPath();
      inputPath = inputPathAnswer.fs.path;
    }

    const scanner = new Scanner(inputPath);
    await scanner.scan();
  }
}

export default DatasetScanner;
