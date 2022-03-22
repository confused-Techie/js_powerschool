# JS_PowerSchool

* To Install

`npm install`

* To Run

`js-power`

> (While in the root directory)

## Options

There are two methods of importing data to JS_PowerSchool:

1) The config file:
  - Place a file titled `config.json` in the root of the directory.
  - And follow the `example_config.json` in the root for an example. Leaving out the fields with `_comment` in the field key.
  - Then to get this config picked up by JS_PowerSchool just leave out any command line options, and it will automatically look in the root folder for the file.

2) The Command Line:
  - Using the command line, you can include all the variable found in the config file.
  - Using two types of command line inputs:
    * String: `--KEY=VALUE` Keep in mind to leave no spaces between the key or value. And key capitalization has to match exactly.
    * Array: `--KEY=VALUE0-VALUE1-VALUE3` Keep in mind to leave no spaces between the key or value. Keep key capitalization matching exactly, as well each array value needs to be separated by `-` with no spaces or any other character.

  - Values in the Command Line:

| Key Name | Key Format | Key Type |
| --- | --- | --- |
| Plugin ID | `--id` | STRING |
| Plugin Secret | `--secret` | STRING |
| Powerschool URL | `--url` | STRING |
| School IDs | `--schools=` | ARRAY |
| School Names | `--namedschools` | ARRAY |

 - Example:

````
PS C:\> js-power --id=123456 --secret=12se3cr4t --url=https://powerschool.org --schools=1-45-3 --namedschools=JH-EL-PR
````
