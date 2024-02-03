export function millisecondsToHHMMSS(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;

    const pad = (num: number) => num.toString().padStart(2, "0");

    return `${pad(hours)}:${pad(remainingMinutes)}:${pad(remainingSeconds)}`;
}
