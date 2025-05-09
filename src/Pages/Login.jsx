import { useState, useEffect } from 'react';
import { Check, X, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        lang: '',
        about: ''
    });

    // UI state
    const [showPhone, setShowPhone] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Language options
    const languages = [
        { value: 'en', label: 'English (en)' },
        { value: 'fr', label: 'French (fr)' },
        { value: 'nl', label: 'Dutch (nl)' },
        { value: 'it', label: 'Italian (it)' },
        { value: 'de', label: 'German (de)' }
    ];

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Toggle phone number visibility
    const handlePhoneToggle = () => {
        setShowPhone(prev => !prev);
    };

    // Validate form
    useEffect(() => {
        const newErrors = {};

        // Name validation
        if (formData.name.trim() === '') {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
            newErrors.name = 'Name can only contain letters';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email.trim() === '') {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation (only if shown)
        if (showPhone && formData.phone.trim() !== '') {
            if (!/^\d{10}$/.test(formData.phone)) {
                newErrors.phone = 'Phone number must be exactly 10 digits';
            }
        }

        // Password validation
        if (formData.password.trim() === '') {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else {
            if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least 1 uppercase letter';
            } else if (!/[a-z]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least 1 lowercase letter';
            } else if (!/\d/.test(formData.password)) {
                newErrors.password = 'Password must contain at least 1 digit';
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
                newErrors.password = 'Password must contain at least 1 special character';
            }
        }

        // Language validation
        if (!formData.lang) {
            newErrors.lang = 'Please select a language';
        }

        // About validation
        if (formData.about.trim() === '') {
            newErrors.about = 'About is required';
        } else if (formData.about.trim().length < 50) {
            newErrors.about = `Minimum 50 characters required (currently ${formData.about.trim().length})`;
        } else if (formData.about.trim().length > 500) {
            newErrors.about = `Maximum 500 characters allowed (currently ${formData.about.trim().length})`;
        }

        setErrors(newErrors);
        setIsFormValid(Object.keys(newErrors).length === 0);
    }, [formData, showPhone]);

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Log the form data to console as required
        console.log(formData);

        if (isFormValid) {
            setIsSubmitting(true);

            try {
                // Make API call
                const response = await fetch('https://admin-staging.whydonate.dev/whydonate/assignment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.status === 200) {
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 5000);
                } else {
                    alert('Form submission failed. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred while submitting the form.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-4/5 lg:w-1/2 max-w-3xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Candidate Registration</h1>

                {showSuccess && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center justify-between">
                        <div className="flex items-center">
                            <Check className="mr-2" size={20} />
                            <span>Form submitted successfully!</span>
                        </div>
                        <button onClick={() => setShowSuccess(false)} className="text-green-700">
                            <X size={20} />
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block mb-1 font-medium">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                }`}
                            placeholder="Your full name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email Address */}
                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                }`}
                            placeholder="your.email@example.com"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Phone Toggle */}
                    <div className="flex items-center">
                        <label htmlFor="phoneToggle" className="mr-3 font-medium">
                            Phone Number
                        </label>
                        <button
                            type="button"
                            id="phoneToggle"
                            className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none ${showPhone ? 'bg-blue-500' : 'bg-gray-300'}`}
                            onClick={handlePhoneToggle}
                        >
                            <span
                                className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${showPhone ? 'translate-x-7' : 'translate-x-1'}`}
                            />
                        </button>
                        <span className="ml-2 text-sm text-gray-500">
                            {showPhone ? 'Yes' : 'No'}
                        </span>
                    </div>

                    {/* Phone Number (Conditional) */}
                    {showPhone && (
                        <div>
                            <label htmlFor="phone" className="block mb-1 font-medium">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder="1234567890"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>
                    )}

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block mb-1 font-medium">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                            Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 digit, and 1 special character.
                        </p>
                    </div>

                    {/* Language */}
                    <div>
                        <label htmlFor="lang" className="block mb-1 font-medium">
                            Language <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="lang"
                            name="lang"
                            value={formData.lang}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.lang ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                }`}
                        >
                            <option value="">Select a language</option>
                            {languages.map(lang => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                        {errors.lang && <p className="mt-1 text-sm text-red-500">{errors.lang}</p>}
                    </div>

                    {/* About Yourself */}
                    <div>
                        <label htmlFor="about" className="block mb-1 font-medium">
                            About Yourself <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="about"
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            rows="5"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.about ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                                }`}
                            placeholder="Tell us about yourself (minimum 50 characters, maximum 500 characters)"
                        ></textarea>
                        <div className="mt-1 flex justify-between">
                            <p className={`text-xs ${errors.about ? 'text-red-500' : 'text-gray-500'}`}>
                                {errors.about || `${formData.about.length}/500 characters`}
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!isFormValid || isSubmitting}
                            className={`w-full py-2 px-6 text-white font-medium rounded-md transition-colors ${isFormValid && !isSubmitting
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}