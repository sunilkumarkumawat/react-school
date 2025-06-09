import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
        <li className="breadcrumb-item text-sm">
          <Link className="opacity-5 text-dark" to="/">
            Pages
          </Link>
        </li>

        {pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;
          const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

          return (
            <li
              key={name}
              className={`breadcrumb-item text-sm ${
                isLast ? "text-dark active" : "opacity-5 text-dark"
              }`}
              aria-current={isLast ? "page" : undefined}
            >
              {isLast ? (
                displayName
              ) : (
                <Link className="text-dark" to={routeTo}>
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
