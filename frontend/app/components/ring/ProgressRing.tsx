// components/ring/ProgressRing.tsx

interface ProgressRingProps {
  value: number; // Percentage value (0 to 100)
  size?: number; // Diameter of the ring
  strokeWidth?: number; // Thickness of the ring
  color?: string; // Color of the ring
}

const ProgressRing = ({
  value,
  size = 100,
  strokeWidth = 10,
  color = 'gray',
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="mx-auto">
      <circle
        stroke="#e5e7eb" // Background circle color (gray)
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size / 5}
        fill={color}
        fontWeight="bold"
      >
        {value}%
      </text>
    </svg>
  );
};

export default ProgressRing;
