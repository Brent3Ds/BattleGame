import './main.css'
import React from "react"
import {useState, useEffect} from "react";
import {spells} from "./json/spells";
import {heroes} from "./json/heroes";
import Card from "./components/Card";
import ProgressBar from "./components/ProgressBar";
import { v4 as uuidv4 } from 'uuid';

const App = () => {
	const [phase, setPhase] = useState("heroSelect");
	//Phases:
	//heroSelect
	//draft
	//battle
	//battleOver
	const [turn, setTurn] = useState(1);
	const [player1SpellList, setPlayer1SpellList] = useState([]);
	const [player2SpellList, setPlayer2SpellList] = useState([]);
	const [player1Spell, setPlayer1Spell] = useState();
	const [player2Spell, setPlayer2Spell] = useState();
	const [player1Hero, setPlayer1Hero] = useState()
	const [player2Hero, setPlayer2Hero] = useState()
	const [result, setResult] = useState();


	//adds a uuid to the players id attribute
	const createUniquePlayer = (player) => {
		let newPlayer = {...player}
		newPlayer.id = uuidv4();
		return newPlayer
		
	}

	//Check if ready to move from to next phase
	useEffect(() => {
		//check if each player has selected a hero
		if(player1Hero && player2Hero){
			setPhase("draft")
		}

		//check if each player has 4 spells
		if(player1SpellList.length === 4 && player2SpellList.length === 4){
			//set the phase to battle!
			setPhase("battle");
		}

	}, [player1SpellList.length, player2SpellList.length, player1Hero, player2Hero])

	//this function takes the selected spells for the player and opponent and returns the damage done and state of debuffs
	const evaluateCombat = (p1Hero, p2Hero, p1Spell, p2Spell) => {

		console.log("player 1: ", p1Hero);
		console.log("player 2: ", p2Hero);

		//console.log("player 1 spell: ", p1Spell);
		//console.log("player 2 spell: ", p2Spell);

		let player1Damage = p1Spell.damage;
		let player2Damage = p2Spell.damage;

		let player1Heal = p1Spell.heal;
		let player2Heal = p2Spell.heal;

		let player1Shield = p1Spell.shield;
		let player2Shield = p2Spell.shield;

		//iterate through the debuffs
		/*
		if(p1Hero.debuffs){
			for(let i=0; i<p1Hero.debuffs; i++){
				//
				console.log("p1 debuff: ");
			}
		}
		*/

		//if player 2's spell contains debuffs
		if(p2Spell.damageOverTime){
			//add the debuff to player 1
			p1Hero.debuffs.push({damage: p2Spell.damageOverTime, duration: p2Spell.damageOverTimeDuration, type: "damage"});

		}
		if(p2Spell.defenceOverTime){
			console.log("p2 defence");
			//add the debuff to player 2
			p2Hero.debuffs.push({defence: p2Spell.defenceOverTime, duration: p2Spell.defenceOverTimeDuration, type: "defence"});
		}

		//if player 1's spell contains debuffs
		if(p1Spell.damageOverTime){
			//add the debuff to player 1
			p2Hero.debuffs.push({damage: p1Spell.damageOverTime, duration: p1Spell.damageOverTimeDuration, type: "damage"});

		}
		if(p1Spell.defenceOverTime){
			console.log("p1 defence");
			//add the debuff to player 2
			p1Hero.debuffs.push({defence: p1Spell.defenceOverTime, duration: p1Spell.defenceOverTimeDuration, type: "defence"});
		}

		console.log("hero 1 debuffs", p1Hero.debuffs);
		console.log("hero 2 debuffs", p2Hero.debuffs);

	}

	//Check if both players have submitted attacks
	useEffect(() => {

		//if both spells are selected
		if(player1Spell && player2Spell){
		//call the evaluate combat function

		console.log("player1  before: ", player1Hero);
		console.log("player2 before: ", player2Hero);
			let response = evaluateCombat(player1Hero, player2Hero, player1Spell, player2Spell);
		}

		//delay to show the spells cast
		setTimeout(function(){
			//set player attacks to null
			setPlayer1Spell(null);
			setPlayer2Spell(null);
		}, 3000);


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
			let uniqueHero = createUniquePlayer(hero);
			console.log("Player 1: ", uniqueHero);
			console.log("Turn: ", turn);
			setPlayer1Hero(uniqueHero)
			setTurn(2)
		} else {
			let uniqueHero = createUniquePlayer(hero);
			console.log("Player 2: ", uniqueHero);
			console.log("Turn: ", turn);
			setPlayer2Hero(uniqueHero)
			setTurn(1)
		}
	}

	//happens during draft phase
	const selectSpell = (spell) => {
		//check which player is selecting the spell
		if(turn === 1){
			//add the selected spell to player 
			//check if the spell is already in the players spells
			if(!player1SpellList.includes(spell)){
				setPlayer1SpellList([...player1SpellList, spell]);
				//set turn to 2
				setTurn(2);
			}

		}else{
			//add the selected spell to player 2
			//check if the spell is already in the players spells
			if(!player2SpellList.includes(spell)){
				setPlayer2SpellList([...player2SpellList, spell]);
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
				return <div style={{display: "flex", flexGrow: 3,flexDirection: "column", width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#FFF'}}>
					<h1 style={{fontSize:200, textAlign: "center", width: "100%", color: "#c49c04"}}>
						Player {result} won the battle!
					</h1>
					<div style={{margin: "0 auto"}}>
						<button style={{textAlign: "center",fontSize: 45, marginBottom: 5, width: 250, height: 75, background: "#979799"}}
						onClick = {() => {
							setPhase("heroSelect")
							setTurn(1);
							setPlayer1SpellList([])
							setPlayer2SpellList([])
							setPlayer1Spell(null)
							setPlayer2Spell(null)
							setPlayer1Hero(null)
							setPlayer2Hero(null)
							setResult(null)
						}}>
							Rematch
						</button>
					</div>

					</div>
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
					{player1Hero && <ProgressBar width={(((player1Hero.health - 0) * (100 - 0)) / (player1Hero.maxHealth - 0)) + 0} color="green"/>}
					{player1Hero && <ProgressBar width={(((player1Hero.shield - 0) * (100 - 0)) / (player1Hero.maxShield - 0)) + 0} color="blue"/>}
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
					{player1SpellList.map((spell, index) => {
							return <Card key={index} spell={spell} action={() => castSpell(spell)}/>
						})}
				</div>
			</div>
		</div>

		{/* Player 2 - Right Side */}
		<div style={{display: "flex", flexDirection: 'column', width: '50%', borderLeft: '1px solid #333'}}>
			<div style={{display: 'flex', justifyContent: 'space-evenly'}}>
				<div>
					{player2Hero && <ProgressBar width={(((player2Hero.health - 0) * (100 - 0)) / (player2Hero.maxHealth - 0)) + 0} color="green"/>}
					{player2Hero && <ProgressBar width={(((player2Hero.shield - 0) * (100 - 0)) / (player2Hero.maxShield - 0)) + 0} color="blue"/>}
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
					{player2SpellList.map((spell, index) => {
							return <Card key={index} spell={spell} action={() => castSpell(spell)}/>
						})}
				</div>
			</div>
		</div>
	</div>

  </div>
}

export default App;
