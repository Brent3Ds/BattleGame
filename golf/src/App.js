import './main.css'
import React from "react"
import {useState, useEffect} from "react";
import {spells} from "./json/spells";
import {heroes} from "./json/heroes";
import Card from "./components/Card";
import ProgressBar from "./components/ProgressBar";

const App = () => {

	const [turn, setTurn] = useState(1);
	const [player1, setPlayer1] = useState([]);
	const [player2, setPlayer2] = useState([]);
	const [phase, setPhase] = useState("heroSelect");
	const [player1Spell, setPlayer1Spell] = useState();
	const [player2Spell, setPlayer2Spell] = useState();
	const [player1Debuffs] = useState([])
	const [player2Debuffs] = useState([])
	const [player1Hero, setPlayer1Hero] = useState()
	const [player2Hero, setPlayer2Hero] = useState()
	const [result, setResult] = useState();

	//Check if ready to move from to next phase
	useEffect(() => {
		//check if each player has selected a hero
		if(player1Hero && player2Hero){
			setPhase("draft")
		}

		//check if each player has 4 spells
		if(player1.length === 4 && player2.length === 4){
			//set the phase to battle!
			setPhase("battle");
		}

	}, [player1.length, player2.length, player1Hero, player2Hero])

	//this function takes the selected spells for the player and opponent and returns the damage done and state of debuffs
	const evaluateCombat = (playerAttack, opponentAttack, playerDebuffs, opponentDebuffs) => {

		let damage = opponentAttack.damage;
		let debuffs = playerDebuffs;
		let shield = 0;

		//if the playerAttack contains shield add the value to shield
		if(playerAttack.shield){
			shield += playerAttack.shield;
		}

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
			debuffs.push({damage: opponentAttack.damageOverTime, duration: opponentAttack.damageOverTimeDuration, type: opponentAttack.overTimeType})
		}

		return {damage, shield, debuffs}

	}

	//Check if both players have submitted attacks
	useEffect(() => {

		let p1Shield = 0;
		let p2Shield = 0;

		if(player1Spell && player2Spell){
			//subtract attacks from players health
			let p1Update = evaluateCombat(player1Spell, player2Spell, player1Debuffs, player2Debuffs);
			let p2Update = evaluateCombat(player2Spell, player1Spell, player2Debuffs, player1Debuffs);

			//check if either player or both players will die this turn
			//Player Tie
			if(player1Hero.health - p1Update.damage + player1Spell.heal <= 0 && player2Hero.health - p2Update.damage + player2Spell.heal <= 0){
				setPhase("battleOver");
				setResult(0);
			//Player 2 Wins
			}else if(player1Hero.health - p1Update.damage + player1Spell.heal <= 0 && player2Hero.health - p2Update.damage + player2Spell.heal >= 0){
				setPhase("battleOver");
				setResult(2);
			//Player 1 Wins
			}else if(player1Hero.health - p1Update.damage + player1Spell.heal >= 0 && player2Hero.health - p2Update.damage + player2Spell.heal <= 0){
				setPhase("battleOver");
				setResult(1);
			}else{
				//Continue the battle

				p1Shield = player1Hero.shield + p1Update.shield;
				p2Shield = player2Hero.shield + p2Update.shield;

					//Player 1
					if(p1Shield > 0){
						let difference = p1Shield - p1Update.damage;

						if(difference < 0){
							//add the difference to the players health
							setPlayer1Hero({...player1Hero, health: player1Hero.health + difference + player1Spell.heal})
							//set the shield to 0
							setPlayer1Hero({...setPlayer1Hero, shield: 0});						
						}else{
							//subtract the damage from the shield
							setPlayer1Hero({...player1Hero, shield: p1Shield - p1Update.damage});
						}

					}else{
						setPlayer1Hero({...player1Hero, health: player1Hero.health - p1Update.damage + player1Spell.heal, shield: player1Hero.shield + p1Update.shield})
					}

					//Player 2
					if(p2Shield > 0){
						let difference = p2Shield - p2Update.damage;

						if(difference < 0){
							setPlayer2Hero({...player2Hero, health: player2Hero.health + difference + player2Spell.heal, shield: 0})
						}else{
							setPlayer2Hero({...player2Hero, shield: p2Shield - p2Update.damage});
						}
					}else{
						setPlayer2Hero({...player2Hero, health: player2Hero.health - p2Update.damage + player2Spell.heal, shield: player2Hero.shield + p2Update.shield})
					}
				
				//delay to show the spells cast
				setTimeout(function(){
					//set player attacks to null
					setPlayer1Spell(null);
					setPlayer2Spell(null);
				}, 3000);
			}
		}
	//eslint-disable-next-line
	}, [player1Spell, player2Spell])

	//happens during battle phase
	const castSpell = (spell) => {
		//only call if phase is battle
		if(phase === "battle" && (!player1Spell || !player2Spell)){
			//add the spell selected to the current players attack selection
			if(turn === 1){
				//set player 1 spell
				setPlayer1Spell(spell);
				//change the turn to player 2
				setTurn(2);
			}else{
				//set player 2 spell
				setPlayer2Spell(spell);
				//set the turn to player 1
				setTurn(1);
			}

		}

	}

	const selectHero = (hero) => {
		if(turn === 1) {
			setPlayer1Hero(hero)
			setTurn(2)
		} else {
			setPlayer2Hero(hero)
			setTurn(1)
		}
	}

	//happens during draft phase
	const selectSpell = (spell) => {
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
		if (player1Spell && player2Spell) {
			return <Card spell={attack} /> 
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
				return <div style={{display: "flex", flexGrow: 3, width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#FFF'}}>
					{heroes.map((hero, index) => {
						return <Card key={index} spell={hero} action={() => selectHero(hero)}/>
					})}
				</div>
			case 'draft':
				return <div style={{display: "flex", flexGrow: 3, flexWrap: 'wrap', width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#000'}}>
					{spells.map((spell, index) => {
						return <Card key={index} spell={spell} action={() => selectSpell(spell)}/>
					})}
				</div>
			case 'battle':
				return <div style={{display: "flex", flexGrow: 3, width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#FFF'}}>
					{/* Player 1 Selection */}
					<div style={{width: '50%'}}>
						{playerCard(player1Spell)}
					</div>
					{/* Player 2 Selection */}
					<div style={{width: '50%'}}>
						{playerCard(player2Spell)}
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

	{/* Game Board - Displays the main content for the current phase of the game (Card Selecting / Battle Information) */}
	{showCurrentPhase()}

	{/* Player Input Field - Where the player's spells/hotkeys are */}
	<div style={{background: '#F3F3F3', width: '100%', flexGrow: 1, display: 'flex'}}>

		{/* Player 1 - Left Side */}
		<div style={{display: "flex", flexDirection: 'column', width: '50%', borderLeft: '1px solid #333'}}>
			<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
				<div>
					{player1Hero && <ProgressBar width={(((player1Hero.health - 0) * (100 - 0)) / (player1Hero.maxHealth - 0)) + 0}/>}
					<div style={{display: 'flex'}}>
						<h2>Player 1</h2>
						{player1Hero && <img alt="" src={player1Hero.source} style={{height: 30, width: 30, marginTop: 20}}/>}
					</div>
					
					{player1Hero && 
						<div>
							<h2>Health: {player1Hero.health}</h2>
							<h2>Defence: {player1Hero.defence}</h2>
							<h2>Shield: {player1Hero.shield}</h2>
						</div>	
					}
				</div>
				<div style={{display: 'flex'}}>
					{player1.map((spell, index) => {
							return <Card key={index} spell={spell} action={() => castSpell(spell)}/>
						})}
				</div>
			</div>
		</div>

		{/* Player 2 - Right Side */}
		<div style={{display: "flex", flexDirection: 'column', width: '50%', borderLeft: '1px solid #333'}}>
			<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
				<div>
					{player2Hero && <ProgressBar width={(((player2Hero.health - 0) * (100 - 0)) / (player2Hero.maxHealth - 0)) + 0}/>}
					<div style={{display: 'flex'}}>
						<h2>Player 2</h2>
						{player2Hero && <img alt="" src={player2Hero.source} style={{height: 30, width: 30, marginTop: 20}}/>}
					</div>
					
					{player2Hero && 
						<div>
							<h2>Health: {player2Hero.health}</h2>
							<h2>Defence: {player2Hero.defence}</h2>
							<h2>Shield: {player2Hero.shield}</h2>
						</div>	
					}
				</div>
				<div style={{display: 'flex'}}>
					{player2.map((spell, index) => {
							return <Card key={index} spell={spell} action={() => castSpell(spell)}/>
						})}
				</div>
			</div>
		</div>
	</div>

  </div>
}

export default App;
