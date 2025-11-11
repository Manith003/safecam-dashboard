import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  trend?: string;
  color: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-gray-900 bg-neutral-900 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-white">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-white text-xl font-semibold">
                {displayValue}
              </h3>
              {trend && <span className="text-[#00C853] text-sm">{trend}</span>}
            </div>
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
