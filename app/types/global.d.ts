declare module "@worstone/vue-aplayer" {
  import type { DefineComponent } from "vue";
  const APlayer: DefineComponent;
  export default APlayer;
}

interface Window {
  $openList?: () => void;
}
