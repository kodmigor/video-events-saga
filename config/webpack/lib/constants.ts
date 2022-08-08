import path from "path";
const root = process.cwd();

export const Dir = {
    CONFIG: path.resolve(`${root}/config`),
    DIST: path.resolve(`${root}/dist`),
    INDEX: path.resolve(`${root}/src/app/index`),
    ROOT: root,
    SRC: path.resolve(`${root}/src`),
};