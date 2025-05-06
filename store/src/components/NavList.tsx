import * as React from "react";
import {
    Button,
    IconButton,
    Typography,
    Collapse,
    Navbar,
} from "@material-tailwind/react";
import {
    Archive,
    Menu,
    MultiplePages,
    ProfileCircle,
    SelectFace3d,
    Xmark,
    Search,
    Cart,
} from "iconoir-react";

const LINKS = [
    {
        icon: MultiplePages,
        title: "Women",
        href: "#",
    },
    {
        icon: ProfileCircle,
        title: "Men",
        href: "#",
    },
    {
        icon: SelectFace3d,
        title: "Company",
        href: "#",
    },
    {
        icon: Archive,
        title: "Stores",
        href: "#",
    },
];

function NavList() {
    return (
        <ul className="mt-0 flex flex-col gap-x-3 gap-y-1.5 lg:mt-0 lg:flex-row lg:items-center">
            {LINKS.map(({ icon: Icon, title, href }) => (
                <li key={title}>
                    <Typography
                        as="a"
                        href={href}
                        type="small"
                        className="flex items-center gap-x-2 p-1 hover:text-primary"
                    >
                        <Icon className="h-4 w-4" />
                        {title}
                    </Typography>
                </li>
            ))}
        </ul>
    );
}

export default function StickyNavbar() {
    const [openNav, setOpenNav] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener(
            "resize",
            () => window.innerWidth >= 960 && setOpenNav(false),
        );
    }, []);

    return (
        <>
            <Navbar className="fixed top-0 left-0 w-full flex items-center justify-center bg-blue-500 text-white rounded-none shadow-none">
                <Typography variant="h6">
                    Get free delivery on orders over $100
                </Typography>
            </Navbar>
            <Navbar className="fixed top-0 left-0 w-full h-16 items-center justify-center mt-10 mb-16 rounded-none shadow-none border-0">
                <div className="flex items-center">
                    <Typography
                        as="a"
                        href="#"
                        type="small"
                        className="ml-2 mr-2 block py-1 font-semibold"
                    >
                        logo
                    </Typography>
                    <hr className="ml-1 mr-1.5 hidden h-5 w-px border-l border-t-0 border-secondary-dark lg:block" />
                    <div className="hidden lg:block">
                        <NavList />
                    </div>
                    <Typography className="hidden lg:ml-auto lg:inline-block"> Sign In </Typography>
                    <hr className="ml-5 mr-5 hidden h-5 w-px border-l border-t-0 border-secondary-dark lg:block" />
                    <div className="flex flex-row gap-5">
                        <Typography className="flex items-center gap-x-2 p-1 hover:text-primary">
                            Create Account
                        </Typography>
                        <Typography className="flex items-center gap-x-2 p-1 hover:text-primary">
                            Category
                        </Typography >
                        <Typography className="flex items-center gap-x-2 p-1 hover:text-primary">
                            <Search />
                        </Typography>
                        <Typography className="flex items-center gap-x-2 p-1 hover:text-primary">
                            <Cart />
                        </Typography>
                    </div>
                    <IconButton
                        size="sm"
                        variant="ghost"
                        color="secondary"
                        onClick={() => setOpenNav(!openNav)}
                        className="ml-auto grid lg:hidden"
                    >
                        {openNav ? (
                            <Xmark className="h-4 w-4" />
                        ) : (
                            <Menu className="h-4 w-4" />
                        )}
                    </IconButton>
                </div>
                <Collapse open={openNav}>
                    <NavList />
                    <Button isFullWidth size="sm" className="mt-4">
                        Sign In
                    </Button>
                </Collapse>
                <hr className="border-t border-gray-300 mt-4" />
            </Navbar>           
           
        </>
    );
}
