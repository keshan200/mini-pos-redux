import type { Customer } from "../types/Customer";
import { BASE_URL ,apiClient } from "./apiClient";



const CUSTOMERS_API_URL = `${BASE_URL}/customers`


//async - nawathila inana fuction
  const getAllUser = async () : Promise<Customer[]> =>{
  const response = await apiClient.get(CUSTOMERS_API_URL)
  return response.data;//
}



const deleteCustomer = async (_id: string): Promise<void> => {
  await apiClient.delete(`${CUSTOMERS_API_URL}/${_id}`, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

const addCustomers = async (customerData: Omit<Customer, "_id">) => {
  const response = await apiClient.post<Customer>(CUSTOMERS_API_URL, customerData, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  return response.data;
};

const updateCustomer = async (_id: string, customerData: Omit<Customer, "_id">) => {
  const response = await apiClient.put<Customer>(`${CUSTOMERS_API_URL}/${_id}`, customerData, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  return response.data;
};


export {getAllUser,deleteCustomer,addCustomers,updateCustomer}