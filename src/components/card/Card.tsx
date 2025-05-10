import React from 'react';

interface CardProps {
    title: string;
    content: string;
    imgSrc: string;
}

const CardHomePage: React.FC<CardProps> = ({ title, content, imgSrc }) => {
    return (
        <div
            className="max-w-xs overflow-hidden bg-white border-2 border-black rounded-xl shadow-md transform transition-all duration-500 hover:shadow-lg hover:scale-105 relative group"
        >
            <div className="flex items-center p-5 text-gray-600">
                <img src={imgSrc} alt="" />
            </div>

            <div className="p-6 relative z-10">
                <p className="text-xl font-semibold text-gray-800">{title}</p>
                <p className="mt-2 text-gray-600">{content}</p>
            </div>
        </div>
    );
};

export default CardHomePage;