// Popup.tsx
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

interface PopupProps {
  isOpen: boolean;
  type: "requirements" | "match";
  requirements?: { id: string; text: string; met: boolean }[];
  isMatch?: boolean | null;
  className?: string;
}

export function Popup({ isOpen, type, requirements, isMatch, className }: PopupProps) {
  if (!isOpen || (type === "match" && isMatch === null)) return null;

  return (
    <div
      className={`absolute left-full ml-4 bg-card p-3 rounded-lg shadow-lg z-10 ${
        type === "requirements" ? "w-72 p-4 -translate-y-1/2" : "whitespace-nowrap"
      } ${className}`}
    >
      {type === "requirements" && requirements ? (
        <>
          <h4 className="text-sm font-semibold mb-2">Password must contain:</h4>
          <ul>
            {requirements.map((req) => (
              <li key={req.id} className={`flex items-center transition-colors duration-300 ${req.met ? "text-green-500" : "text-red-500"}`}>
                {req.met ? <CheckIcon className="h-4 w-4 mr-2" /> : <Cross1Icon className="h-4 w-4 mr-2" />}
                <span>{req.text}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={`flex items-center transition-colors duration-300 ${isMatch ? "text-green-500" : "text-red-500"}`}>
          {isMatch ? <CheckIcon className="h-4 w-4 mr-2" /> : <Cross1Icon className="h-4 w-4 mr-2" />}
          <span>{isMatch ? "Passwords match" : "Passwords do not match"}</span>
        </div>
      )}
      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-card transform -translate-y-1/2 rotate-45" />
    </div>
  );
}