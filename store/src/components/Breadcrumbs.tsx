import { Breadcrumb } from "@material-tailwind/react";

export default function Breadcrumbs({}) {
    return (
        <Breadcrumb className='mt-[20px]'>
            <Breadcrumb.Link href="/docs">Men</Breadcrumb.Link>
            <Breadcrumb.Separator />
            <Breadcrumb.Link href="/docs/components">New Arrivals</Breadcrumb.Link>
            <Breadcrumb.Separator />
            <Breadcrumb.Link href="#">New Arrivals</Breadcrumb.Link>
        </Breadcrumb>
    );
}
