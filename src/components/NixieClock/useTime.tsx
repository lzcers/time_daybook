import { useRef } from "react";

export default function useTime() {
    const hoursRef = useRef<HTMLDivElement>(null);
    const minsRef = useRef<HTMLDivElement>(null);
    const secsRef = useRef<HTMLDivElement>(null);

    const getTime = (unixTime: number) => {
        const seconds = Math.floor(unixTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingSeconds = seconds % 60;
        const remainingMinutes = minutes % 60;

        return {
            hours: hours <= 9 ? `0${hours}` : `${hours}`,
            mins: remainingMinutes <= 9 ? `0${remainingMinutes}` : `${remainingMinutes}`,
            secs: remainingSeconds <= 9 ? `0${remainingSeconds}` : `${remainingSeconds}`,
        };
    };

    const setDigits = (section: HTMLDivElement, digit: string) => {
        const tens = [...section.children[0].children];
        const ones = [...section.children[1].children];

        tens.forEach(number => number.classList.remove("active"));
        tens[Number(digit[0])].classList.add("active");
        ones.forEach(number => number.classList.remove("active"));
        ones[Number(digit[1])].classList.add("active");
    };

    const tick = (unixTime: number) => {
        const time = getTime(unixTime);
        setDigits(hoursRef.current!, time.hours);
        setDigits(minsRef.current!, time.mins);
        setDigits(secsRef.current!, time.secs);
    };

    return {
        hoursRef,
        minsRef,
        secsRef,
        tick,
    };
}
