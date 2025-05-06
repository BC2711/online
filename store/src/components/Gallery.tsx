import { Tabs } from "@material-tailwind/react";
import EcommerceCard from "./EcommerceCard";

interface ImageProps {
    imageLink: string;
    title: string;
    price: string;
    category: string;
}

interface DataProps {
    label: string;
    value: string;
    images: ImageProps[];
}

interface GalleryProps {
    data?: DataProps[];
}



export default function GalleryWithTab({ data = [] }: GalleryProps) {
    return (
        <Tabs defaultValue="html">
            <Tabs.List className="w-full">
                {data.map(({ label, value }) => (
                    <Tabs.Trigger key={value} value={value} className="w-full">
                        {label}
                    </Tabs.Trigger>
                ))}
                <Tabs.TriggerIndicator />
            </Tabs.List>
            {data.map(({ value, images }) => (
                <Tabs.Panel
                    className="grid grid-cols-2 gap-4 md:grid-cols-3"
                    key={value}
                    value={value}
                >
                    {images?.map((imageLink, index) => (
                        <div key={index}>
                            <EcommerceCard
                                key={index}
                                image={imageLink.imageLink}
                                title={imageLink.title}
                                price={imageLink.price}
                                description={imageLink.category}
                                category={imageLink.category}
                                rating={5}
                            />
                        </div>
                    ))}
                </Tabs.Panel>
            ))}
        </Tabs>
    );
}
