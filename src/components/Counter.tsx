import { createSignal } from "solid-js";
import "./Counter.css";
import { useDebounce } from "~/hooks/debounceHook";

export default function Counter() {
  const [likeCount, setLikeCount] = createSignal(0);
  const debouncedSetLikeCount = useDebounce(setLikeCount, 1000);
  return (
    <button class="increment"
      onClick={function like() {
        debouncedSetLikeCount(likeCount() + 1);
      }}
    >
      {likeCount()} likes
    </button>
  );
}
