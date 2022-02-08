import os from 'os';
import inquirer from 'inquirer';
import FSPrompt from 'inquirer-fs-selector';

class QuestionsHelper {
  static async askInputPath() {
    const questions = [
      {
        type: 'directory',
        name: 'fs',
        message: 'Select the path of the root folder of the dataset',
        basePath: os.homedir(),
        options: {
          shouldDisplayItem: (isDir, isFile) => {
            if (isDir && !isFile) {
              return true;
            }
          }
        }
      }
    ];

    inquirer.registerPrompt('directory', FSPrompt);
    return inquirer.prompt(questions);
  }
}

export default QuestionsHelper;
