const container_styles = {
	border: '1px solid #7D7D7D',
	borderRadius: 4,
	width: 200,
	height: 200,
	margin: '10px 0 0 10px',
	cursor: 'pointer',
	userSelect: 'none',
	background: '#FFF'
}



const Spell = ({ spell }) => {
	return <div style={container_styles}>
		<div style={{margin: 10, display: 'flex'}}>
			<h4 style={{margin: 0, padding: '20 0 0 20', flexGrow: 2}}>{spell.name}</h4>
			<img alt="" src={spell.source} style={{height: 30, width: 30}}/>
		</div>

		<div>

		</div>
		{Object.keys(spell).filter(e => e !== 'name' && e !== "source").map((key, index) => {
			return <p style={{margin: 0, padding: 5}}>{key}</p>
		})}

	</div>
};

export default Spell;