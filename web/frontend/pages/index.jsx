import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { TitleBar } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const fetch = useAuthenticatedFetch();

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
      console.log(val.variants)
      return ({
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
    })});

    const ExpandedComponent = ({ data }) => {
      const variants = data.varient !== null ? data.varient.map((val) => val.title) : [];
      
      return (
        <div>
          {variants.map((variant, index) => {
           return(
            variant==='Default Title'?(<><p key={index} className="text-center">No Variants Available</p></>):(<p key={index}>{variant}</p>)
           )
          })}
        </div>
      );
    };

  
    
    const handleEdit = async (e, pid) => {
        console.log(pid, "edit");
    };

    const handleDelete = async (e, pid) => {
        console.log(pid, "delete");
    };

    return (
        <>
            <TitleBar title="App name" primaryAction={null} />
            <div className="head my-5">
                <h3 className="font-bold text-lg text-center">Products</h3>
            </div>
            <div className="container w-5/6 mx-auto py-3">
                <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                />
            </div>
        </>
    );
}
