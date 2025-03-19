import React from 'react';
import { Mail, Phone, Award, BookOpen, ClipboardList, Star } from 'lucide-react';


const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-6">About TouRide</h1>
                
                {/* Introduction */}
                <section className="mb-8 text-center">
                    <p className="text-lg text-gray-700">
                        TouRide is an educational web-based course designed to help tourists, immigrants, and newcomers
                        familiarize themselves with Ontario’s traffic laws. Driving in a new country or province can be
                        challenging, especially with unfamiliar rules and road signs. TouRide simplifies this learning process,
                        ensuring drivers gain the confidence and knowledge needed to navigate Ontario’s roads safely and legally.
                    </p>
                </section>
                
                {/* How It Works */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-lg p-6 shadow-md">
                            <BookOpen className="text-blue-600 w-8 h-8 mb-4" />
                            <h3 className="font-bold text-xl mb-2">Learn</h3>
                            <p className="text-gray-700">
                                Enroll in the TouRide course and complete engaging, easy-to-follow lessons covering
                                Ontario's traffic laws, road signs, and best driving practices.
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-6 shadow-md">
                            <ClipboardList className="text-blue-600 w-8 h-8 mb-4" />
                            <h3 className="font-bold text-xl mb-2">Test Your Knowledge</h3>
                            <p className="text-gray-700">
                                Complete interactive quizzes to reinforce key concepts.
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-6 shadow-md">
                            <Award className="text-blue-600 w-8 h-8 mb-4" />
                            <h3 className="font-bold text-xl mb-2">Get Certified</h3>
                            <p className="text-gray-700">
                                Upon successful completion, receive a certificate verified by the Ministry of
                                Transportation of Ontario (MTO).
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-6 shadow-md">
                            <Star className="text-blue-600 w-8 h-8 mb-4" />
                            <h3 className="font-bold text-xl mb-2">Unlock Discounts</h3>
                            <p className="text-gray-700">
                                Present your certificate to participating insurance companies and rental agencies for potential discounts.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why Choose TouRide */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose TouRide?</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>
                            <strong>For Drivers:</strong> Gain essential knowledge to drive safely and confidently in Ontario while enjoying potential financial benefits.
                        </li>
                        <li>
                            <strong>For the MTO:</strong> Improved driver awareness leads to fewer accidents, making Ontario roads safer.
                        </li>
                        <li>
                            <strong>For Insurance Companies & Rental Agencies:</strong> Well-informed drivers reduce risk, creating a win-win situation for businesses and customers alike.
                        </li>
                    </ul>
                </section>

                {/* FAQ */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions (FAQ)</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="font-bold">How long does the course take?</h3>
                            <p>Most people complete it within 30 minutes.</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="font-bold">How much does it cost?</h3>
                            <p>$20.</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="font-bold">Is the certificate valid for all insurance companies?</h3>
                            <p>Please check with your provider for specific details.</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="font-bold">Do I need this course if I have an international license?</h3>
                            <p>Yes, it’s beneficial for understanding Ontario's specific rules.</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                            <h3 className="font-bold">Can I do this course as an Ontario resident/citizen?</h3>
                            <p>Yes! It helps bolster your driving knowledge.</p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Have More Questions?</h2>
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="flex items-center">
                            <Mail className="text-blue-600 w-6 h-6 mr-2" />
                            <a href="mailto:email@example.com" className="text-blue-600 hover:underline">email@example.com</a>
                        </div>
                        <div className="flex items-center">
                            <Phone className="text-blue-600 w-6 h-6 mr-2" />
                            <a href="tel:+11234567890" className="text-blue-600 hover:underline">+1 (123) 456-7890</a>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-700 font-semibold">
                        Join TouRide today and take the first step toward becoming a safer, more knowledgeable driver in Ontario!
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About;
