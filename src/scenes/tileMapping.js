// Mapping tiles for
// - Single index for putTileAt
// - Array of weights for weightedRandomize
// - Array or 2D array for putTilesAt

const TILE_MAPPING = {
  BLANK: 17,

  // dungeon2 tileset
  WALL: {
    TOP_LEFT: 0,
    TOP_RIGHT: 2,
    BOTTOM_LEFT: 16,
    BOTTOM_RIGHT: 18,

    // some randomization to the walls while we are refactoring:
    TOP: 1,
    LEFT: 8,
    RIGHT: 10,
    BOTTOM: 17,
  },

  FLOOR: [
    {index: 37, weight: 7},
    {index: [19, 20, 21], weight: 3},
  ],
  DOOR: {
    TOP: 1,
    BOTTOM: 17,
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
};

export default TILE_MAPPING;
