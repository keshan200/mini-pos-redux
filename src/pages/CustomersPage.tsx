import React, { useState,useEffect  } from "react"
import { MdAdd } from "react-icons/md"
import Dialog from "../components/Dialog"
import type { Customer } from "../types/Customer"
import CustomersTable from "../components/tables/CustomersTable"
import CustomerForm from "../components/forms/CustomerForm"
import { customersData } from "../data/data"
import axios from "axios"
import toast from 'react-hot-toast';
import { getAllUser} from "../services/customerService"

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(customersData)
 const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)



const fetchData = async ()=>{

    try{
    setIsLoading(true)
    const result =  await getAllUser()
    setCustomers(result)
    
    }catch(error){
       if(axios.isAxiosError(error)){
        toast.error("error.message")
    }else{
        toast.error("somthing went worng")
    }

    }finally{
      setIsLoading(false)
    }
  }


  useEffect(()=>{
    fetchData()

  },[])

  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setIsAddDialogOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditDialogOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }





  

  const handleFormSubmit = (customerData: Omit<Customer, "_id">) => {
    if (selectedCustomer) {
      // Update existing customer
      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === selectedCustomer._id ? { ...customerData, _id: selectedCustomer._id } : customer
        )
      )
      setIsEditDialogOpen(false)
      console.log("Customer updated:", { ...customerData, _id: selectedCustomer._id })
    } else {
      // Add new customer
      const newCustomer = { ...customerData, _id: Date.now() }
      setCustomers((prev) => [...prev, newCustomer])
      setIsAddDialogOpen(false)
      console.log("Customer added:", newCustomer)
    }
    setSelectedCustomer(null)
  }

  const confirmDelete = () => {
    if (selectedCustomer) {
      setCustomers((prev) => prev.filter((customer) => customer._id !== selectedCustomer._id))
      console.log("Customer deleted:", selectedCustomer)
      setIsDeleteDialogOpen(false)
      setSelectedCustomer(null)
    }
  }

  const cancelDialog = () => {
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setIsDeleteDialogOpen(false)
    setSelectedCustomer(null)
  }


 if (isLoading) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '5px solid #ccc',
          borderTop: '5px solid rgb(79, 22, 250)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <p
        style={{
          marginTop: '20px',
          fontSize: '18px',
          color: 'rgb(79, 22, 250)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        Loading...
      </p>
      <style>
        {` 
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}


  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold text-gray-800'>Customers</h1>
          <button
            onClick={handleAddCustomer}
            className='flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150'
          >
            <MdAdd className='w-5 h-5' />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Customers Table */}
        <CustomersTable customers={customers} onEdit={handleEditCustomer} onDelete={handleDeleteCustomer} />

        {/* Add Customer Dialog */}
        <Dialog
          isOpen={isAddDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            // This will be handled by the form submission
            const form = document.querySelector("form") as HTMLFormElement
            if (form) {
              form.requestSubmit()
            }
          }}
          title='Add New Customer'
        >
          <CustomerForm onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Edit Customer Dialog */}
        <Dialog
          isOpen={isEditDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement
            if (form) {
              form.requestSubmit()
            }
          }}
          title='Edit Customer'
        >
          <CustomerForm customer={selectedCustomer} onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog isOpen={isDeleteDialogOpen} onCancel={cancelDialog} onConfirm={confirmDelete} title='Delete Customer'>
          <p className='text-gray-700'>
            Are you sure you want to delete <strong>{selectedCustomer?.name}</strong>? This action cannot be undone.
          </p>
        </Dialog>
      </div>
    </div>
  )
}

export default CustomersPage


