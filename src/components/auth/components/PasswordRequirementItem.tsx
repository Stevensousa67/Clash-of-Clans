import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

interface PasswordRequirementItemProps {
  isMet: boolean;
  text: string;
}

export function PasswordRequirementItem({ isMet, text }: PasswordRequirementItemProps) {
  return (
    <li className={`flex items-center transition-colors duration-300 ${isMet ? "text-green-500" : "text-red-500"}`}>
      {isMet ? (
        <CheckIcon className="h-4 w-4 mr-2" />
      ) : (
        <Cross1Icon className="h-4 w-4 mr-2" />
      )}
      <span>{text}</span>
    </li>
  );
}
