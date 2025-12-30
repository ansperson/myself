import packageJson from '../../package.json';
import aboutMe from '../../aboutme.json'
import themes from '../../themes.json';
import { history } from '../stores/history';
import { theme } from '../stores/theme';
import { booting, runlevel } from '../stores/runlevel';
import { systemHome } from './systemConfig';

const hostname = window.location.hostname;
//"top [number]" command: This command displays the top "number" most relevant projects based on user input (e.g., "top 3 web development projects").

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  help: () => {
    const allCommands = Object.keys(commands);
    const isMobile = isMobileDevice();
    const commandsPerLine = 7;

    let output = 'Available commands: ';

    if (isMobile) {
      const firstLineCommands = allCommands.slice(0, 4);
      output += firstLineCommands.join(', ') + '\n';

      for (let i = 4; i < allCommands.length; i += commandsPerLine) {
        output += allCommands.slice(i, i + commandsPerLine).join(', ') + '\n';
      }
    } else {
      output += allCommands.join(', ');
    }

    return output;
  },
  hostname: () => hostname,
  //whoami: () => JSON.stringify(aboutMe, null, 2),
  whoami: () => `Alan Santos Pereira`,
  date: () => new Date().toLocaleString(),
  emacs: () => `why use emacs? try 'vim'`,
  echo: (args: string[]) => args.join(' '),
  init: (args: string[]) => {
    const usage = `Usage: init [runlevel].
    [runlevel]:
      3: terminal (default)
      5: GUI (webKDE)

    [Examples]:
      init 3
      init 5
    `;

    if (args.length !== 1) {
      return usage;
    }

    const nextLevel = Number.parseInt(args[0], 10);
    if (Number.isNaN(nextLevel)) {
      return usage;
    }

    if (nextLevel === 3) {
      booting.set(false);
      runlevel.set(3);
      return 'Switched to runlevel 3 (terminal).';
    }

    if (nextLevel === 5) {
      booting.set(true);
      const bootMessages = [
        'Starting systemd user sessions...',
        '[ OK ] Reached target Basic System.',
        '[ OK ] Started udev Kernel Device Manager.',
        `[ OK ] Mounted ${systemHome}.`,
        '[ OK ] Started Network Manager.',
        '[ OK ] Started Login Service.',
        '[ OK ] Reached target Multi-User System.',
        '[ OK ] Started Display Manager.',
        '[ OK ] Reached target Graphical Interface.',
        'Starting webKDE (graphical mode)...',
        'Switching to runlevel 5 (webKDE)...'
      ];
      let entryIndex = -1;
      history.update((items) => {
        entryIndex = items.length;
        return [...items, { command: 'init 5', outputs: [] }];
      });
      bootMessages.forEach((line, index) => {
        setTimeout(() => {
          history.update((items) => {
            const entry = items[entryIndex];
            if (!entry) {
              return items;
            }
            const outputs = [...entry.outputs, line];
            const nextItems = [...items];
            nextItems[entryIndex] = { ...entry, outputs };
            return nextItems;
          });
          if (index === bootMessages.length - 1) {
            setTimeout(() => {
              runlevel.set(5);
              booting.set(false);
            }, 500);
          }
        }, 500 * index);
      });
      return '';
    }

    return `Runlevel '${args[0]}' is not supported. Use 3 or 5.`;
  },
  sudo: (args: string[]) => {
    window.open(packageJson.social.url);

    return `Permission denied: unable to run the command '${args[0]}' as root.`;
  },
  about: (args: string[]) => {
    const usage = `Usage: about [args].
    [args]:
      personal: list all available themes
      career: set theme to [theme]

    [Examples]:
      about personal info
      about career info
    `;
    const person_usage = `Usage: about personal [args].
    [args]:
      info: List personal details
      skills: set of personal skills
      edu: List os education and training details

    [Examples]:
      about personal info
      about personal skills
    `;
    const career_usage = `Usage: about career [args].
    [args]:
      info: List career details
      skills: set of career skills

    [Examples]:
      about career info
      about career skills
    `;

    if (args.length === 0) {
      return usage;
    }

    switch (args[0]) {
      case 'personal': {
        if (args.length === 1) {
          return usage;
        }
      }

      case 'set': {
        if (args.length !== 2) {
          return usage;
        }

        const selectedTheme = args[1];
        const t = themes.find((t) => t.name.toLowerCase() === selectedTheme);

        if (!t) {
          return `Theme '${selectedTheme}' not found. Try 'theme ls' to see all available themes.`;
        }

        theme.set(t);

        return `Theme set to ${selectedTheme}`;
      }

      default: {
        return usage;
      }
    }
  },
  theme: (args: string[]) => {
    const usage = `Usage: theme [args].
    [args]:
      ls: list all available themes
      set: set theme to [theme]

    [Examples]:
      theme ls
      theme set gruvboxdark
    `;
    if (args.length === 0) {
      return usage;
    }

    switch (args[0]) {
      case 'ls': {
        let result = themes.map((t) => t.name.toLowerCase()).join(', ');
        result += `You can preview all these themes here: ${packageJson.repository.url}/tree/master/docs/themes`;

        return result;
      }

      case 'set': {
        if (args.length !== 2) {
          return usage;
        }

        const selectedTheme = args[1];
        const t = themes.find((t) => t.name.toLowerCase() === selectedTheme);

        if (!t) {
          return `Theme '${selectedTheme}' not found. Try 'theme ls' to see all available themes.`;
        }

        theme.set(t);

        return `Theme set to ${selectedTheme}`;
      }

      default: {
        return usage;
      }
    }
  },
  repo: () => {
    window.open(packageJson.repository.url, '_blank');

    return 'Opening repository...';
  },
  clear: () => {
    history.set([]);

    return '';
  },
  email: () => {
    window.open(`mailto:${packageJson.author.email}`);

    return `Opening mailto:${packageJson.author.email}...`;
  },
  donate: () => {
    window.open(packageJson.funding.url, '_blank');

    return 'Opening donation url...';
  },
  weather: async (args: string[]) => {
    const city = args.join('+');

    if (!city) {
      return 'Usage: weather [city]. Example: weather Brussels';
    }

    const weather = await fetch(`https://wttr.in/${city}?ATm`);

    return weather.text();
  },
  exit: () => {
    return 'Please close the tab to exit.';
  },
  banner: () => {
  if (isMobileDevice()) {
  return `
   █████╗ ███████╗██████╗
  ██╔══██╗██╔════╝██╔══██╗
  ███████║███████╗██████╔╝
  ██╔══██║╚════██║██╔═══╝
  ██║  ██║███████║██║
  ╚═╝  ╚═╝╚══════╝╚═╝v${packageJson.version}

  Type 'help' to see list of available commands.`;
  }


  return `
   █████╗ ██╗      █████╗ ███╗   ██╗    ██████╗ ███████╗██████╗ ███████╗██╗██████╗  █████╗
  ██╔══██╗██║     ██╔══██╗████╗  ██║    ██╔══██╗██╔════╝██╔══██╗██╔════╝██║██╔══██╗██╔══██╗
  ███████║██║     ███████║██╔██╗ ██║    ██████╔╝█████╗  ██████╔╝█████╗  ██║██████╔╝███████║
  ██╔══██║██║     ██╔══██║██║╚██╗██║    ██╔═══╝ ██╔══╝  ██╔══██╗██╔══╝  ██║██╔══██╗██╔══██║
  ██║  ██║███████╗██║  ██║██║ ╚████║    ██║     ███████╗██║  ██║███████╗██║██║  ██║██║  ██║
  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═ v${packageJson.version}

Type 'help' to see list of available commands.
`;
  },
};
