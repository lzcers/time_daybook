export function millisecondsToHHMMSS(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;

    const pad = (num: number) => num.toString().padStart(2, "0");

    return `${pad(hours)}:${pad(remainingMinutes)}:${pad(remainingSeconds)}`;
}

export function unixtimeToHours(milliseconds: number) {
    const millisecondsPerSecond = 1000;
    const secondsPerHour = 3600;
    return (milliseconds / (millisecondsPerSecond * secondsPerHour)).toFixed(2);
}

export function convertMillisecondsToDaysHours(milliseconds: number): string {
    const millisecondsPerSecond = 1000;
    const secondsPerHour = 3600;
    const hoursPerDay = 24;

    const totalHours = milliseconds / (millisecondsPerSecond * secondsPerHour);

    const days = Math.floor(totalHours / hoursPerDay);

    const remainingHours = (totalHours % hoursPerDay).toFixed(1);

    const result = `${days} days ${remainingHours} hours`;

    return result;
}
