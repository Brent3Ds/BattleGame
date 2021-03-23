import './main.css'
import {useState, useEffect} from "react";
import {spells} from "./json/spells";
import Spell from "./components/Spell";

const App = () => {

	const [turn, setTurn] = useState(1);
	const [player1, setPlayer1] = useState([]);
	const [player2, setPlayer2] = useState([]);
	const [phase, setPhase] = useState("draft");
	const [player1Attack, setPlayer1Attack] = useState();
	const [player2Attack, setPlayer2Attack] = useState();
	const [player1Health, setPlayer1Health] = useState(1000);
	const [player2Health, setPlayer2Health] = useState(1000);
	const [player1Debuffs, setPlayer1Debuffs] = useState([])
	const [player2Debuffs, setPlayer2Debuffs] = useState([])
	const [result, setResult] = useState();

	//Check if ready to move from Draft to Battle phase
	useEffect(() => {
		//check if each player has 4 spells
		if(player1.length === 4 && player2.length === 4){
			//set the phase to battle!
			setPhase("battle");
		}
	}, [player1.length, player2.length])

	//this function takes the selected spells for the player and opponent and returns the damage done and state of debuffs
	const evaluateCombat = (playerAttack, opponentAttack, playerDebuffs, opponentDebuffs) => {

		let damage = opponentAttack.damage;
		let debuffs = playerDebuffs;

		//if the player has debuffs add the damage from them to damage and decrement/remove the duration
		if(debuffs){
			for(let i=0; i<debuffs.length; i++){
				//add the debuff damage to the damage
				damage += debuffs[i].damage;
				//decrement the debuff duration / remove the debuff from the list
				if(debuffs[i].duration === 1){
					//remove the debuff
					debuffs.splice(i,1);
				}else{
					//decrement the debuff
					debuffs[i].duration -= 1;
				}
			}
		}

		//if the opponents spell includes damage over time add the debuff to the player
		if(opponentAttack.damageOverTime){
			//add the debuff to the list of debuffs
			debuffs.push({damage: opponentAttack.damageOverTime, duration: opponentAttack.damageOverTimeDuration})
		}

		return {damage, debuffs}

	}

	//Check if both players have submitted attacks
	useEffect(() => {

		if(player1Attack && player2Attack){
			//subtract attacks from players health
			let p1Update = evaluateCombat(player1Attack, player2Attack, player1Debuffs, player2Debuffs);
			let p2Update = evaluateCombat(player2Attack, player1Attack, player2Debuffs);

			//check if either player or both players will die this turn
			//Player Tie
			if(player1Health - p1Update.damage + player1Attack.heal <= 0 && player2Health - p2Update.damage + player2Attack.heal <= 0){
				setPhase("battleOver");
				setResult(0);
			//Player 2 Wins
			}else if(player1Health - p1Update.damage + player1Attack.heal <= 0 && player2Health - p2Update.damage + player2Attack.heal >= 0){
				setPhase("battleOver");
				setResult(2);
			//Player 1 Wins
			}else if(player1Health - p1Update.damage + player1Attack.heal >= 0 && player2Health - p2Update.damage + player2Attack.heal <= 0){
				setPhase("battleOver");
				setResult(1);
			}else{
				//update the state of p1 health and debuffs
				setPlayer1Health(player1Health - p1Update.damage + player1Attack.heal);
				setPlayer1Debuffs(p1Update.debuffs);

				//update the state of p2 health and debuffs
				setPlayer2Health(player2Health - p2Update.damage + player2Attack.heal);
				setPlayer2Debuffs(p2Update.debuffs);

				//delay to show the spells cast
				setTimeout(function(){
				//set player attacks to null
				setPlayer1Attack(null);
				setPlayer2Attack(null);
				}, 3000);
			}
		}
	//eslint-disable-next-line
	}, [player1Attack, player2Attack])

	//happens during battle phase
	const castSpell = (spell) => {
		//only call if phase is battle
		if(phase === "battle" && (!player1Attack || !player2Attack)){
			//add the spell selected to the current players attack selection
			if(turn === 1){
				//set player 1 spell
				setPlayer1Attack(spell);
				//change the turn to player 2
				setTurn(2);
			}else{
				//set player 2 spell
				setPlayer2Attack(spell);
				//set the turn to player 1
				setTurn(1);
			}

		}

	}

	//happens during draft phase
	const selectSpell= (spell) => {
		//check which player is selecting the spell
		if(turn === 1){
			//add the selected spell to player 
			//check if the spell is already in the players spells
			if(!player1.includes(spell)){
				setPlayer1([...player1, spell]);
				//set turn to 2
				setTurn(2);
			}

		}else{
			//add the selected spell to player 2
			//check if the spell is already in the players spells
			if(!player2.includes(spell)){
				setPlayer2([...player2, spell]);
				//set turn to 1
				setTurn(1);
			}
		}
	}

	const playerCard = (attack) => {
		if (player1Attack && player2Attack) {
			return <Spell spell={attack} /> 
		} else if (attack) {
			return <div style={{
				border: '1px solid #7D7D7D', 
				borderRadius: 4,
				width: 200,
				height: 170,
				margin: '10px 0 0 10px',
				cursor: 'pointer',
				userSelect: 'none',
				background: '#FFF'
			}}/>
		}
	}

	const showCurrentPhase = () => {
		switch(phase) {
			case 'heroSelect':
				//preparation for adding a hero/champion select stage
				return <div></div>
			case 'draft':
				return <div style={{display: "flex", flexGrow: 3, flexWrap: 'wrap', width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#000'}}>
					{spells.map((spell, index) => {
						return <Spell key={index} spell={spell} action={() => selectSpell(spell)}/>
					})}
				</div>
			case 'battle':
				return <div style={{display: "flex", flexGrow: 3, width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#FFF'}}>
					{/* Player 1 Selection */}
					<div style={{width: '50%'}}>
						{playerCard(player1Attack)}
					</div>
					{/* Player 2 Selection */}
					<div style={{width: '50%'}}>
						{playerCard(player2Attack)}
					</div>
				</div>
			case 'battleOver':
				return <div style={{display: "flex", flexGrow: 3, width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#FFF'}}>Player {result} won the battle!</div>
			default:
				return "Error in Switch Statement"
		}
	}

  return <div style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: '#F5EC5E', display: 'flex', flexDirection: 'column'}}>
	{/* Info Header - Displays who's turn it is currently (Player 1's Turn / Player 2s Turn) */}
	<div style={{width: '100%', background: '#F6F6F6', height: 80}}>
		<h2 style={{textAlign: 'center', fontSize: 28, fontFamily: 'sans-serif', margin: 0, paddingTop: 20}}>Player {turn}'s Turn</h2>
	</div>

	{/* Game Board - Displays the main content for the current phase of the game (Spell Selecting / Battle Information) */}
	{showCurrentPhase()}

	{/* Player Input Field - Where the player's spells/hotkeys are */}
	<div style={{background: '#F3F3F3', width: '100%', flexGrow: 1, display: 'flex'}}>

		{/* Player 1 - Right Side */}
		<div style={{display: "flex", flexDirection: 'column', width: '50%', borderLeft: '1px solid #333'}}>
			<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
				<h2>Player 1</h2>
				<h2>Health: {player1Health}</h2>
			</div>
			<div style={{display: 'flex'}}>
				{player1.map((spell, index) => {
						return <Spell key={index} spell={spell} action={() => castSpell(spell)}/>
					})}
			</div>
		</div>

		{/* Player 2 - Right Side */}
		<div style={{display: "flex", flexDirection: 'column', width: '50%', borderLeft: '1px solid #333'}}>
			<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
				<h2>Player 2</h2>
				<h2>Health: {player2Health}</h2>
			</div>
			<div style={{display: 'flex'}}>
				{player2.map((spell, index) => {
						return <Spell key={index} spell={spell} action={() => castSpell(spell)}/>
					})}
			</div>
		</div>
	</div>

  </div>
}

export default App;
