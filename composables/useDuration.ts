export function useDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 3600 % 60);
    const hDisplay = h > 9 ? h : "0" + h;
    const mDisplay = m > 9 ? m : "0" + m;
    const sDisplay = s > 9 ? s : "0" + s;
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
}