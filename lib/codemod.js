'use babel';

const { BufferedProcess, CompositeDisposable } = require('atom');
const { readdir } = require('fs');
const path = require('path');
const P = require('promalom');

module.exports = {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-ember-modules-codemod:run': () => this.runEmberCodemod()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {

  },

  runEmberCodemod() {
    this.runCodemode({
      path: path.join(__dirname, '..', 'node_modules', 'ember-modules-codemod'),
      file: 'transform.js'
    });
  },

  runCodemode(transform) {
    const isWin = process.platform === "win32";
    let jscodeshift = path.join(__dirname, '..', 'node_modules', '.bin', 'jscodeshift');
    const args = [
      '-t',
      path.join(transform.path, transform.file),
      atom.workspace.getActivePaneItem().getPath()
    ];
    console.log('jscodechisft', jscodeshift);
    if (isWin) {
      jscodeshift += '.cmd';
    }

    function showOutput(output, timeout) {
      console.log('stdout', output);

      const div = document.createElement('div');
      div.innerText = output;

      const panel = atom.workspace.addModalPanel({ item: div });

      setTimeout(() => {
        panel.destroy();
      }, timeout);
    }

    new BufferedProcess({
      command: jscodeshift,
      args,
      stdout: output => {
        showOutput(output, 2000);
      },
      stderr: output => {
        showOutput(output, 5000);
      },
      exit: returnCode => console.log('Return Code', returnCode)
    });

  }
};
