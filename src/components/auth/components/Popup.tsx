import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

interface PopupProps {
  isOpen: boolean;
  type: "requirements" | "match";
  requirements?: { id: string; text: string; met: boolean }[];
  isMatch?: boolean | null;
  className?: string;
}

export function Popup({ isOpen, type, requirements, isMatch, className }: PopupProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768); // Adjust threshold as needed
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isOpen || (type === "match" && isMatch === null)) return null;

  return (
    <div
      className={`
        ${isMobile ? "relative w-full mt-2" : "absolute left-full ml-4"}
        bg-card p-3 rounded-lg shadow-lg z-20
        ${type === "requirements" && !isMobile ? "w-72 p-4 -translate-y-1/2" : "w-full"}
        ${type === "match" && !isMobile ? "whitespace-nowrap" : ""}
        ${className}
      `}
      role="alert"
      aria-live="polite"
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
      {!isMobile && (
        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-card transform -translate-y-1/2 rotate-45" />
      )}
    </div>
  );
}