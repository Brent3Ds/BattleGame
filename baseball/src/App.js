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
  return <div>
    <button onClick={() => socket.send('Hello Server!')}>Crick</button>
  </div>
}

export default App;