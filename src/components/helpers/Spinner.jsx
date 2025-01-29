import React from "react";
import "./Spinner.css";

const Spinner = () => {
    return (
      <div className="flex h-[100%] items-center justify-center flex-col">
            <div className="box"></div>
            <span className="py-2 text-center text-lg">Loading...</span>
      </div>
    );
};

export default Spinner;
