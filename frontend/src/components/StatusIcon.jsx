import Up from "../assets/Up.png";
import Down from "../assets/Down.png";

export default function StatusIcon({ status }) {
  const isUp = status?.toLowerCase() === "up";

  return (
    <img
      src={isUp ? Up : Down}
      alt={isUp ? "Up" : "Down"}
      style={{ width: 24, height: 24 }}
    />
  );
}
