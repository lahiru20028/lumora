import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Video } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🕯️</span>
              Lumora Candles
            </h3>
            <p className="text-sm">Premium handcrafted candles for every occasion.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition">
                  All Candles
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-green-400" />
                <a href="tel:+94703527374" className="hover:text-white transition">
                  +94 70 352 7374
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-green-400" />
                <a href="mailto:lumora20250909@gmail.com" className="hover:text-white transition">
                  lumora20250909@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 font-bold">WA</span>
                <a href="https://wa.me/94703527374" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  +94 70 352 7374
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook size={16} className="text-green-400" />
                <a href="https://web.facebook.com/profile.php?id=61581403703247" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  Lumora candles
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Video size={16} className="text-green-400" />
                <a href="https://tiktok.com/@lumora.candles7" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  lumora.candles7
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-green-400" />
                <span>Horana, Sri Lanka</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-sm text-center text-gray-400">
            &copy; 2024 Lumora Candles. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
