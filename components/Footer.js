import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaPinterest,
} from "react-icons/fa";
import { MdGroups } from "react-icons/md";

const Footer = () => {
  return (
    <>
      <footer className="relative ">
        <div className="pattan-shape"></div>
        <div className="footer-top-area bg-ash1">
          <div className="ft-top-abs-area">
            <div className="container">
              <div className="ft-top">
                <div className="ft-item">
                  <div className="ft-thumb">
                    <img
                      src="https://www.garbhsanskarguru.com/assets/image/others/01.png"
                      alt="footer"
                    />
                  </div>
                  <div className="ft-content">
                    <p>
                      <i>Give us a Call</i>
                    </p>
                    <h3>
                      For any query or assistance, please call or WhatsApp:{" "}
                      <a href="tel:+919727006001">+919727006001</a>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-top">
            <div className="container">
              <div className="ft-bottom">
                <div className="row justify-content-center no-gutters">
                  <div className="col-xl-4 col-lg-4 col-12 ll-text">
                    <div className="ft-title mb-4">
                      <h2>Download Now!</h2>
                    </div>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <a
                          href="https://apps.apple.com/in/app/garbh-sanskar-guru/id1457418508"
                          target="_blank"
                          className="mr-2"
                        >
                          <img
                            className="lazy img-fluid"
                            alt=""
                            draggable="false"
                            src="https://www.garbhsanskarguru.com/assets/image/others/AppStore.svg"
                          />
                        </a>
                      </div>
                      <div className="col-12 mb-3">
                        <a
                          href="https://play.google.com/store/apps/details?id=com.gs.garbhsanskarguru"
                          target="_blank"
                          className=""
                        >
                          <img
                            className="lazy img-fluid"
                            alt=""
                            draggable="false"
                            src="https://www.garbhsanskarguru.com/assets/image/others/Google-Play.svg"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-12">
                    <div
                      className="ft-about-part"
                      style={{ marginLeft: "10px" }}
                    >
                      <div className="ft-title mb-4">
                        <h2>Our Pages</h2>
                      </div>
                      <div className="row">
                        <div className="col-lg-12 ">
                          <ul className="widget-wrapper lab-ul">
                            <li className="mb-2">
                              <a
                                href="https://www.garbhsanskarguru.com/blog"
                                className="d-flex flex-wrap justify-content-between"
                              >
                                <span>
                                  <i className="icofont-double-right mr-1"></i>
                                  Blog
                                </span>
                              </a>
                            </li>

                            <li className="mb-2">
                              <a
                                href="https://www.garbhsanskarguru.com/events"
                                className="d-flex flex-wrap justify-content-between"
                              >
                                <span>
                                  <i className="icofont-double-right mr-1"></i>
                                  Events{" "}
                                </span>
                              </a>
                            </li>
                            <li className="mb-2">
                              <a
                                href="https://www.garbhsanskarguru.com/franchise"
                                className="d-flex flex-wrap justify-content-between"
                              >
                                <span>
                                  <i className="icofont-double-right mr-1"></i>
                                  Franchise
                                </span>
                              </a>
                            </li>
                            <li className="mb-2">
                              <a
                                href="https://www.garbhsanskarguru.com/faq"
                                className="d-flex flex-wrap justify-content-between"
                              >
                                <span>
                                  <i className="icofont-double-right mr-1"></i>
                                  FAQ{" "}
                                </span>
                              </a>
                            </li>
                            <li className="mb-2">
                              <a
                                href="https://www.garbhsanskarguru.com/contact-us"
                                className="d-flex flex-wrap justify-content-between"
                              >
                                <span>
                                  <i className="icofont-double-right mr-1"></i>
                                  Contact Us
                                </span>
                              </a>
                            </li>
                            <li className="mb-2">
                              <a
                                href="https://www.garbhsanskarguru.com/terms-condition"
                                className="d-flex flex-wrap justify-content-between"
                              >
                                <span>
                                  <i className="icofont-double-right mr-1"></i>
                                  Terms of Services
                                </span>
                              </a>
                            </li>
                            <li className="mb-2">
                              <a
                                href="https://www.garbhsanskarguru.com/privacy-policy"
                                className="d-flex flex-wrap justify-content-between"
                              >
                                <span>
                                  <i className="icofont-double-right mr-1"></i>
                                  Privacy Policy
                                </span>
                              </a>
                            </li>
                            <li className="mb-2">
                              <Link
                                href="/refund-policy"
                                className="d-flex flex-wrap justify-content-between"
                              >
                                <span>
                                  <i className="icofont-double-right mr-1"></i>
                                  Refund Policy
                                </span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-12 ll-text">
                    <div className="ft-about-part">
                      <div className="ft-title mb-4">
                        <h2>Our Parenting Solution</h2>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="media">
                            <a
                              target="_blank"
                              href="https://www.parentingguru.co.in/"
                            >
                              <img
                                className="mr-3 img-fluid"
                                src="https://www.garbhsanskarguru.com/assets/image/banner/footer-app.jpeg"
                                alt="image"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom bg-ash">
            <div className="container">
              <div className="section-wrapper">
                <div className="left">
                  <Link href={"/"}>
                    <img
                      src="/images/Logo_MGPS.png"
                      width="70"
                      alt="footer-logo"
                    />
                  </Link>
                </div>
                <ul className="right lab-ul" style={{ listStyle: "none" }}>
                  <li>
                    <a
                      target="_blank"
                      className="pinterest"
                      href="https://community.garbhsanskarguru.com/"
                      style={{ fontSize: "20px" }}
                    >
                      <MdGroups />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      className="facebook"
                      href="https://www.facebook.com/MAJESTICGARBHSANSKAR"
                    >
                      <FaFacebook />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      className="pinterest"
                      href="https://www.youtube.com/channel/UCrQ2-hzImdJ4A3BD0yIYm-A?sub_confirmation=1"
                    >
                      <FaYoutube />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      className="pinterest"
                      href="https://www.instagram.com/garbhsanskarguru/"
                    >
                      <FaInstagram />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      className="pinterest"
                      href="https://in.pinterest.com/mgarbhsanskar"
                    >
                      <FaPinterest />
                    </a>
                  </li>
                  <li>
                    <a
                      target="_blank"
                      className="pinterest"
                      href="https://garbhsanskarguru.quora.com"
                    >
                      <img
                        src="https://www.garbhsanskarguru.com/assets/image/logo/icons8-quora.svg"
                        alt="logo"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="copy-right-part style-2 bg-pink">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <p className="text-white">
                  © 2024
                  <a href="index" className="text-white">
                    GarbhSanskar. All rights reserved.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div> */}

        <div className="copy-right-part style-2 bg-pink">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <p className="text-white">
                  © 2024 GarbhSanskar. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
