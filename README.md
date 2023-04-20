# Wofo: task development wofkflow assistant

## Usage

### start new task:

```bash
wofo start TASK-1234
```

this will:

1.  update repository:

    -   if it's not cloned yet:

        -   clone repo into `...tasks/.origin` dir

    -   if cloned:

        -   pull latest changes into `.origin` dir

2.  copy the local repo to `~/tasks/TASK-1234` subdir

3.  install dependencies (using **config.commands.installDeps** command)

4.  create new branch, named `TASK-1234`
    -   or `task-1234` if the lowecase is specified in **config.branches.inLowerCase:true**

### start new task derived from specific branch:

`wofo start TASK-1234 some-remote-branch`

this will do all the same except that before creating the task
branch the specified remote branch will be pulled and checked out first

### make commit

```bash
wofo commit "some commit message"
```

will make commit with the message:

`TASK-1234 | some commit message`

if **config.commits.firstWordAsCommitType** and **config.commits.headerSeparator** are specified:

`TASK-1234 | some | commit message`

if no **config.commits.headerSeparator** in config:

`TASK-1234 some commit message`

if no **config.commits.taskId** in config:

`some commit message`

### get info

#### show current config

```bash
wofo show config
```

```bash
 > Workspace config:

 {
  repo: 'git@github.com:off-border/workflow-assist.git',
  rootDir: '~/tasks',
  originDir: '.origin',
...
```

#### show current task

```bash
wofo show task
```

```
> Current task: TASK-1234
```

### Installation

1. create your workflow directory (e.g. `~/tasks`)
2. create **.workflow.config.js** in the **workflow dir**
3. copy the following code to the config file and change the settings as you wish

```js
module.exports = {
    // your project repo
    repo: 'git@github.com:off-border/workflow-assist.git',

    // where you want your working copies to be put
    rootDir: '~/tasks',

    // where to keep the main repo copy. this will be a subdir in your rootDir
    originDir: '.origin',

    // configure a new task branch naming
    branches: {
        // always convert task-id to lowercase (TASK-1234 -> task-1234)
        inLowerCase: true,
    },

    // basic commands
    commands: {
        // commands to run after cloning/pulling repo
        installDeps: ['yarn', 'echo DEPS INSTALLED'],
    },

    // commits config
    commits: {
        // how to format task-id in the commit message
        taskId: {
            // regEx to extract task id from current branch name
            // e.g. here will be extracted:
            //    TASK-1234 from TASK-1234-some-text
            //    !1234 from !1234-some-text
            extractRegex: /(!\d+|TASK-\d+)/i,

            // convert task id to upper case (task-1234 -> TASK-1234)
            upperCase: true,
        },

        // header fields separator (e.g. "TASK-1234 | type | message")
        headerSeparator: ' | ',

        // use the first word of the message as a commit type
        // (e.g. "wofo commit 'some commit message'" -> "TASK-1234 | some | commit message)
        firstWordAsCommitType: true,
    },
};
```
