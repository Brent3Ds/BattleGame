import Navigation from './components/Navigation'
const socket = new WebSocket('ws://localhost:3001');

// Connection opened
// socket.addEventListener('open', function (event) {
//     socket.send('Hello Server!');
// });

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});
const App = () => {
  return <div style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: '#F5F5F5'}}>
    <Navigation />
  </div>
}

export default App;