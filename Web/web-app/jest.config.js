/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['src', 'test'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
		'^wwwroot/(.*)': '<rootDir>/../../wwwroot/$1',
    },
	transform: {
		'^.+\\.js$': 'babel-jest',
		'.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg|gif)$': 'jest-transform-stub'
	},
	testEnvironment: 'jest-environment-jsdom'
};