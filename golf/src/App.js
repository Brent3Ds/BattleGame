import './main.css'

const App = () => {
  return <div style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: '#F5EC5E', display: 'flex', flexDirection: 'column'}}>
	{/* Info Header - Displays who's turn it is currently (Player 1's Turn / Player 2s Turn) */}
	<div style={{width: '100%', background: '#F6F6F6', height: 80}}>
		<h2 style={{textAlign: 'center', fontSize: 28, fontFamily: 'sans-serif', margin: 0, paddingTop: 20}}>Player 1's Turn</h2>
	</div>

	{/* Game Board - Displays the main content for the current phase of the game (Spell Selecting / Battle Information) */}
	<div style={{flexGrow: 3, width: '100%', borderBottom: '2px solid #333', background: '#000', color: '#FFF'}}>
	what
	</div>

	{/* Player Input Field - Where the player's spells/hotkeys are */}
	<div style={{background: '#F3F3F3', width: '100%', flexGrow: 1, display: 'flex'}}>

		{/* Player 1 - Left Side */}
		<div style={{width: '50%', borderRight: '1px solid #333'}}>
		Player 1
		</div>

		{/* Player 2 - Right Side */}
		<div style={{width: '50%', borderLeft: '1px solid #333'}}>
		Player 2
		</div>
	</div>

  </div>
}

export default App;
