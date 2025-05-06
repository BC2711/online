import { Card, List, Typography } from "@material-tailwind/react";
import CheckboxInput from "./CheckBox";

interface SidebarProps {
    header: string;
    types: string[];
}

export default function Sidebar({ header, types }: SidebarProps) {
    return (
        <Card className="max-w-[280px] border-l-0 border-t-0 rounded-none">
            <Card.Header className="mx-4 mb-0 mt-3 h-max">
                <Typography className="font-semibold">{header}</Typography>
            </Card.Header>
            <Card.Body className="pl-4">
                <List>
                    {types.map((type, index) => (
                        <CheckboxInput key={index} checkBoxType={type} />
                    ))}
                </List>
            </Card.Body>
        </Card>
    );
}
