import { Checkbox, Typography } from "@material-tailwind/react";

export default function CheckboxInput({ checkBoxType }: { checkBoxType: string }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 p-2">
                <Checkbox id={checkBoxType}>
                    <Checkbox.Indicator />
                </Checkbox>
                <Typography
                    as="label"
                    htmlFor={checkBoxType}
                    className="cursor-pointer text-foreground"
                >
                    {checkBoxType}
                </Typography>
            </div>
        </div>
    );
}
