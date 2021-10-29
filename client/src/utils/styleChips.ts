interface Chips {
  green: any;
  red: any;
  blue: any;
  orange: any;
  purple: any;
  lime: any;
  pink: any;
  cyan: any;
  yellow: any;
  teal: any;
}

const listColorChip = [
  'blue',
  'purple',
  'orange',
  'lime',
  'cyan',
  'yellow',
  'pink',
  'teal',
];

let currentListColorChip = listColorChip.sort((a, b) => 0.5 - Math.random());

export const getColorChip = () => {
  if (currentListColorChip.length <= 1) {
    currentListColorChip = listColorChip.sort((a, b) => 0.5 - Math.random());
  } else {
    currentListColorChip = currentListColorChip.filter(
      (_, index) => index !== 0
    );
  }
  return currentListColorChip[0];
};

export const styleChips: Chips = {
  green: {
    '--background': '#52c41a',
  },
  red: {
    '--background': '#ff4d4f',
  },
  blue: {
    '--background': '#1890ff',
  },
  orange: {
    '--background': '#faad14',
  },
  purple: {
    '--background': '#bb86fc',
  },
  lime: {
    '--background': '#4cd964',
  },
  pink: {
    '--background': '#ff80ab',
  },
  cyan: {
    '--background': '#26c6da',
  },
  yellow: {
    '--background': '#fbc02d',
  },
  teal: {
    '--background': '#009688',
  },
};
