import './main.css'
import {useState, useEffect} from "react";
import {spells} from "./json/spells";
import Spell from "./components/Spell";

const App = () => {

	const [turn, setTurn] = useState(1);
	const [player1, setPlayer1] = useState([]);
	const [player2, setPlayer2] = useState([]);
	const [phase, setPhase] = useState("draft");

	useEffect(() => {
		//check if each player has 4 spells
		if(player1.length === 4 && player2.length === 4){
			//set the phase to battle!
			setPhase("battle");
		}
	}, [player1.length, player2.length])

	const handleClick= (spell) => {
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



  return <div style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: '#F5EC5E', display: 'flex', flexDirection: 'column'}}>
	{/* Info Header - Displays who's turn it is currently (Player 1's Turn / Player 2s Turn) */}
	<div style={{width: '100%', background: '#F6F6F6', height: 80}}>
		<h2 style={{textAlign: 'center', fontSize: 28, fontFamily: 'sans-serif', margin: 0, paddingTop: 20}}>Player {turn}'s Turn</h2>
	</div>

	{/* Game Board - Displays the main content for the current phase of the game (Spell Selecting / Battle Information) */}
	{phase === 'draft' 
		? <div style={{display: "flex", flexGrow: 3, width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#000'}}>
		{spells.map((spell, index) => {
			return <div onClick={() => handleClick(spell)}><Spell spell={spell}/></div>
		})}
		</div>
		
		: <div style={{display: "flex", flexGrow: 3, width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#000'}}>
			Battle
		</div>
	}

	{/* Player Input Field - Where the player's spells/hotkeys are */}
	<div style={{background: '#F3F3F3', width: '100%', flexGrow: 1, display: 'flex'}}>

		{/* Player 1 - Left Side */}
		<div style={{display: "flex", width: '50%', borderRight: '1px solid #333'}}>
		<h2>Player 1</h2>
		{
			player1.map((spell, index) => {
				return <div onClick={() => handleClick(spell)}><Spell name={spell.name} source={spell.source}/></div>
			})
		}
		</div>

		{/* Player 2 - Right Side */}
		<div style={{display: "flex", width: '50%', borderLeft: '1px solid #333'}}>
		<h2>Player 2</h2>
		{
			player2.map((spell, index) => {
				return <div onClick={() => handleClick(spell)}><Spell name={spell.name} source={spell.source}/></div>
			})
		}
		</div>
	</div>

  </div>
}

export default App;
