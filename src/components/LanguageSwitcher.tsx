import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react"; // Lucide icon

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("language", selectedLanguage);
  };

  return (
    <div className="relative inline-flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-300">
      <Languages className="w-5 h-5 text-gray-600" />
      <select
        onChange={handleLanguageChange}
        value={i18n.language}
        className="bg-transparent focus:outline-none text-gray-800 font-medium cursor-pointer"
      >
        <option value="en">En</option>
        <option value="bn">বাংলা</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
