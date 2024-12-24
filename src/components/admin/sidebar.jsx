import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, MessageSquare, Users, Calendar, Menu, LayoutDashboard, LogOut, Ticket } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const { sellerId } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState("");
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        img: '',
        description: '',
        category: '',
        rating: 0,
        productId: '',
        inStockValue: 0,
        soldStockValue: 0
    });
    const location = useLocation();

    // Set initial state based on screen size and update on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        // Set initial state
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard />, path: `/admin/${sellerId}` },
        { name: 'Products', icon: <Package />, path: `/admin/products/${sellerId}` },
        { name: 'Orders', icon: <ShoppingBag />, path: `/admin/orders/${sellerId}` },
        { name: 'Complaints', icon: <MessageSquare />, path: `/admin/complaints/${sellerId}` },
        { name: 'Customers', icon: <Users />, path: `/admin/customers/${sellerId}` },
        { name: 'Calendar', icon: <Calendar />, path: `/admin/calendar/${sellerId}` },
        { name: 'Coupons', icon: <Ticket />, path: `/seller/coupons/${sellerId}` },
    ];

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) { // Only allow toggle on smaller screens
            setIsOpen(!isOpen);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target?.files);
        setImages(files);
        // setImages((prevImages) => [...prevImages, ...files].slice(0, 5)); // Keep only the first 5
    };

    const generateProductId = () => {
        const randomId = Math.floor(100000 + Math.random() * 900000).toString();
        setProductData({...productData, productId: randomId});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData({...productData, [name]: value});
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.SERVER_URI}/admin/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ sellerId })
            });
            
            if(response.ok) {
                navigate('/seller/login');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleSubmit = async () => {
        try{
            const imageTexts = await Promise.all(
                images.map((image)=> {
                    return new Promise ((resolve, reject) => {
                        const reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = (error) => reject(error);
                    })
                })
            )
            const imageText = imageTexts.join(' ');
            const updatedProductData = {...productData, img:imageText, description:description};
            const response = await fetch(`${process.env.SERVER_URI}/create-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({productData: updatedProductData})
            });
            if(response.ok) {
                setShowDialog(false);
                setImages([]);
                setProductData({
                    name: '',
                    price: '',
                    img: '',
                    description: '',
                    category: '',
                    rating: 0,
                    productId: '',
                    inStockValue: 0,
                    soldStockValue: 0
                });
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <>
            {/* Toggle button for small screens */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 p-2 rounded-lg hover:bg-pink-200 lg:hidden z-50"
            >
                <Menu size={24} />
            </button>

            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 sm:w-[80%]">
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <div>
                            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                            <input
                                type="text"
                                name="name"
                                placeholder="Product Name"
                                value={productData.name}
                                onChange={handleInputChange}
                                className="w-full mb-3 p-2 border rounded"
                            />
                            <input
                                type="text"
                                name="price"
                                placeholder="Price"
                                value={productData.price}
                                onChange={handleInputChange}
                                className="w-full mb-3 p-2 border rounded"
                            />
                            <input
                                type="file"
                                multiple
                                name="img"
                                onChange={handleImageUpload}
                                className="w-full mb-3 p-2 border rounded"
                            />
                            <div className="mb-3 flex gap-1 flex-wrap">
                            {images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(image)}
                                        alt={`preview-${index}`}
                                        className="w-20 h-20 object-cover rounded-lg mr-2"
                                    />
                                    ))}
                                </div>
                            <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                value={productData.category}
                                onChange={handleInputChange}
                                className="w-full mb-3 p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="rating"
                                placeholder="Rating"
                                value={productData.rating}
                                onChange={handleInputChange}
                                className="w-full mb-3 p-2 border rounded"
                                min={0}
                                max={5}
                            />
                            <div className="flex mb-3">
                                <input
                                    type="text"
                                    name="productId"
                                    placeholder="Product ID"
                                    value={productData.productId}
                                    readOnly
                                    className="w-2/3 p-2 border rounded-l"
                                />
                                <button
                                    onClick={generateProductId}
                                    className="w-1/3 bg-pink-500 text-white p-2 rounded-r"
                                >
                                    Generate
                                </button>
                            </div>
                            <input
                                type="number"
                                name="inStockValue"
                                placeholder="In Stock"
                                value={productData.inStockValue}
                                onChange={handleInputChange}
                                className="w-full mb-3 p-2 border rounded"
                            />
                            <input
                                type="number"
                                name="soldStockValue"
                                placeholder="Sold Stock"
                                value={productData.soldStockValue}
                                onChange={handleInputChange}
                                className="w-full mb-3 p-2 border rounded"
                            />

                            </div>
                            <div className='sm:flex-row h-auto w-full'>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Product Description ...' className='w-full border border-gray-300 sm:mt-10 sm:min-w-[200px] px-2 py-1 rounded-lg' >

                                </textarea>
                            </div>
                        </div>
                        <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => setShowDialog(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-pink-500 text-white rounded"
                                >
                                    Save Product
                                </button>
                            </div>
                    </div>
                </div>
            )}

            <div className={`fixed left-0 top-0 h-screen bg-pink-50 shadow-lg transition-all duration-300 flex flex-col 
                lg:translate-x-0 lg:w-64
                ${isOpen ? 'w-64' : 'w-20'}`}
            >
                <div className="flex items-center p-4">
                    {isOpen && (
                        <div className="text-2xl font-bold text-gray-800">
                            Mera Bestie
                        </div>
                    )}
                </div>

                <div className="flex-grow flex items-center">
                    <ul className="space-y-2 p-4 w-full">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center p-2 rounded-lg transition-colors
                                        ${location.pathname === item.path 
                                            ? 'bg-pink-200 text-pink-800' 
                                            : 'text-gray-700 hover:bg-pink-100'}
                                        ${isOpen ? 'justify-start space-x-4' : 'justify-center'}`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {isOpen && <span>{item.name}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto">
                    <div className={`p-4 ${isOpen ? 'block' : 'hidden'}`}>
                        <p className="text-center text-gray-600 mb-2">
                            Please, manage your products through the button below.
                        </p>
                        <button 
                            onClick={() => setShowDialog(true)}
                            className="w-full bg-pink-300 text-white py-2 rounded hover:bg-pink-400 mb-2"
                        >
                            + Add Product
                        </button>
                        
                        <Link 
                            to="/" 
                            className="w-full flex items-center justify-center bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
                        >
                            Go to Website
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded hover:bg-red-600"
                        >
                            <LogOut className="mr-2" size={18} />
                            Logout
                        </button>
                    </div>

                    <footer className={`text-center text-gray-500 text-sm p-4 ${isOpen ? 'block' : 'hidden'}`}>
                        Mera Bestie Admin Dashboard © 2024
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Sidebar;