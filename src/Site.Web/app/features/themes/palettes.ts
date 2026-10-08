import type { ThemeColors } from './preferences';

// Original palette families, with readable text in every default button state.
export const dark: ThemeColors = {
  "backgroundColor": {
    "primary": "#06121a",
    "secondary": "#122835",
    "tertiary": "#111111",
    "quaternary": "#262626"
  },
  "textColor": {
    "primary": "#eff0fe",
    "secondary": "#d0d1fd"
  },
  "accentColor": {
    "primary": "#1dccd8",
    "secondary": "#d0d1fd"
  },
  "button": {
    "backgroundColor": {
      "primary": "#1f3f51",
      "secondary": "#262626"
    },
    "textColor": {
      "primary": "#caf9ff",
      "secondary": "#f1f1f1"
    },
    "outlineColor": {
      "primary": "#77c1ed",
      "secondary": "none"
    },
    "hoverBackgroundColor": {
      "primary": "#075c61",
      "secondary": "#262626"
    },
    "hoverTextColor": {
      "primary": "#caf9ff",
      "secondary": "#f1f1f1"
    },
    "hoverOutlineColor": {
      "primary": "#77c1ed",
      "secondary": "#f1f1f1"
    },
    "pressBackgroundColor": {
      "primary": "#f1f1f1",
      "secondary": "#262626"
    },
    "pressTextColor": {
      "primary": "#262626",
      "secondary": "#f1f1f1"
    },
    "pressOutlineColor": {
      "primary": "#262626",
      "secondary": "#f1f1f1"
    }
  }
};
export const light: ThemeColors = {
  "backgroundColor": {
    "primary": "#faefdf",
    "secondary": "#d4d4d4",
    "tertiary": "#f1f1f1",
    "quaternary": "#b9b9b9"
  },
  "textColor": {
    "primary": "#001416",
    "secondary": "#020644"
  },
  "accentColor": {
    "primary": "#06127c",
    "secondary": "#06127c"
  },
  "button": {
    "backgroundColor": {
      "primary": "#faefdf",
      "secondary": "#0e1fb5"
    },
    "textColor": {
      "primary": "#463a21",
      "secondary": "#eff0fe"
    },
    "outlineColor": {
      "primary": "#06127c",
      "secondary": "#1f3f51"
    },
    "hoverBackgroundColor": {
      "primary": "#f1d08e",
      "secondary": "#262626"
    },
    "hoverTextColor": {
      "primary": "#2d2513",
      "secondary": "#f1f1f1"
    },
    "hoverOutlineColor": {
      "primary": "#06127c",
      "secondary": "#f1f1f1"
    },
    "pressBackgroundColor": {
      "primary": "#faefdf",
      "secondary": "#262626"
    },
    "pressTextColor": {
      "primary": "#463a21",
      "secondary": "#f1f1f1"
    },
    "pressOutlineColor": {
      "primary": "#06127c",
      "secondary": "#f1f1f1"
    }
  }
};

export function themeVariables(colors: ThemeColors): Record<string, string> {
  const variables: Record<string, string> = {};
  const flatten = (object: object, prefix: string[] = []) => {
    for (const [key, value] of Object.entries(object)) {
      const segment = key.replace(/Color$/, '').replace(/[A-Z]/g, letter => '-' + letter.toLowerCase());
      const parts = [...prefix, segment];
      if (typeof value === 'string') variables['--color-' + parts.join('-')] = value === 'none' ? 'transparent' : value;
      else flatten(value as object, parts);
    }
  };
  flatten(colors);
  return variables;
}
