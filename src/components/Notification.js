// Notification.js
import React from "react";

const Notification = () => {
    const notificationCount = 3; // Example count

    return (
        <>
          <a
            href="javascript:;"
            className="nav-link text-body p-0"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="material-symbols-rounded">notifications</i>
          </a>
          <ul
            className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4"
            aria-labelledby="dropdownMenuButton"
          >
            <li className="mb-2">
              <a className="dropdown-item border-radius-md" href="javascript:;">
                <div className="d-flex py-1">
                  <div className="my-auto">
                    <img
                      src="../assets/img/team-2.jpg"
                      className="avatar avatar-sm  me-3 "
                    />
                  </div>
                  <div className="d-flex flex-column justify-content-center">
                    <h6 className="text-sm font-weight-normal mb-1">
                      <span className="font-weight-bold">New message</span> from
                      Laur
                    </h6>
                    <p className="text-xs text-secondary mb-0">
                      <i className="fa fa-clock me-1" />
                      13 minutes ago
                    </p>
                  </div>
                </div>
              </a>
            </li>
            <li className="mb-2">
              <a className="dropdown-item border-radius-md" href="javascript:;">
                <div className="d-flex py-1">
                  <div className="my-auto">
                    <img
                      src="../assets/img/small-logos/logo-spotify.svg"
                      className="avatar avatar-sm bg-gradient-dark  me-3 "
                    />
                  </div>
                  <div className="d-flex flex-column justify-content-center">
                    <h6 className="text-sm font-weight-normal mb-1">
                      <span className="font-weight-bold">New album</span> by
                      Travis Scott
                    </h6>
                    <p className="text-xs text-secondary mb-0">
                      <i className="fa fa-clock me-1" />1 day
                    </p>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <a className="dropdown-item border-radius-md" href="javascript:;">
                <div className="d-flex py-1">
                  <div className="avatar avatar-sm bg-gradient-secondary  me-3  my-auto">
                    <svg
                      width="12px"
                      height="12px"
                      viewBox="0 0 43 36"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <title>credit-card</title>
                      <g
                        stroke="none"
                        strokeWidth={1}
                        fill="none"
                        fillRule="evenodd"
                      >
                        <g
                          transform="translate(-2169.000000, -745.000000)"
                          fill="#FFFFFF"
                          fillRule="nonzero"
                        >
                          <g transform="translate(1716.000000, 291.000000)">
                            <g transform="translate(453.000000, 454.000000)">
                              <path
                                className="color-background"
                                d="M43,10.7482083 L43,3.58333333 C43,1.60354167 41.3964583,0 39.4166667,0 L3.58333333,0 C1.60354167,0 0,1.60354167 0,3.58333333 L0,10.7482083 L43,10.7482083 Z"
                                opacity="0.593633743"
                              />
                              <path
                                className="color-background"
                                d="M0,16.125 L0,32.25 C0,34.2297917 1.60354167,35.8333333 3.58333333,35.8333333 L39.4166667,35.8333333 C41.3964583,35.8333333 43,34.2297917 43,32.25 L43,16.125 L0,16.125 Z M19.7083333,26.875 L7.16666667,26.875 L7.16666667,23.2916667 L19.7083333,23.2916667 L19.7083333,26.875 Z M35.8333333,26.875 L28.6666667,26.875 L28.6666667,23.2916667 L35.8333333,23.2916667 L35.8333333,26.875 Z"
                              />
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="d-flex flex-column justify-content-center">
                    <h6 className="text-sm font-weight-normal mb-1">
                      Payment successfully completed
                    </h6>
                    <p className="text-xs text-secondary mb-0">
                      <i className="fa fa-clock me-1" />2 days
                    </p>
                  </div>
                </div>
              </a>
            </li>
          </ul>
          </>
    );
};

export default Notification;
