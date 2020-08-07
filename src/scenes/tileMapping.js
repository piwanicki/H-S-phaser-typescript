// Mapping tiles for
// - Single index for putTileAt
// - Array of weights for weightedRandomize
// - Array or 2D array for putTilesAt

const TILE_MAPPING = {
  BLANK: 17,
  // Dungeon_Tileset
  WALL: {
    TOP_LEFT: 3,
    TOP_LEFT_1: 19,
    TOP_FILL_NORMAL: 25,
    TOP_FILL: [
      {index: [25, 26, 27, 28, 29], weight: 7},
      {index: [57, 61], weight: 2},
      {index: 30, weight: 1},
    ],
    TOP_RIGHT: 5,
    TOP_RIGHT_1: 21,
    BOTTOM_LEFT: 51,
    BOTTOM_LEFT_1: 35,
    BOTTOM_RIGHT: 53,
    BOTTOM_RIGHT_1: 37,

    // some randomization to the walls while we are refactoring:
    TOP: 4,
    LEFT: 18,
    RIGHT: 16,
    BOTTOM: 52,
    BOTTOM_1: 36,
  },

  FLOOR: [
    {index: 88, weight: 2},
    {index: [89, 90, 91, 92, 93], weight: 8},
  ],
  DOOR: {
    TOP_LEFT: 50,
    TOP_RIGHT: 48,
    BOTTOM_LEFT: 2,
    BOTTOM_RIGHT: 0,
    LEFT_BOTTOM: 113,
    RIGHT_BOTTOM: 114,
    LEFT_TOP: 32,
    LEFT_TOP_1: 81,
    RIGHT_TOP: 34,
    RIGHT_TOP_1: 82,
  },

  // dungeonSet tileset
  CHEST: 2923,
  STAIRS_DOWN: 1001,
  STAIRS_UP: 1002,
  TOWER: 480,
  FOUNTAIN: 725,
  MANA: 640,
  HP: 641,
  STATUE_1: 803,
  STATUE_2: 481,
  TRASH: [
    {index: 2921, weight: 1},
    {index: 2760, weight: 2},
    {index: 647, weight: 4},
  ],
  PENTAGRAM: 2876,
  DUNG_ENTER: 2873,
  DUNG_ENTER2: 2885,
  BLOOD: 3,
  GREEN_BLOOD: 2,
};

export default TILE_MAPPING;
