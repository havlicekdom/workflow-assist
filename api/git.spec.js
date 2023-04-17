import jest from 'jest-mock';
import { createGitApi } from './git';

const setup = () => {
    const bash = jest.fn();

    const api = {
        bash,
    };

    const git = createGitApi({ api });

    return {
        git,
        bash,
    };
};

describe('api/git', () => {
    describe('fetch()', () => {
        it('- fetch remote branch', () => {
            const { git, bash } = setup();

            git.fetch('task-1234', 'remote-branch');

            expect(bash).toHaveBeenCalledWith(
                'cd task-1234 && git fetch origin remote-branch'
            );
        });
    });

    describe('checkout()', () => {
        it('- checkout existing branch', () => {
            const { git, bash } = setup();

            git.checkout('task-1234', 'some-branch');

            expect(bash).toHaveBeenCalledWith(
                'cd task-1234 && git checkout some-branch'
            );
        });
    });
});
