import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../hooks";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

export default function HomePage() {
    const fetch = useAuthenticatedFetch();
    const [products, setProducts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [productDesc, setProductDesc] = useState("");

    useEffect(() => {
        getAllProducts();
    }, []);
    const getAllProducts = async () => {
        try {
            const pr = await fetch("/api/all-products");
            const allProducts = await pr.json();
            setProducts(allProducts);
        } catch (err) {
            console.log(err);
        }
    };

    const columns = [
        {
            name: "#",
            selector: (row) => row.sn,
            sortable: true,
        },
        {
            name: "Image",
            selector: (row) => row.image,
        },
        {
            name: "Name",
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => row.action,
        },
    ];
    const data = products?.products?.map((val, i) => {
        return {
            sn: i + 1,
            image:
                val.image !== null ? (
                    <img
                        src={val.image?.src}
                        alt="Product Image"
                        className="m-2 h-20 w-20 mx-auto"
                    />
                ) : (
                    "No image found."
                ),
            title: <p className="font-bold">{val.title}</p>,
            varient: val.variants !== null ? val.variants : "No Variant Found.",
            action: (
                <>
                    <div className="flex space-x-5">
                        <button
                            type="button"
                            className="p-3 bg-green-600 hover:bg-green-700 text-white text-md rounded-lg"
                            onClick={(e) => handleEdit(e, val.id)}
                        >
                            <FaPencilAlt />
                        </button>
                        <button
                            type="button"
                            className="p-3 bg-rose-600 hover:bg-rose-700 text-white text-md rounded-lg"
                            onClick={(e) => handleDelete(e, val.id)}
                        >
                            {" "}
                            <FaTrash />
                        </button>
                    </div>
                </>
            ),
        };
    });

    // const ExpandedComponent = ({ data }) => {
    //     const variants =
    //         data.varient !== null ? data.varient.map((val) => val.title) : [];
    //         console.log(variants)

    //         const columns = [
    //             {
    //                 name: "#",
    //                 selector: (row) => row.sn,
    //                 sortable: true,
    //             },
    //             {
    //                 name: "Image",
    //                 selector: (row) => row.image,
    //             },
    //             {
    //                 name: "Name",
    //                 selector: (row) => row.title,
    //                 sortable: true,
    //             },
    //             {
    //                 name: "Action",
    //                 selector: (row) => row.action,
    //             },
    //         ];

    //     return (
    //         <div>
    //             {variants.map((variant, index) => {
    //                 return variant === "Default Title" ? (
    //                     <>
    //                         <p key={index} className="text-center">
    //                             No Variants Available
    //                         </p>
    //                     </>
    //                 ) : (
    //                     <p key={index}>{variant}</p>
    //                 );
    //             })}
    //         </div>
    //     );
    // };

    const handleEdit = async (e, pid) => {
        console.log(pid, "edit");
        const product = products.products.filter((x) => x.id === pid);
        setProductId(product[0].id);
        setProductName(product[0].title);
        setProductDesc(product[0].body_html);
        setModalIsOpen(true);
    };

    const handleDelete = async (e, pid) => {
        console.log(pid, "delete");
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
        setProductId("");
        setProductName("");
        setProductDesc("");
    };
    const handleProductUpdate = async (e) => {
        e.preventDefault();
        const productData = {
            productId: productId,
            productName: productName,
            productDesc: productDesc,
        };

        try {
            const pr = await fetch("/api/update-product",{
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ body: productData })
               });
            const res = await pr.json();
            console.log(res)
            // setProducts(allProducts);
        } catch (err) {
            console.log(err);
        }
        // console.log(JSON.stringify(productData));
    };

    return (
        <>
            <TitleBar title="Product CRUD" primaryAction={null} />
            <div className="head my-5">
                <h3 className="font-bold text-lg text-center">Products</h3>
            </div>
            <div className="container w-5/6 mx-auto py-3 select-none">
                <DataTable columns={columns} data={data} pagination />
            </div>

            {modalIsOpen && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none select-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl h-2/3 w-2/3 md:w-5/6 sm:w-5/6">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t w-full text-center">
                                    <h3 className="text-3xl mb-2 font-semibold">
                                        Edit Product
                                    </h3>
                                    <span
                                        className="text-xl font-bold hover:text-white cursor-pointer px-3 hover:bg-red-600 hover:rounded-md"
                                        onClick={handleModalClose}
                                    >
                                        &times;
                                    </span>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <input
                                        type="text"
                                        id="product_title"
                                        className="rounded-none mt-4 rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Product Name"
                                        value={productName}
                                        onChange={(e) =>
                                            setProductName(e.target.value)
                                        }
                                    />

                                    <textarea
                                        id="product_desc"
                                        className="rounded-none rounded-r-lg mt-2 bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Product Description"
                                        value={productDesc}
                                        onChange={(e) =>
                                            setProductDesc(e.target.value)
                                        }
                                    >
                                        {productDesc}
                                    </textarea>
                                </div>

                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 md:text-sm sm:text-sm text-xs hover:bg-red-600 hover:text-white hover:rounded-md"
                                        type="button"
                                        onClick={handleModalClose}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="text-white bg-green-600 rounded-lg font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 md:text-sm sm:text-sm text-xs hover:bg-green-700"
                                        type="button"
                                        onClick={(e) => handleProductUpdate(e)}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </>
    );
}
