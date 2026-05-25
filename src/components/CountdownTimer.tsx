"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="grid grid-cols-4 gap-1 sm:gap-6">
        {["Jours", "Heures", "Min", "Sec"].map((label) => (
          <div key={label} className="text-center">
            <div className="text-lg sm:text-6xl lg:text-7xl font-black text-white tabular-nums">
              00
            </div>
            <div className="text-[7px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/50 mt-1 sm:mt-3">
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Jours" },
    { value: timeLeft.hours, label: "Heures" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-6">
      {timeUnits.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="text-lg sm:text-6xl lg:text-7xl font-black text-white tabular-nums leading-none">
            {String(unit.value).padStart(2, "0")}
          </div>
          <div className="text-[7px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/50 mt-1 sm:mt-3">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}