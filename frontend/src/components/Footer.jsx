import React from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          </Link>
          <p className="w-full md:w-2/3 text-gray-600">
          We bring you the latest fashion at affordable prices. From everyday wear to standout pieces, our goal is to make style accessible for everyone.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+977 9851037545</li>
            <li>ezzyshopfashionwear@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2024@ ezzefashion.com - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
