import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GameDataStats from "../../components/GameDataStats.js";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/index.js";
import { addFilter } from '../../redux/slices/LTVSlice.js';
import { debounce } from 'lodash';
import { Game } from '../../types/game';

const gameList: Game[] = [
  { id: 7, package_name: "com.augustgame.bubble.pop.shooter", name: "Bubble Pop Shooter", os: "ANDROID" },
  { id: 9, package_name: "com.augustgame.dive.deeper.idle", name: "Dive Deeper", os: "ANDROID" },
  { id: 12, package_name: "com.augustgame.tile.match.mania", name: "Tile Match Mania", os: "ANDROID" },
  { id: 14, package_name: "com.brownbutton.ball.sort.color", name: "Sort Them Out", os: "ANDROID" },
  { id: 18, package_name: "com.brownbutton.slide.push.box.out", name: "Push Box Out", os: "ANDROID" },
  { id: 26, package_name: "com.cupcake.alien.infinity.shooter", name: "Alien Infinity Shooter", os: "ANDROID" },
  { id: 27, package_name: "com.cupcake.sea.block1010.puzzle", name: "Sea Block 1010", os: "ANDROID" },
  { id: 43, package_name: "com.halfpint.master.ball.sort", name: "Master Sort Ball", os: "ANDROID" },
  { id: 44, package_name: "com.halfpint.number.merging.master2048", name: "Number Merging Master", os: "ANDROID" },
  { id: 45, package_name: "com.halfpint.perfect.arrow.hit", name: "Perfect Arrow Hit", os: "ANDROID" },
  { id: 46, package_name: "com.halfpint.wooden.gem.puzzle", name: "Wooden Gem Puzzle", os: "ANDROID" },
  { id: 53, package_name: "com.lemonade.fish.catcher.idle", name: "Fish Catcher", os: "ANDROID" },
  { id: 54, package_name: "com.lemonade.jungle.adventure.block.puzzle", name: "Jungle Adventure Block", os: "ANDROID" },
  { id: 55, package_name: "com.leonet.brain.wood.puzzle", name: "Brain Wood Puzzle", os: "ANDROID" },
  { id: 58, package_name: "com.leonet.deluxe.block.jewel.puzzle", name: "Deluxe Block Jewel", os: "ANDROID" },
  { id: 77, package_name: "com.ninedot.diamond.treasure.puzzle", name: "Diamond Treasure Puzzle", os: "ANDROID" },
  { id: 79, package_name: "com.ninedot.merge.line.number.battle", name: "Merge Line: The Number Battle", os: "ANDROID" },
  { id: 80, package_name: "com.ninedot.pull.pin.born.todie", name: "Pull Pins", os: "ANDROID" },
  { id: 81, package_name: "com.ninedot.slide.jewel.escape", name: "Sliding Jewel", os: "ANDROID" },
  { id: 83, package_name: "com.ninedot.tangram.block.puzzle.hex", name: "Tangram Block Puzzle", os: "ANDROID" },
  { id: 92, package_name: "com.ntt.number.merge.block.puzzle", name: "Double Number Merging", os: "ANDROID" },
  { id: 94, package_name: "com.ntt.pet.match.master", name: "Pet Match", os: "ANDROID" },
  { id: 95, package_name: "com.ntt.summer.ball.puzzle", name: "Summer Break", os: "ANDROID" },
  { id: 97, package_name: "com.ntt.toy.puzzle.escape.unblock", name: "Toy Escape", os: "ANDROID" },
  { id: 100, package_name: "com.ntt.water.color.lab.liquid.sort", name: "Lab Liquid Sort", os: "ANDROID" },
  { id: 116, package_name: "com.onebite.blossom.block.blast", name: "Blossom Block Blast", os: "ANDROID" },
  { id: 119, package_name: "com.pineapple.goods.sort.match3", name: "Goods Mania 3D: Match 3 Items", os: "ANDROID" },
  { id: 120, package_name: "com.pineapple.hoop.stack.color.sort", name: "Hoop Stack 3D", os: "ANDROID" },
  { id: 122, package_name: "com.pineapple.match.tile.go.find.fish", name: "Go Find Fish", os: "ANDROID" },
  { id: 123, package_name: "com.pineapple.merge.number.blast", name: "Merge Blast Number", os: "ANDROID" },
  { id: 125, package_name: "com.pineapple.nuts.bolt.unscrew.puzzle", name: "Nuts & Bolts - Unscrew Puzzle", os: "ANDROID" },
  { id: 126, package_name: "com.pineapple.pal.poclands.world", name: "Poclands", os: "ANDROID" },
  { id: 127, package_name: "com.pineapple.zombie.idle.survive.hideout", name: "Zombie Survive: Hideout Base", os: "ANDROID" },
  { id: 128, package_name: "com.pipeapple.color.block.puzzle.gem", name: "Color Block Master", os: "ANDROID" },
  { id: 297, package_name: "com.seaweed.cube.shotblock.run2048.io", name: "Jelly Cube Run 2048", os: "ANDROID" },
  { id: 300, package_name: "com.seaweed.feed.hole.eat.io", name: "Feed a Hole", os: "ANDROID" },
  { id: 301, package_name: "com.seaweed.hero.merge.master", name: "Hero Merge Master", os: "ANDROID" },
  { id: 302, package_name: "com.seaweed.run.baby.ice.health", name: "Run Baby Run", os: "ANDROID" },
  { id: 303, package_name: "com.seaweed.tank.io.epic.squad", name: "Epic Squad.io", os: "ANDROID" },
  { id: 304, package_name: "com.seaweed.triple.sweets.match.crunchy", name: "Crunchy Match", os: "ANDROID" },
  { id: 311, package_name: "com.stacity.desert.jewel.match", name: "Desert Jewel", os: "ANDROID" },
  { id: 314, package_name: "com.stacity.sort.color.water.drink", name: "Water Color Sorting", os: "ANDROID" },
  { id: 316, package_name: "com.stacity.tile.match.travel", name: "Go Match Tiles", os: "ANDROID" },
  { id: 318, package_name: "com.stacity.wood.block.blockscapes", name: "Wood Plus Block", os: "ANDROID" },
  { id: 320, package_name: "com.stacity.woody.block.mania", name: "Woody Block Mania", os: "ANDROID" },
  { id: 325, package_name: "com.tripleclick.brickbreaker.fruit", name: "Fruit break", os: "ANDROID" },
  { id: 327, package_name: "com.tripleclick.kawaii.block.puzzle", name: "Kawaii Block Puzzle", os: "ANDROID" },
  { id: 328, package_name: "com.tripleclick.tile.block.puzzle.game", name: "Tile Triple Puzzle", os: "ANDROID" },
  { id: 330, package_name: "com.tripleclick.tile.zoo.puzzle", name: "Tile Zoo Master", os: "ANDROID" },
  { id: 336, package_name: "com.seaweed.blockblaster.block.puzzle", name: "Blockblaster: Color Block Crush", os: "ANDROID" },
  { id: 340, package_name: "com.augustgame.ocean.match.blast", name: "Ocean Match Blast", os: "ANDROID" },
  { id: 347, package_name: "com.halfpint.garden.block", name: "Garden Block", os: "ANDROID" },
  { id: 349, package_name: "com.lemonade.classic.falling.brick", name: "Classic Falling Brick", os: "ANDROID" },
  { id: 358, package_name: "com.stacity.sliding.puzzle.drop", name: "Sliding Puzzle Drop", os: "ANDROID" },
  { id: 369, package_name: "com.augustgame.vehicles.sort", name: "Vehicles Sort Quest", os: "ANDROID" },
  { id: 371, package_name: "com.augustgame.screw.color.sort.puzzle", name: "Color Bolts Sort Puzzle", os: "ANDROID" },
  { id: 373, package_name: "com.seaweed.boar.jam.sort.puzzle.game", name: "Boat Jam", os: "ANDROID" },
  { id: 374, package_name: "com.stacity.trivia.frenzy.word.quiz.puzzle", name: "Trivia Frenzy: Word Quiz Puzzle", os: "ANDROID" },
  { id: 378, package_name: "com.augustgame.water.slide.sort", name: "Water Slide Sort", os: "ANDROID" },
  { id: 379, package_name: "com.augustgame.color.brick.stack.blast.sort", name: "Color Brick Stack", os: "ANDROID" },
  { id: 380, package_name: "com.augustgame.screw.sort.pin.puzzle", name: "Screw Out 3D Sort Puzzle", os: "ANDROID" },
  { id: 382, package_name: "com.augustgame.flower.match.sort", name: "Flower Match Sort", os: "ANDROID" },
  { id: 383, package_name: "com.augustgame.soda.can.sorting.game", name: "Soda Can Sorting", os: "ANDROID" },
  { id: 386, package_name: "com.augustgame.color.hexa.stack.sort", name: "Color Hexa Stack", os: "ANDROID" },
  { id: 387, package_name: "com.augustgame.color.soda.cap.sort", name: "Soda Cap Sort", os: "ANDROID" },
  { id: 170, package_name: "com.puzzle.hoop.stack.color.sort", name: "Hoop Stack 3D", os: "IOS" },
];

