# dungeon-sheet

A tool for creating Dungeons and Dragons&reg; 5<sup>th</sup> edition character sheets.

## Copyright Notice

The data in `src/{class,race,background}` has been taken from the [Dungeons and Dragons&reg; Player's Basic Rules Version 0.3][basic-rules]. This PDF can be downloaded freely from the Wizards of the Coast website.  
The code in `src/{class,race,background}` contains material that falls under the copyright of Wizards of the Coast LLC, but the code itself falls under the copyright and license mentioned at the bottom of this README.

This project is in no way an attempt to breach Wizards' copyright of Dungeons and Dragons&reg;. This project does not and will never contain any information that isn't part of the Basic Ruleset.

## Installation

Installation is swift and painless using [npm][npm]:

```bash
npm install --global dungeon-sheet
```

## Requirements

This project uses some features of ES2015 which are still experimental in V8. You'll want to install node >= 4.2.4 or >= 5.2.0 to run this module. Using [n][n]:

```bash
# for 4.* (at time of writing this is 4.2.4)
n lts
# for 5.* (at time of writing this is 5.2.0)
n stable
# living on the edge (at time of writing this is 5.3.0)
n latest
```

If you want to generate PDF character sheets, you'll need [LaTeX][latex].

```bash
# Ubuntu
sudo aptitude install texlive
# or if you prefer apt-get
sudo apt-get install texlive

# OS X
# if you use brew-cask
brew cask install mactex
# or if you prefer MacPorts
sudo port install texlive
```

Alternatively you can download any TeX distribution and install it on your system. Minimal requirements are: support for LaTeX and TikZ.

## Usage

Below you'll find an example of a character sheet source file. Note that the file format is still experimental and breaking changes will be made in future versions!

```js
name = 'Elrond';
playerName = 'Bram';
experience = '6500';
alignment = 'Lawful Good';
inspiration = false;

hp = 25;
speed = 35;

stats = {
  STR: 7,
  DEX: 14,
  CON: 16,
  INT: 20,
  WIS: 14,
  CHA: 10,
};

Class = 'wizard';
Class.selectSkill('insight');
Class.selectSkill('investigation');

Race = 'elf';
Race.selectSubRace('high');
Race.selectLanguage('Orkish');

Background = 'sage';
Background.selectLanguage('Dwarvish');
Background.selectLanguage('Dark Tongue of Mordor');

ac = {
  armor: 0,
  shield: 0,
  magic: 0,
};

/* proficiencies: {
  other: [ 'Flute' ],
} */

addWeapon('Quarterstaff', {
  proficient: true,
  die: '1d6',
  stat: 'STR',
  damageType: 'bludgeoning',
});

treasure = {
  pp: 100,
  items: [
    'Ring of Power',
  ],
};

equipment = [
  'Staff',
  'Longsword'
];
```

This results in the following [PDF][example-pdf] and [HTML][example-html] files.

## Command-line usage

```
Usage:
    dungeon-sheet --help
    dungeon-sheet [--format <latex|html>] [--include <directory>
    [--include <directory>...]] [file [file...]]

Options:
  -f, --format   Specify output format: html or latex          [default: "html"]
  -i, --include  Specify directory/directories to load class/race/background
                 data from

```

## Other classes, races and backgrounds

The Player's Handbook and Player's Companion: Elemental Evil contain a lot more classes, races and backgrounds than the Basic Rules. These are not included in this project, but you can easily write them yourself!  
Take a look in `src/{background,class,race}` to see what these files look like. You can create your own directory containing other classes, races and backgrounds like in the following example.

__Example__: I have two characters: an Half-Elf Druid called Aryn (background: Outlander) and a Deep Gnome Wizard called Thulwar (background: hermit). I'll have to create my own files for the Half-Elf and Deep Gnome races, the Druid class and Outlander and Hermit backgrounds. My file structure look like this:

```
bram:~/Documents/DnD/Characters$ tree
.
├── _includes
│   ├── background
│   │   ├── hermit.js
│   │   └── outlander.js
│   ├── class
│   │   └── druid.js
│   └── race
│       ├── deep-gnome.js
│       └── half-elf.js
├── aryn.character
└── thulwar.character

4 directories, 7 files
```

I have to let `dungeon-sheet` know about my own race/class/background files, which I do using the `--include` flag:

```bash
dungeon-sheet --include _includes --format latex aryn.character
dungeon-sheet --include _includes --format html thulwar.character
```

## License

Copyright &copy; 2016 Bram Gotink

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

[npm]: https://www.npmjs.com/package/dungeon-sheet
[basic-rules]: https://dnd.wizards.com/articles/features/basicrules
[n]: https://www.npmjs.com/package/n
[latex]: https://en.wikipedia.org/wiki/LaTeX
[example-pdf]: https://example.com/pdf
[example-html]: https://example.com/html
