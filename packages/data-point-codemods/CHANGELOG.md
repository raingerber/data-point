# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="3.0.0"></a>
# [3.0.0](https://github.com/ViacomInc/data-point/compare/v2.0.0...v3.0.0) (2018-02-26)


### Features

* **data-point:** Remove predefined hash and collection execution order ([#218](https://github.com/ViacomInc/data-point/issues/218)) ([8fc75c1](https://github.com/ViacomInc/data-point/commit/8fc75c1)), closes [#73](https://github.com/ViacomInc/data-point/issues/73)
* **data-point-codemod:** adds codemod package ([#172](https://github.com/ViacomInc/data-point/issues/172)) ([8ac4f37](https://github.com/ViacomInc/data-point/commit/8ac4f37)), closes [#117](https://github.com/ViacomInc/data-point/issues/117)
* **data-point-codemods:** Add codemod for changing PathReducer from $. to $ ([#183](https://github.com/ViacomInc/data-point/issues/183)) ([bb6c7bc](https://github.com/ViacomInc/data-point/commit/bb6c7bc)), closes [#179](https://github.com/ViacomInc/data-point/issues/179)


### BREAKING CHANGES

* **data-point:** No longer possible to use multiple modifiers without a compose array
* **data-point-codemod:** every reducer function needs to be changed to accept the first parameter as the
reducer's input, use codemods provided
