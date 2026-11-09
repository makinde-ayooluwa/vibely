import { createContext, useContext, useEffect, useState } from "react";

const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function prepare() {
            await new Promise((r) => setTimeout(r, 5000));
            setLoading(true);
        }
        prepare();
    }, [])

    const blogs = [
        {
            id: "blog-1",
            user: {
                id: "storepilot-official",
                name: "Makinde Ayooluwa",
                avatar: "https://i.pravatar.cc/150?img=12"
            },
            title: "Welcome to the StorePilot Blog",
            text: "Welcome to the StorePilot Blog! This is where we share product updates, business tips, ecommerce ideas, and stories from sellers using the platform. Whether you are starting a new store or growing an existing one, you will find useful information here. Follow along for practical guides and updates.",
            excerpt: "Product updates, ecommerce ideas, practical guides, and stories for growing businesses.",
            category: "Announcements",
            tags: ["StorePilot", "Ecommerce", "Updates"],
            image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop",
            video: "",
            images: [],
            likes: 0,
            comments: 0,
            views: 0,
            createdAt: "2026-11-09T08:00:00.000Z",
            updatedAt: "2026-11-09T08:00:00.000Z"
        },
        {
            id: "blog-2",
            user: {
                id: "storepilot-official",
                name: "Makinde Ayooluwa",
                avatar: "https://i.pravatar.cc/150?img=12"
            },
            title: "How to Build Trust with Your Online Customers",
            text: "Trust is one of the most important parts of running an online store. Make your product descriptions clear, use accurate product photos, display your delivery and return policies, and respond politely to customer questions. Keep customers updated after they place an order. Consistent communication helps shoppers feel confident when buying from your store.",
            excerpt: "Clear product information, honest policies, and good communication help customers shop with confidence.",
            category: "Business Tips",
            tags: ["Customer Service", "Trust", "Online Business"],
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&auto=format&fit=crop",
            video: "",
            images: [],
            likes: 0,
            comments: 0,
            views: 0,
            createdAt: "2026-11-08T10:30:00.000Z",
            updatedAt: "2026-11-08T10:30:00.000Z"
        },
        {
            id: "blog-3",
            user: {
                id: "storepilot-official",
                name: "Makinde Ayooluwa",
                avatar: "https://i.pravatar.cc/150?img=12"
            },
            title: "Simple Ways to Improve Your Product Listings",
            text: "A good product listing helps customers understand exactly what they are buying. Use a clear product title, write a useful description, upload bright and accurate images, and include important details such as size, colour, material, and specifications. Organise products into relevant categories and keep prices and stock information up to date.",
            excerpt: "Improve your product pages with clear titles, helpful descriptions, accurate images, and updated stock details.",
            category: "Ecommerce",
            tags: ["Products", "Product Listings", "Sales"],
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop",
            video: "",
            images: [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop"
            ],
            likes: 0,
            comments: 0,
            views: 0,
            createdAt: "2026-11-07T09:15:00.000Z",
            updatedAt: "2026-11-07T09:15:00.000Z"
        },
        {
            id: "blog-4",
            user: {
                id: "storepilot-official",
                name: "Makinde Ayooluwa",
                avatar: "https://i.pravatar.cc/150?img=12"
            },
            title: "Why Fast and Helpful Customer Support Matters",
            text: "Customers may need help before or after placing an order. Make it easy for them to contact your business, answer questions clearly, and provide useful updates when an order is delayed. If a problem occurs, explain the available solution and follow through. Helpful support can turn a difficult shopping experience into a reason for a customer to return.",
            excerpt: "Responsive support and clear order updates can improve the customer experience and encourage repeat purchases.",
            category: "Customer Service",
            tags: ["Support", "Customer Experience", "Business"],
            image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&auto=format&fit=crop",
            video: "",
            images: [],
            likes: 0,
            comments: 0,
            views: 0,
            createdAt: "2026-11-06T13:00:00.000Z",
            updatedAt: "2026-11-06T13:00:00.000Z"
        },
        {
            id: "blog-5",
            user: {
                id: "storepilot-official",
                name: "Makinde Ayooluwa",
                avatar: "https://i.pravatar.cc/150?img=12"
            },
            title: "Preparing Your Store for a Busy Sales Period",
            text: "Before a busy sales period, review your stock levels, check product prices, test your checkout process, and make sure your delivery information is easy to find. Prepare answers to common customer questions and plan how you will handle orders. A little preparation can help you manage more orders without losing track of important details.",
            excerpt: "Prepare stock, prices, checkout, delivery information, and customer support before a sales rush.",
            category: "Business Tips",
            tags: ["Sales", "Planning", "Inventory"],
            image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&auto=format&fit=crop",
            video: "",
            images: [],
            likes: 0,
            comments: 0,
            views: 0,
            createdAt: "2026-11-05T11:45:00.000Z",
            updatedAt: "2026-11-05T11:45:00.000Z"
        }
    ];
    const feedData = [
        {
            id: "1",
            type: "video",
            title: "Store Grand Opening Highlight",
            description: "Come see how we kicked off our brand new location! 🚀",
            uri: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
            images: [],
            thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop",
            likes: 1240,
            comments: 45,
            shares: 18,
            views: 8200,
            createdAt: "2026-11-09T08:00:00.000Z",
            user: {
                id: "storepilot-official",
                name: "StorePilot Official",
                avatar: "https://i.pravatar.cc/150?img=12"
            }
        },
        {
            id: "2",
            type: "image",
            title: "New Collection Showcase",
            description: "Fresh arrivals just dropped. Explore the latest collection in our store!",
            uri: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&auto=format&fit=crop",
            images: [],
            thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&auto=format&fit=crop",
            likes: 310,
            comments: 12,
            shares: 5,
            views: 1900,
            createdAt: "2026-11-08T14:20:00.000Z",
            user: {
                id: "urban-threads",
                name: "Urban Threads",
                avatar: "https://i.pravatar.cc/150?img=47"
            }
        },
        {
            id: "3",
            type: "carousel",
            title: "Behind the Scenes: Eco Packaging",
            description: "Every order is packed with care. Take a look behind the scenes!",
            uri: "",
            images: [
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1555529771-835f59fc5efe?w=1200&auto=format&fit=crop"
            ],
            thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop",
            likes: 850,
            comments: 29,
            shares: 14,
            views: 4600,
            createdAt: "2026-11-07T12:10:00.000Z",
            user: {
                id: "ecocraft-store",
                name: "EcoCraft Store",
                avatar: "https://i.pravatar.cc/150?img=32"
            }
        },
        {
            id: "4",
            type: "video",
            title: "Quick Packing Routine",
            description: "Watch how we prepare customer orders carefully before dispatch.",
            uri: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
            images: [],
            thumbnail: "https://images.unsplash.com/photo-1586522868346-7b3f6f9e3c2b?w=1200&auto=format&fit=crop",
            likes: 540,
            comments: 18,
            shares: 9,
            views: 3100,
            createdAt: "2026-11-06T16:45:00.000Z",
            user: {
                id: "storepilot-official",
                name: "StorePilot Official",
                avatar: "https://i.pravatar.cc/150?img=12"
            }
        },
        {
            id: "5",
            type: "image",
            title: "Workspace Inspiration",
            description: "A clean and organised workspace makes it easier to plan, create, and serve customers.",
            uri: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop",
            images: [],
            thumbnail: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop",
            likes: 225,
            comments: 8,
            shares: 3,
            views: 1100,
            createdAt: "2026-11-05T09:30:00.000Z",
            user: {
                id: "storepilot-official",
                name: "StorePilot Official",
                avatar: "https://i.pravatar.cc/150?img=12"
            }
        },
        {
            id: "6",
            type: "carousel",
            title: "Featured Products of the Week",
            description: "Swipe through a few products selected by our store team.",
            uri: "",
            images: [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&auto=format&fit=crop"
            ],
            thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop",
            likes: 430,
            comments: 16,
            shares: 7,
            views: 2500,
            createdAt: "2026-11-04T15:00:00.000Z",
            user: {
                id: "urban-threads",
                name: "Urban Threads",
                avatar: "https://i.pravatar.cc/150?img=47"
            }
        },
        {
            id: "7",
            type: "video",
            title: "A Look Inside Our Store",
            description: "Take a short tour and discover what is available in our store.",
            uri: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            images: [],
            thumbnail: "https://images.unsplash.com/photo-1604712566247-460e8e7c5c9f?w=1200&auto=format&fit=crop",
            likes: 690,
            comments: 24,
            shares: 11,
            views: 3900,
            createdAt: "2026-11-03T10:15:00.000Z",
            user: {
                id: "ecocraft-store",
                name: "EcoCraft Store",
                avatar: "https://i.pravatar.cc/150?img=32"
            }
        },
        {
            id: "8",
            type: "image",
            title: "Order Ready for Dispatch",
            description: "Another order packed and ready to make its way to its new owner.",
            uri: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&auto=format&fit=crop",
            images: [],
            thumbnail: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&auto=format&fit=crop",
            likes: 375,
            comments: 14,
            shares: 6,
            views: 2100,
            createdAt: "2026-11-02T13:40:00.000Z",
            user: {
                id: "storepilot-official",
                name: "StorePilot Official",
                avatar: "https://i.pravatar.cc/150?img=12"
            }
        }
    ];

    return (
        <ResourceContext.Provider value={{ blogs, feedData, loading }}>
            {children}
        </ResourceContext.Provider>
    )
}

export const useResource = () => {
    return useContext(ResourceContext);
}