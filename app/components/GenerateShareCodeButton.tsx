import { Button } from "@heroui/button";
import { RandomSvg } from "./IconSvg";

interface GenerateShareCodeButtonProps {
    codeSetter: (code: string) => void;
}

export default function GenerateShareCodeButton({
    codeSetter,
}: GenerateShareCodeButtonProps) {
    return (
        <Button
            className="h-14 w-16"
            aria-label="Generate Share Code"
            isIconOnly
            size="lg"
            variant="solid"
            onPress={() => {
                const chars = "ABCDEFGHJKMNPQRSTUVWXYZ";
                let code = "";
                for (let i = 0; i < 6; i++) {
                    code += chars.charAt(
                        Math.floor(Math.random() * chars.length)
                    );
                }
                codeSetter(code);
            }}
        >
            <RandomSvg />
        </Button>
    );
}
