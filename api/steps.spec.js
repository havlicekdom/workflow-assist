import jest from 'jest-mock';
import { createStepsApi } from './steps';

const setup = ({ runTaskDirReadyHook }) => {
    const config = {
        commands: {
            runTaskDirReadyHook,
        },
    };

    const bash = jest.fn();

    const api = {
        msg: () => {},
        bash,
        fs: { resolveSubdir: (dir, subdir) => subdir },
        git: {
            fetch: jest.fn(),
            checkout: jest.fn(),
        },
        tasks: {
            getTaskDir: (s) => s,
        },
    };

    const steps = createStepsApi({ api, config });

    return {
        steps,
        bash,
        api,
    };
};

describe('api/steps', () => {
    describe('runTaskDirReadyHook()', () => {
        describe('if config.hooks.taskCopyReady hook provided', () => {
            describe('if is a string', () => {
                it('execute this line', () => {
                    const { steps, bash } = setup({
                        runTaskDirReadyHook: 'npm i',
                    });

                    steps.runTaskDirReadyHook('task-1234');

                    expect(bash).toHaveBeenCalledWith('cd task-1234 && npm i');
                });
            });

            describe('if is an array of string', () => {
                it('execute each line', () => {
                    const { steps, bash } = setup({
                        runTaskDirReadyHook: ['npm i', 'run test'],
                    });

                    steps.runTaskDirReadyHook('task-1234');

                    expect(bash).toHaveBeenCalledWith(
                        'cd task-1234 && npm i && run test'
                    );
                });
            });
        });
    });

    describe('checkoutRemoteBranch()', () => {
        it('- fetch remote branch', () => {
            const { steps, api } = setup({});

            steps.checkoutRemoteBranch('task-1234', 'remote-branch');

            expect(api.git.fetch).toHaveBeenCalledWith('task-1234', {
                branchName: 'remote-branch',
            });
        });

        it('- checkout the remote branch', () => {
            const { steps, api } = setup({});

            steps.checkoutRemoteBranch('task-1234', 'remote-branch');

            expect(api.git.checkout).toHaveBeenCalledWith(
                'task-1234',
                'remote-branch'
            );
        });
    });
});
