import { Setter, onCleanup } from "solid-js";

export function useDebounce<T>(signalSetter: Setter<T>, delay: number) {
    let timerHandle: NodeJS.Timeout;
    function debouncedSignalSetter(value: any) {
        clearTimeout(timerHandle);
        timerHandle = setTimeout(() => signalSetter(value), delay);
    }
    onCleanup(() => clearInterval(timerHandle));
    return debouncedSignalSetter;
}