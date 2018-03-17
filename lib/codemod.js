'use babel';

const {
  BufferedNodeProcess,
  CompositeDisposable
} = require('atom');

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
    const jscodeshift = path.join(__dirname, '..', 'node_modules', '.bin', 'jscodeshift');

    new BufferedNodeProcess({
      command: jscodeshift,
      args: [
        '-t',
        path.join(transform.path, transform.file),
        atom.workspace.getActivePaneItem().getPath()
      ],
      stdout: output => {
        console.log('stdout', output);

        const div = document.createElement('div');
        div.innerText = output;

        const panel = atom.workspace.addModalPanel({ item: div });

        setTimeout(() => {
          panel.destroy();
        }, 1000);
      },
      stderr: output => {
        console.log('stdout', output);

        const div = document.createElement('div');
        div.innerText = output;

        const panel = atom.workspace.addModalPanel({ item: div });

        setTimeout(() => {
          panel.destroy();
        }, 1000);
      },
      exit: returnCode => console.log('Return Code', returnCode)
    });
  }
};
