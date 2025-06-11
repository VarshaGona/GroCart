import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get('/api/admin/orders');
    setOrders(res.data.orders || res.data); // handle both paginated and non-paginated
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Order ID</th><th>User</th><th>Status</th><th>Total</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id}</td>
              <td>{o.userId?.name || 'N/A'}</td>
              <td>{o.status}</td>
              <td>${o.totalAmount}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders; 