const Overview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState<string>('');
  const [filteredGames, setFilteredGames] = useState<Game[]>(gameList);

  const getImagePath = (packageName: string) => `/src/images/game/${packageName}.webp`;

  const handleGameClick = (selectedGame: string) => {
    dispatch(addFilter({
      fromDate: "",
      toDate: "",
      gamePackageName: selectedGame,
      partner: "",
      country: "",
      campaign: ""
    }));
    navigate("/dashboard/game/details");
  };

  const deboundedSearch = useCallback(
    debounce((term: string) => {
      if (term) {
        term = term.trim().toLowerCase();
        const filtered = gameList.filter(game =>
           game.name.toLocaleLowerCase().includes(term)
        || game.package_name.toLocaleLowerCase().includes(term)
        );
        setFilteredGames(filtered);
      } 
      else {
        setFilteredGames(gameList);
      }
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setKeywords(term);
    deboundedSearch(term);
  };

  return (
    <React.Fragment>
      <input
        className="mb-4 p-2 border rounded-md w-full shadow-3 border-stroke bg-white dark:border-strokedark dark:bg-boxdark cursor-pointer hover:shadow-blue-300 hover:shadow-lg transition duration-300 dark:text-white"
        placeholder="Search package name or name ........."
        value={keywords}
        onChange={handleSearch}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-6 2xl:gap-7.5">
        {filteredGames.map((game) => (
          <GameDataStats
            key={game.id}
            name={game.name}
            os={game.os}
            image={getImagePath(game.package_name)}
            onClick={() => handleGameClick(game.package_name)}
          />
        ))}
      </div>
    </React.Fragment>
  );
};

export default Overview;
