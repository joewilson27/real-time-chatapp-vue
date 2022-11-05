<script>
import SocketioService from '../services/socketio.service.js';

export default {
  name: 'App',
  components: {},
  created() {
    // this will initialize our socket connection 
    // when the created() hook fires in the lifecycle of the App component
    SocketioService.setupSocketConnection();
  },
  beforeUnmount() {
    // This will disconnect our socket as soon as the component 
    // gets destroyed. Also, the socket would get disconnected 
    // when we close the tab automatically, 
    // whether we handle it here or not, tab closing is handled by default.
    SocketioService.disconnect();
  },
}
</script>