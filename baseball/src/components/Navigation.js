import { Button } from './Button'
const socket = new WebSocket('ws://localhost:3001');

const Navigation = () => {
    return <div style={{width: '100%', height: 80, background: '#333', margin: 0, display: 'flex', justifyContent: 'space-between'}}>
        {/* Title */}
        <h1 style={{margin: 0, padding: '10px 0 0 10px', fontSize: 48, fontFamily: 'sans-serif', color: '#F3F3F3', userSelect: 'none'}}>Battleboard</h1>
        <Button style={{marginTop: 20, marginRight: 20}} onClick={() => socket.send('Hello Server!')}>Send Message to Server</Button>
    </div>
}

export default Navigation