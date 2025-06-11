import { useState, useEffect } from 'react';
import axios from 'axios';

const initialForm = { name: '', category: '', description: '', price: '', image: '', stock: '' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch {
      setError('Failed to fetch products');
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/admin/product/${editingId}`, form);
      } else {
        await axios.post('/api/admin/product', form);
      }
      setForm(initialForm);
      setEditingId(null);
      fetchProducts();
    } catch {
      setError('Failed to save product');
    }
  };

  const handleEdit = product => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this product?')) {
      await axios.delete(`/api/admin/product/${id}`);
      fetchProducts();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4">
        {['name', 'category', 'description', 'price', 'image', 'stock'].map(field => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border rounded px-2 py-1"
            required
          />
        ))}
        <button type="submit" className="col-span-2 bg-primary-600 text-white py-2 rounded">
          {editingId ? 'Update' : 'Add'} Product
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts; 