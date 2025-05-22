import { useContext, useState } from 'react';
import { ShopContext } from "../context/ShopContext";
import { toast } from 'react-toastify';
import axios from 'axios';

const NewsLetterBox = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {backendUrl } = useContext(ShopContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`${backendUrl}/api/newsletter/subscribe`, { email });

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Subscription failed.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="text-center px-4 py-8">
      <p className="text-2xl font-semibold text-gray-800">Stay in Style</p>
      <p className="text-gray-500 mt-3">
        Subscribe for exclusive offers, new arrivals & fashion tips — straight to your inbox.
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="w-full sm:w-2/3 md:w-1/2 flex items-center gap-3 mx-auto my-6 border border-gray-300 rounded overflow-hidden"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white text-xs px-6 py-3 hover:bg-gray-900 disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'SUBSCRIBE'}
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
