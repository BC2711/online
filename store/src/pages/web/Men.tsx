import { Breadcrumb, Typography } from '@material-tailwind/react';
import GalleryWithTab from '../../components/Gallery';
import Sidebar from '../../components/SideBar';

const Men = () => {
    return (

        <main className="w-full mt-16 pt-10 font-serif items-center justify-center">
            <Breadcrumb className='pl-4 pr-4'>
                <Breadcrumb.Link href="/docs">Men</Breadcrumb.Link>
                <Breadcrumb.Separator />
                <Breadcrumb.Link href="/docs/components">New Arrivals</Breadcrumb.Link>
                <Breadcrumb.Separator />
                <Breadcrumb.Link href="#">New Arrivals</Breadcrumb.Link>
            </Breadcrumb>
            <hr className="border-t border-gray-300 mt-4" />
            <div className="container p-4 items-center justify-center">
                <Typography variant='h1'>
                    New Arrivals

                </Typography>
                <p className="font-sans hover:font-serif">
                    Checkout out the latest release of Basic Tees, new and improved with four openings!
                </p>
                <hr className="border-t border-gray-300 mt-4" />
                <div className="flex flex-colomn ">
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <Sidebar header='Colors' types={['White', 'Beige', 'Blue', 'Brown', 'Green', 'Purple']} />
                            <Sidebar header='Sizes' types={['XS', 'S', 'M', 'L', 'XL', '2XL']} />
                        </div>
                        <div className='col-span-3'>
                            <GalleryWithTab />
                        </div>
                    </div>
                </div>
            </div>
        </main>

    );
}

export default Men;
