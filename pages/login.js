import { useState } from 'react';
import { useRouter } from 'next/router';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', JSON.stringify(data));
            router.push('/records');
        } else {
            console.error('Login failed:', data.message);
        }
    };

    return (
        <div>
        <div className="flex justify-center items-center h-screen">
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
        >
            Login
        </button>
    </div>
    
    
        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-blue-200  z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                    <span
                        className="text-gray-700 text-2xl absolute top-4 right-4 cursor-pointer"
                        onClick={() => setIsModalOpen(false)}
                    >
                        &times;
                    </span>
                    <h2 className="text-xl font-semibold mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full mt-2 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
    
    );
};

export default Login;
